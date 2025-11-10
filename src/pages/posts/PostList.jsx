// src/pages/posts/PostList.jsx
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
  useDisclosure, // Importado
  useToast, // Importado
} from "@chakra-ui/react";
import PostCard from "./PostCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importado
import PostModalLogin from "./PostModalLogin"; // Importado
import api from "../../api/axios"; // Importado

export default function PostList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Lógica de compartir (usada por PostCard)
  const handleShare = async (id, isShared) => {
    try {
      if (!isShared) {
        await api.post(`/shares/${id}/share`);
        toast({
          title: "Publicación compartida",
          description: "Tu publicación se ha compartido exitosamente.",
          status: "success",
          duration: 2500,
          position: "top",
        });
      } else {
        await api.delete(`/shares/${id}/unshare`);
        toast({
          title: "Compartido eliminado",
          description: "Ya no estás compartiendo esta publicación.",
          status: "info",
          duration: 2500,
          position: "top",
        });
      }

      // Actualiza el estado local
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isShared: !isShared } : p
        )
      );
    } catch (err) {
      console.error("Error al compartir:", err);
      toast({
        title: "Error al compartir",
        description: "No se pudo realizar la acción.",
        status: "error",
        duration: 2500,
        position: "top",
      });
    }
  };


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Usamos la instancia de axios/api
        const response = await api.get("/posts"); 
        
        // Asume que response.data contiene el arreglo de posts
        setPosts(response.data); 

      } catch (error) {
        console.error("Error al cargar posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); 

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
              <PostCard 
                post={post} 
                isShared={post.isShared || false} 
                handleShare={handleShare}         
                onOpenLoginModal={onOpen}         
              />
            </Box>
          ))}
        </Grid>

        {filteredPosts.length === 0 && (
          <Text mt={10} textAlign="center">
            No se encontraron publicaciones.
          </Text>
        )}
      </Container>
      
      {/* Modal de Login */}
      <PostModalLogin isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}