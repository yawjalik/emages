import { FC } from "react";
import { HStack, Input, Flex, useMediaQuery } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface SearchBarProps {
    search: string;
    setSearch: (search: string) => void;
    isLoading: boolean;
}

const SearchBar: FC<SearchBarProps> = ({ search, setSearch, isLoading }) => {
    const router = useRouter();

    const [isDesktop] = useMediaQuery("(min-width: 30em)");

    return (
        <Flex flexDirection={isDesktop ? "row" : "column"} gap={4} w="full">
            <Input type="text" placeholder="Search an image by description" onChange={(e) => setSearch(e.target.value.trim())} focusBorderColor="teal.400"/>
            <Input type="submit" cursor="pointer" name="search" value="Search" w="auto" disabled={isLoading} onClick={() => router.push(search ? `/?q=${search}` : "/")} />
        </Flex>
    );
}

export default SearchBar;