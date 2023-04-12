import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import ImageGallery from "@/components/ImageGallery";
import { useToast, Spinner, Heading, VStack, ScaleFade } from "@chakra-ui/react";
import SearchBar from "@/components/SearchBar";

const SearchImages: FC = () => {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const toast = useToast();

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
      <VStack spacing={10}>
        <SearchBar search={search} setSearch={setSearch} isLoading={isLoading} />
        {
          isLoading || isFetching ? <Spinner color="teal.500" emptyColor="gray.200" size="xl" thickness="4px" speed="0.65s"/> : 
          data ? 
          <ScaleFade in={true}>
            <ImageGallery images={data} /> 
          </ScaleFade>
          : <Heading size="lg">No images found</Heading>
        }
      </VStack>
  );
}

export default SearchImages;