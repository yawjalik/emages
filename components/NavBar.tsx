import { FC } from "react";
import { Box, Button, Flex, Heading, Menu, MenuButton, MenuList, MenuItem, useMediaQuery, HStack, Text } from "@chakra-ui/react";
import { HamburgerIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";
import Link from "next/link";

const NavBar: FC = () => {
    const [isDesktop] = useMediaQuery("(min-width: 30em)");

    return (
        <Flex gap={8} justify={isDesktop ? "around" : "space-between"} align="center" marginBottom={8}>
            <Heading size="xl">EMages</Heading>
            {isDesktop ? (
                <Box>
                    <Link href="/"><Button colorScheme="teal" variant="ghost">Search</Button></Link>
                    <Link href="/upload"><Button colorScheme="teal" variant="ghost">Upload</Button></Link>
                </Box>
            ) : (
                <Menu>
                    <MenuButton as={Button} colorScheme="teal" variant="ghost" rounded="lg">
                        <HamburgerIcon boxSize="1.5em" />
                    </MenuButton>
                    <MenuList>
                        <Link href="/">
                            <MenuItem>
                                <HStack spacing={2}>
                                    <SearchIcon/><Text>Search</Text>
                                </HStack>
                            </MenuItem>
                        </Link>
                        <Link href="/upload">
                            <MenuItem>
                                <HStack spacing={2}>
                                    <AddIcon/><Text>Upload</Text>
                                </HStack>
                            </MenuItem>
                        </Link>
                    </MenuList>
                </Menu>
            )}
        </Flex>
    );
};

export default NavBar;