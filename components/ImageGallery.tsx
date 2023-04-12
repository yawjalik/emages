import { FC } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import ImageCard from "./ImageCard";
import { ImageType } from "./imageTypes";

interface ImageGalleryProps {
    images: ImageType[];
}

const ImageGallery: FC<ImageGalleryProps> = ({ images }) => {
    return (
        <SimpleGrid minChildWidth="300px" spacing={4} w="full">
            {images.map((image, key) => (
                <ImageCard key={key} image={image} />
            ))}
        </SimpleGrid>
    );
}

export default ImageGallery;