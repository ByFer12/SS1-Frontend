import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Heading,
  Input,
  VStack,
  Spinner,
  Container,
  Text,
} from "@chakra-ui/react";
import PostCard from "./PostCard";
import { useNavigate } from "react-router-dom";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/posts`);
        console.log("Respuesta recibida del servidor:", response);
        if (!response.ok) throw new Error("Error al cargar los posts");
        const data = await response.json();
        console.log("Posts cargados:", data);
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [API_URL]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.summary?.toLowerCase().includes(search.toLowerCase()) ||
      post.content?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner mt="10" />;

  return (
    <Box bgGradient="linear(to-br, gray.900, teal.800)" minH="100vh" color="white" py={10}>
      <Container maxW="6xl">
        <Heading mb={6} textAlign="center" color="yellow.300">
          Noticias
        </Heading>

        <VStack mb={6}>
          <Input
            placeholder="Buscar noticias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="whiteAlpha.200"
            _placeholder={{ color: "whiteAlpha.700" }}
            color="white"
          />
        </VStack>

        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
          {filteredPosts.map((post) => (
            <Box
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              cursor="pointer"
              _hover={{ transform: "scale(1.02)", transition: "1s" }}
            >
              <PostCard post={post} />
            </Box>
          ))}
        </Grid>

        {filteredPosts.length === 0 && (
          <Text mt={10} textAlign="center">
            No se encontraron publicaciones.
          </Text>
        )}
      </Container>
    </Box>
  );
}
