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
} from "@chakra-ui/react";
import { FaHeart, FaComment } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "./PostModalLogin";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function PostCard({ post, refresh }) {
  const { user, token } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const API_URL = import.meta.env.VITE_API_URL;
  const [numLikes, setNumLikes] = useState(0);
  const [comments, setComments] = useState([]);


  const getLikesCount = async () => {
    
    try {
      const res = await api.get(`/likes/${post.id}/count`);
      console.log("Número de likes recibido del servidor:", res.data.likeCount );
      setNumLikes(res.data.likeCount);
    } catch (err) {
      console.error(err);
    }
  };


const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${post.id}`);
      console.log("Post cargado:", res.data);
      console.log("Comentarios cargados:", res.data);
     setComments(res.data);
    console.log ("cantidad de comentarios recibidos:", res.data.length );
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
    }
  };
useEffect(() => {
  if (post) {
    getLikesCount(); 
    fetchComments();
  }
}, [post]);


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

        <HStack spacing={4} pt={2}>
          <Button size="sm" colorScheme="pink" variant="ghost" leftIcon={<FaHeart />} disabled>
            {numLikes || 0}
          </Button>
          <Button size="sm" colorScheme="blue" variant="ghost" leftIcon={<FaComment />}>
            {comments.length || 0}
          </Button>
        </HStack>
      </VStack>

      <PostModalLogin isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
