import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import ImageGallery from "@/components/ImageGallery";
import { useToast, Spinner, Heading, Flex, useMediaQuery } from "@chakra-ui/react";
import SearchBar from "@/components/SearchBar";

const SearchImages: FC = () => {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const toast = useToast();

  const [isDesktop] = useMediaQuery("(min-width: 30em)");

  const { data, isLoading, isFetching, refetch } = useQuery("images", async () => {
    const { q } = router.query;
    const res = await fetch(`/api/search${q ? "?q=" + q : ""}`, { method: "GET" });
    if (!res.ok) {
      const { message } = await res.json();
      toast({ title: message, status: "error", duration: 3000, isClosable: true });
      return;
    }
    const images = await res.json();
    return images;
  });

  useEffect(() => {
    refetch();
  }, [router.query, refetch]);

  return (
      <Flex direction="column" align="center" mx="auto" gap={10} w={isDesktop ? "80%" : "full"}>
        <SearchBar search={search} setSearch={setSearch} isLoading={isLoading} />
        {
          isLoading || isFetching ? <Spinner color="teal.500" emptyColor="gray.200" size="xl" thickness="4px" speed="0.65s"/> : 
          data ? 
            <ImageGallery images={data} /> 
          : <Heading size="lg">No images found</Heading>
        }
      </Flex>
  );
}

export default SearchImages;