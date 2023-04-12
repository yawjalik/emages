import { Box, Heading, Text, Image } from "@chakra-ui/react";
import { FC } from "react";
import { ImageType } from "./imageTypes";

interface ImageCardProps {
    image: ImageType;
}

const ImageCard : FC<ImageCardProps> = ({ image }) => {
    return (
        <Box bg="gray.50" border="px" borderColor="gray.100" shadow="lg" _hover={{shadow: "2xl"}} transition="ease-in" transitionDuration="100ms" rounded="lg" p={4}>
            <Heading size="md">{image.name}</Heading>
            <Text>{image.description}</Text>
            <Image src={image.url} alt={image.name} boxSize={["100px", "120px"]} />
        </Box>
    );
}

export default ImageCard;