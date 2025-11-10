// src/pages/posts/PostCard.jsx
import {
  Box,
  Heading,
  Text,
  Image,
  HStack,
  Button,
  Badge,
  VStack,
  useDisclosure,
  IconButton, // Importar IconButton
} from "@chakra-ui/react";
import { FaHeart, FaComment, FaShare, FaCheck } from "react-icons/fa"; 
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "./PostModalLogin";
import { useState, useEffect } from "react";
import api from "../../api/axios";

// Recibimos las nuevas props: isShared, handleShare y onOpenLoginModal
export default function PostCard({ post, refresh, isShared, handleShare, onOpenLoginModal }) {
  const { user, token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  const [numLikes, setNumLikes] = useState(0);
  const [comments, setComments] = useState([]);

  // --- Funciones RESTAURADAS (para el useEffect) ---
  
  const getLikesCount = async () => {
    try {
      const res = await api.get(`/likes/${post.id}/count`);
      // console.log("Número de likes recibido del servidor:", res.data.likeCount );
      setNumLikes(res.data.likeCount);
    } catch (err) {
      console.error("Error al obtener likes:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${post.id}`);
      // console.log("Comentarios cargados:", res.data);
      setComments(res.data);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
    }
  };
  
  // --- Fin de Funciones RESTAURADAS ---

  useEffect(() => {
    if (post) {
      getLikesCount(); 
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);


  // Función envoltorio para compartir
  const onShareClick = (e) => {
    e.stopPropagation(); // Evita la navegación del PostCard
    if (!user) {
        onOpenLoginModal(); // Llama a la función del padre para abrir el modal
    } else {
        handleShare(post.id, isShared);
    }
  };

  // Función envoltorio para likes (opcional, para evitar que navegue)
  const onLikeClick = (e) => {
    e.stopPropagation(); // Evita la navegación del PostCard
    // Aquí podrías agregar la lógica de like si estuviera en PostCard
    // Por ahora solo evita que navegue al darle click al corazón
  };


  return (
    <Box
      bg="whiteAlpha.100"
      borderRadius="lg"
      overflow="hidden"
      shadow="lg"
      _hover={{ shadow: "2xl", transform: "scale(1.02)", transition: "0.2s" }}
    >
      <Image src={post.cover_image_url} alt={post.title} objectFit="cover" w="100%" h="180px" />

      <VStack align="start" spacing={2} p={4}>
        {post.categories.length > 0 && <Badge colorScheme="teal">{post.categories[0].name}</Badge>}
        <Heading size="md" color="yellow.200">{post.title}</Heading>
        <Text color="whiteAlpha.800" noOfLines={3}>{post.summary}</Text>

        <HStack justify="space-between" w="full" pt={2}> 
            <HStack spacing={4}>
              <Button 
                size="sm" 
                colorScheme="pink" 
                variant="ghost" 
                leftIcon={<FaHeart />} 
                disabled 
                onClick={onLikeClick} // Evita la navegación si el usuario da click
              >
                {numLikes || 0}
              </Button>
              <Button size="sm" colorScheme="blue" variant="ghost" leftIcon={<FaComment />}>
                {comments.length || 0}
              </Button>
            </HStack>
            
            {/* BOTÓN DE COMPARTIR */}
            <VStack spacing={0}>
              <IconButton
                aria-label="share"
                icon={isShared ? <FaCheck /> : <FaShare />}
                colorScheme={isShared ? "teal" : "yellow"}
                variant="ghost"
                onClick={onShareClick} // Usar el handler local
                size="sm"
              />
              <Text fontSize="xs" color="whiteAlpha.700">
                {isShared ? "Compartido" : "Compartir"}
              </Text>
            </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}