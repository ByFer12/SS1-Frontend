// src/pages/articles/ArticleList.jsx
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  HStack,
  Divider,
  Avatar,
  IconButton,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";

import { FaHeart, FaPlus, FaExclamationTriangle,FaShare,FaCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "../posts/PostModalLogin";
import api from "../../api/axios";

export default function ArticleList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      const res = await api.get("/posts/articles");
      setArticles(res.data);
    } catch (err) {
      console.error("Error al cargar artículos:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleShare = async (id, isShared) => {
  if (!user) return onOpen();
  try {
    if (!isShared) {
      await api.post(`/shares/${id}/share`);
      toast({
        title: "Artículo compartido",
        description: "Tu publicación se ha compartido exitosamente.",
        status: "success",
        duration: 2500,
        position: "top",
      });
    } else {
      await api.delete(`/shares/${id}/unshare`);
      toast({
        title: "Compartido eliminado",
        description: "Ya no estás compartiendo este artículo.",
        status: "info",
        duration: 2500,
        position: "top",
      });
    }

    // Actualiza el estado local (inversión del flag)
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, isShared: !isShared } : a
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



  const handleLike = async (id) => {
    if (!user) return onOpen();
    try {
      const res = await api.post(`/likes/${id}`);
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, likeCount: res.data.likeCount } : a
        )
      );
    } catch (err) {
      console.error("Error al dar like:", err);
    }
  };


  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
        <Text color="whiteAlpha.700" mt={4}>Cargando artículos...</Text>
      </Box>
    );

  return (
    <Box
      bgGradient="linear(to-br, gray.900, teal.800)"
      color="white"
      minH="100vh"
      px={{ base: 6, md: 16 }}
      py={10}
    >
      <HStack justify="space-between" mb={6}>
        <Heading color="yellow.300">Artículos</Heading>
        {user ? (
          <Button
            leftIcon={<FaPlus />}
            colorScheme="yellow"
            onClick={() => navigate("/articles/new")}
          >
            Nuevo artículo
          </Button>
        ) : (
          <Button
            leftIcon={<FaPlus />}
            colorScheme="yellow"
            variant="outline"
            onClick={onOpen}
          >
            Nuevo artículo
          </Button>
        )}
      </HStack>

      <VStack spacing={4} align="stretch">
        {articles.map((a) => (
          <Box
            key={a.id}
            bg="whiteAlpha.100"
            borderRadius="md"
            p={5}
            _hover={{ bg: "whiteAlpha.200", cursor: "pointer" }}
          >
            <HStack justify="space-between" align="start">
              <Box flex="1" onClick={() => navigate(`/articles/${a.id}`)}>
                <HStack spacing={3} mb={2}>
                  <Avatar
                    size="sm"
                    src={a.author?.avatar_url}
                    name={a.author?.username}
                  />
                  <Box>
                    <Heading size="sm" color="teal.200">
                      {a.title}
                    </Heading>
                    <Text fontSize="sm" color="whiteAlpha.700">
                      Por {a.author?.full_name || a.author?.username}
                    </Text>
                  </Box>
                </HStack>
                <Text noOfLines={2} color="whiteAlpha.800">
                  {a.summary || a.content}
                </Text>
                <Text fontSize="xs" color="whiteAlpha.600" mt={1}>
                  Publicado: {new Date(a.created_at).toLocaleDateString()}
                </Text>
              </Box>

              <VStack>
                <IconButton
                  aria-label="like"
                  icon={<FaHeart />}
                  colorScheme="pink"
                  variant="ghost"
                  onClick={() => handleLike(a.id)}
                />
                <Text fontSize="sm">{a.likeCount || 0}</Text>
              </VStack>
            </HStack>

            <Divider my={3} />
            <HStack justify="space-between">
              <Button
                size="sm"
                colorScheme="yellow"
                variant="outline"
                onClick={() => navigate(`/articles/${a.id}`)}
              >
                Leer más
              </Button>
                <VStack>
  <IconButton
    aria-label="share"
    icon={a.isShared ? <FaCheck /> : <FaShare />}
    colorScheme={a.isShared ? "teal" : "yellow"}
    variant="ghost"
    onClick={() => handleShare(a.id, a.isShared)}
  />
  <Text fontSize="sm">
    {a.isShared ? "Compartido" : "Compartir"}
  </Text>
</VStack>
            </HStack>
          </Box>
        ))}
      </VStack>

      <PostModalLogin isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
