import { FC } from "react";
import { Box, CloseButton, HStack, Heading, Image, Input } from "@chakra-ui/react";
import { CreateImageType } from "./imageTypes";

interface UploadImageCardProps {
    id: string;
    image: CreateImageType;
    removeImage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const UploadImageCard: FC<UploadImageCardProps> = ({ id, image, removeImage }) => {
    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        image.description = e.target.value;
    }

    return (
        <Box bg="gray.100" border="1px" borderColor="gray.200" w={["xs", "md", "xl", "2xl"]} p={4} rounded="xl" transition="ease-in" transitionDuration="100ms" shadow="lg" _hover={{shadow: "xl"}}>
            <HStack justify="space-between" mb={2}>
                <Heading size="md">{image.name.toUpperCase()}</Heading>
                <CloseButton id={id} onClick={removeImage} />
            </HStack>
            
            <HStack spacing={8}>
                <Image boxSize={["100px", "150px", "180px", "200px"]} rounded="lg" src={image.uri} alt="Image" />
                <Input type="text" placeholder="Image description" variant="" onInput={onInput} required={true}/>
            </HStack>
        </Box>
    );
}

export default UploadImageCard