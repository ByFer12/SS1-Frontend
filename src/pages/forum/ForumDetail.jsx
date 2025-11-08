import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  Textarea,
  Button,
  HStack,
  Avatar,
  Input,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "../posts/PostModalLogin";
import api from "../../api/axios";
import { FaHeart, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function ForumDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [forum, setForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [numLikes, setNumLikes] = useState(0);

  const fetchForum = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setForum(res.data);
    } catch (err) {
      console.error("Error al cargar foro:", err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`);
      console.log("Comentarios cargados:", res.data);
      setComments(res.data);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
    }
  };

  const handleLike = async (id) => {
    if (!user) return onOpen();
    try {
      const res = await api.post(`/likes/${id}`);
      setForum((prev) => ({ ...prev, likeCount: res.data.likeCount }));
    } catch (err) {
      console.error("Error al dar like:", err);
    }
  };

  const getLikesCount = async () => {
    try {
      const res = await api.get(`/likes/${id}/count`);
      setNumLikes(res.data.likeCount);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async () => {
    if (!user) return onOpen();
    if (!newComment.trim()) return;
    try {
      await api.post(`/comments/${id}`, { content: newComment });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Error al comentar:", err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
    }
  };

  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleEdit = async (commentId) => {
    try {
      await api.put(`/comments/${commentId}`, { content: editContent });
      setEditingId(null);
      setEditContent("");
      fetchComments();
    } catch (err) {
      console.error("Error al editar comentario:", err);
    }
  };

  useEffect(() => {
    fetchForum();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (forum) {
      getLikesCount();
    }
  }, [forum]);

  if (!forum) return <Text color="white">Cargando foro...</Text>;

  return (
    <Box bgGradient="linear(to-br, gray.900, teal.800)" color="white" minH="100vh" px={{ base: 6, md: 16 }} py={10}>
      <VStack spacing={4} align="center" mb={6}>
        <Avatar
          size="xl"
          src={forum.author?.avatar_url}
          name={forum.author?.username}
          border="3px solid"
          borderColor="yellow.400"
        />
        <Heading color="yellow.300" textAlign="center">
          {forum.title}
        </Heading>
        <Text color="whiteAlpha.800" textAlign="center" maxW="3xl">
          {forum.content}
        </Text>
        <Text fontSize="sm" color="whiteAlpha.600">
          Creado por {forum.author?.full_name || forum.author?.username} •{" "}
          {new Date(forum.created_at).toLocaleString()}
        </Text>

        {/* Botón de Like */}
        <Button colorScheme="pink" leftIcon={<FaHeart />} onClick={() => handleLike(forum.id)}>
          {numLikes || 0} Me gusta
        </Button>
      </VStack>

      <Divider mb={4} />

      <Heading size="md" mb={4}>
        Comentarios ({comments.length})
      </Heading>
      <VStack align="stretch" spacing={4}>
        {comments.map((c) => (
          <Box key={c.id} bg="whiteAlpha.100" p={4} borderRadius="md">
            <HStack spacing={3} justify="space-between">
              <HStack>
                <Avatar size="sm" src={c.user?.avatar_url} name={c.user?.username} />
                <Box>
                  <Text fontWeight="bold" color="teal.200">
                    {c.user?.username}
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.700">
                    {new Date(c.created_at).toLocaleString()}
                  </Text>
                </Box>
              </HStack>

              {/* Solo autor o admin puede editar/eliminar */}
              {user && (user.id === c.user?.id || user.role?.name === "ADMIN") && (
                <HStack>
                  {editingId === c.id ? (
                    <>
                      <IconButton
                        icon={<FaSave />}
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleEdit(c.id)}
                      />
                      <IconButton
                        icon={<FaTimes />}
                        colorScheme="gray"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      />
                    </>
                  ) : (
                    <>
                      <IconButton
                        icon={<FaEdit />}
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => startEditing(c)}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(c.id)}
                      />
                    </>
                  )}
                </HStack>
              )}
            </HStack>

            {/* Modo edición o lectura */}
            {editingId === c.id ? (
              <Textarea
                mt={2}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
            ) : (
              <Text mt={2}>{c.content}</Text>
            )}
          </Box>
        ))}
      </VStack>

      <Box mt={8}>
        {user ? (
          <>
            <Textarea
              placeholder="Escribe tu aporte..."
              bg="whiteAlpha.100"
              mb={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button colorScheme="teal" onClick={handleComment}>
              Publicar
            </Button>
          </>
        ) : (
          <Box bg="whiteAlpha.100" p={5} borderRadius="md" textAlign="center" border="1px dashed whiteAlpha.300">
            <Text mb={3}>Debes iniciar sesión para participar en este foro.</Text>
            <Button colorScheme="yellow" onClick={onOpen}>
              Iniciar sesión
            </Button>
          </Box>
        )}
      </Box>

      <PostModalLogin isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
