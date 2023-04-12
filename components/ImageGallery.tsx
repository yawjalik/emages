import { FC } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import ImageCard from "./ImageCard";
import { ImageType } from "./imageTypes";

interface ImageGalleryProps {
    images: ImageType[];
}

const ImageGallery: FC<ImageGalleryProps> = ({ images }) => {
    return (
        <SimpleGrid minChildWidth="250px" spacing={4}>
            {images.map((image, key) => (
                <ImageCard key={key} image={image} />
            ))}
        </SimpleGrid>
    );
}

export default ImageGallery;