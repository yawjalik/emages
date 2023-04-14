import { useState } from "react";
import { useRouter } from "next/router";
import { Flex, Input, VStack, ScaleFade, useToast, useMediaQuery } from "@chakra-ui/react";
import base64encode from "../utils/base64encode";
import UploadImageCard from "@/components/UploadImageCard";
import { CreateImageType } from "@/components/imageTypes";

export default function UploadImages() {
  const [images, setImages] = useState<Array<CreateImageType>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();

  const [isDesktop] = useMediaQuery("(min-width: 30em)");

  const handleImage = async(e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      toast({ title: "No image selected", status: "error", duration: 3000, isClosable: true });
      return;
    }
    if (e.target.files.length + images.length > 5) {
      toast({ title: "Max 5 images allowed", status: "error", duration: 3000, isClosable: true });
      return;
    }

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];

      // Checks
      if (file.type !== "image/png") {
        toast({ title: "Only PNG image allowed", status: "error", duration: 3000, isClosable: true });
        continue;
      }
      if (file.size > 5000000) {
        toast({ title: "Image size must be less than 5MB", status: "error", duration: 3000, isClosable: true });
        continue;
      }

      // Encode images
      const uri = await base64encode(file);
      const htmlImage = new Image;
      htmlImage.src = uri;      
      
      // Get image dimensions
      htmlImage.onload = () => {
        const { height, width } = htmlImage;
        console.log(width, height)
        const newImage: CreateImageType = {
          name: file.name,
          description: "",
          uri,
          height: height,
          width: width,
        };
        setImages((prev) => [...prev, newImage]);
      }
    }
  }

  const handleUpload = async () => {
    setLoading(true);

    // Checks
    if (images.length === 0) {
      toast({ title: "Upload at least one image", status: "error", duration: 3000, isClosable: true });
      setLoading(false);
      return;
    }
    for (const { description } of images) {
      if (!description || description === "") {
        toast({ title: "Please fill all descriptions", status: "error", duration: 3000, isClosable: true });
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(images),
      });
  
      if (response.status === 201) {
        toast({ title: "Images uploaded", status: "success", duration: 3000, isClosable: true });
        router.push("/", undefined, { shallow: false });
      } else {
        const { message } = await response.json();
        toast({ title: message ? message : "Failed to upload images", status: "error", duration: 3000, isClosable: true });
      }
    } catch (err) {
      console.log(err);
      toast({ title: "Failed to upload images", status: "error", duration: 3000, isClosable: true });
    }
    setLoading(false);
  }

  const removeImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const index = parseInt(e.currentTarget.id);
    setImages((prev) => prev.filter((_, key) => key !== index));
  }

  return (
    <VStack spacing={10}>
      <VStack spacing={4}>
        {
          images.map((image, key) => (
            <ScaleFade in={true} key={key}>
              <UploadImageCard id={key.toString()} image={image} removeImage={removeImage} />
            </ScaleFade>
          ))
        }
      </VStack>
      <Flex flexDirection={isDesktop ? "row" : "column"} justify="center" gap={4}>
        <Input type="file" cursor="pointer" w="auto" accept="image/png" multiple onChange={handleImage} disabled={images.length >= 5} />
        <Input type="submit" cursor="pointer" name="upload" id="" w="auto" onClick={handleUpload} disabled={loading}/>
      </Flex>
    </VStack>
  );
}
