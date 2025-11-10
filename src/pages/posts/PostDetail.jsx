import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  Button,
  Divider,
  Textarea,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "./PostModalLogin";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth(); // token del usuario logeado
  const { isOpen, onOpen, onClose } = useDisclosure();

  const API_URL = import.meta.env.VITE_API_URL;
const [editingComment, setEditingComment] = useState(null);
const [editText, setEditText] = useState("");

  const [post, setPost] = useState(null);
  const [numLikes, setNumLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
const [editingCommentId, setEditingCommentId] = useState(null);


  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/posts/${id}`);
      if (!res.ok) throw new Error("Error al cargar el post");
      const data = await res.json();
      setPost(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchComments = async () => {
  try {
    const res = await api.get(`/comments/${id}`);
    console.log("Post cargado:", res.data);
    console.log("Comentarios cargados:", res.data);
   setComments(res.data);
  console.log ("cantidad de comentarios recibidos:", res.data.length );
  } catch (err) {
    console.error("Error al cargar comentarios:", err);
  }
};

const handleUpdateComment = async (commentId) => {
  try {
    const res = await api.put(`/comments/${commentId}`, { content: editText });
    console.log("Comentario actualizado:", res.data);
    setEditingComment(null);
    setEditText("");
    await fetchPost(); // refrescar los comentarios actualizados
  } catch (err) {
    console.error("Error al actualizar comentario:", err);
  }
};


  const getLikesCount = async () => {
    
    try {
      const res = await api.get(`/likes/${post.id}/count`);
      console.log("Número de likes recibido del servidor:", res.data.likeCount );
      setNumLikes(res.data.likeCount);
    } catch (err) {
      console.error(err);
    }
  };

useEffect(() => {
  fetchPost();
}, [id]);

useEffect(() => {
  if (post) {
    getLikesCount(); 
    fetchComments();
  }
}, [post]);

  // Dar o quitar like
  const handleLike = async () => {


    if (!user) return onOpen();
    console.log("Usuario logeado, procediendo a dar like, id del post:", post.id  );
    try {
      const res = await api.post(`/likes/${post.id}`);
      console.log("Respuesta del servidor al dar like:", res.data );
      
      await fetchPost(); // refrescar post con likes actualizados
    } catch (err) {
      console.error(err);
    }
  };

const handleComment = async () => {
  if (!user || !commentText.trim()) return;

  try {
    if (isEditing && editingCommentId) {
      // ✏️ Editar comentario existente
      const res = await api.put(`/comments/${editingCommentId}`, { content: commentText });
      console.log("Comentario actualizado:", res.data);
    } else {
      // 🆕 Nuevo comentario
      const res = await api.post(`/comments/${post.id}`, { content: commentText });
      console.log("Nuevo comentario agregado:", res.data);
    }

    setCommentText("");
    setIsEditing(false);
    setEditingCommentId(null);
    await fetchPost(); // refrescar
  } catch (err) {
    console.error(err);
  }
};


  // Eliminar comentario
const handleDeleteComment = async (commentId) => {
  try {
    const res = await api.delete(`/comments/${commentId}`);
    console.log("Comentario eliminado:", res.data);
    await fetchPost(); // refrescar comentarios
  } catch (err) {
    console.error("Error al eliminar comentario:", err);
  }
};

  if (loading) return <Text mt={10}>Cargando...</Text>;
  if (!post) return <Text mt={10}>Post no encontrado</Text>;

  return (
    <Box bgGradient="linear(to-br, gray.900, teal.800)" color="white" minH="100vh" py={10} px={{ base: 4, md: 20 }}>
      <Button variant="ghost" colorScheme="yellow" leftIcon={<FaArrowLeft />} mb={6} onClick={() => navigate("/posts")}>
        Volver
      </Button>

      <Image src={post.cover_image_url} borderRadius="lg" w="100%" maxH="400px" objectFit="cover" mb={6} />

      <Heading mb={4} color="yellow.300">{post.title}</Heading>
      <Text mb={6} fontSize="lg">{post.content}</Text>
      <Text 
    mb={4} 
    fontSize="xl" 
    fontWeight="bold" // <--- Negrita
    color="yellow.200" // <--- Color brillante por defecto
    _hover={{
        cursor:"pointer", 
        color: "yellow.400", // <--- Color aún más brillante al pasar el ratón
        textDecoration: "underline" // <--- Subrayado para enfatizar el clic
        }} 
        onClick={() => navigate(`/profile/${post.author.id}`)}>
        Autor: {post.author.full_name}
    </Text>

      <Button colorScheme="pink" leftIcon={<FaHeart />} mb={6} onClick={handleLike}>
        {numLikes || 0} Me gusta
      </Button>

      <Divider mb={4} />

 <Heading size="md" mb={4}>Comentarios</Heading>
<VStack align="start" spacing={4}>
  {comments?.length > 0 ? (
    comments.map((c) => (
      <Box
        key={c.id}
        bg="whiteAlpha.100"
        p={4}
        borderRadius="md"
        w="100%"
        shadow="md"
      >
        <HStack justify="space-between" align="flex-start">
          <HStack>
            <Image
              src={c.user?.avatar_url || "https://via.placeholder.com/40"}
              alt={c.user?.username}
              boxSize="40px"
              borderRadius="full"
              objectFit="cover"
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" color="yellow.200">
                {c.user?.username || "Usuario"}
              </Text>
              <Text fontSize="xs" color="whiteAlpha.600">
                {new Date(c.created_at).toLocaleString("es-GT", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Text>
            </VStack>
          </HStack>

          {user && user.id === c.user.id && (
            <HStack spacing={2}>
              <Button
                size="xs"
                variant="ghost"
                colorScheme="yellow"
                leftIcon={<FaEdit />}
               onClick={() => {
                    setIsEditing(true);
                    setEditingCommentId(c.id);
                    setCommentText(c.content); // carga el texto existente
                  }}
              >
                Editar
              </Button>
              <Button
                size="xs"
                variant="ghost"
                colorScheme="red"
                leftIcon={<FaTrash />}
                onClick={() => handleDeleteComment(c.id)}
              />
            </HStack>
          )}
        </HStack>

        {/* Si estamos editando este comentario */}
        {editingComment?.id === c.id ? (
          <Box mt={3} ml={12} w="100%">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              bg="whiteAlpha.100"
              mb={2}
            />
          </Box>
        ) : (
          <Text mt={3} ml={12}>
            {c.content}
          </Text>
        )}
      </Box>
    ))
  ) : (
    <Text color="whiteAlpha.700">No hay comentarios aún. Sé el primero.</Text>
  )}

  {user ? (
    <Box w="100%" mt={6}>
      <Textarea
        placeholder="Escribe un comentario..."
        bg="whiteAlpha.100"
        mb={3}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
 <Button colorScheme="teal" onClick={handleComment}>
  {isEditing ? "Guardar cambios" : "Comentar"}
</Button>

    </Box>
  ) : (
    <Box
      p={4}
      borderRadius="md"
      bg="whiteAlpha.100"
      textAlign="center"
      border="1px dashed whiteAlpha.300"
    >
      <Text mb={3}>
        Debes iniciar sesión para poder escribir un comentario.
      </Text>
      <Button colorScheme="yellow" onClick={onOpen}>
        Iniciar sesión
      </Button>
    </Box>
  )}
</VStack>



      <PostModalLogin isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
