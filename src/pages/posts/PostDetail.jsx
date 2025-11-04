import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Divider,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "./PostModalLogin";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const post = {
    id,
    title: "Iniciativa ciudadana de reforestación en Quetzaltenango",
    content:
      "Más de 300 voluntarios se unieron este fin de semana para reforestar el cerro El Baúl...",
    image:
      "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=800&q=60",
    likes_count: 23,
    comments: [
      {
        id: 1,
        user: "María",
        text: "Excelente iniciativa, felicidades a todos los participantes.",
        replies: [
          {
            id: 2,
            user: "Carlos",
            text: "Sí, deberían replicarla en otras regiones.",
          },
        ],
      },
    ],
  };

  const handleLike = () => {
    if (!user) return onOpen();
    // TODO: Like API call
  };

  const handleComment = () => {
    if (!user) return onOpen();
    // TODO: Post comment API call
  };

  return (
    <Box
      bgGradient="linear(to-br, gray.900, teal.800)"
      color="white"
      minH="100vh"
      py={10}
      px={{ base: 4, md: 20 }}
    >
      <Button
        variant="ghost"
        colorScheme="yellow"
        leftIcon={<FaArrowLeft />}
        mb={6}
        onClick={() => navigate("/posts")}
      >
        Volver
      </Button>

      <Image
        src={post.image}
        borderRadius="lg"
        w="100%"
        maxH="400px"
        objectFit="cover"
        mb={6}
      />

      <Heading mb={4} color="yellow.300">
        {post.title}
      </Heading>
      <Text mb={6} fontSize="lg">
        {post.content}
      </Text>

      <Button colorScheme="pink" leftIcon={<FaHeart />} mb={6} onClick={handleLike}>
        {post.likes_count} Me gusta
      </Button>

      <Divider mb={4} />

      <Heading size="md" mb={4}>
        Comentarios
      </Heading>

      <VStack align="start" spacing={4}>
        {post.comments.map((c) => (
          <Box key={c.id} bg="whiteAlpha.100" p={4} borderRadius="md" w="100%">
            <Text fontWeight="bold">{c.user}</Text>
            <Text>{c.text}</Text>

            {c.replies.length > 0 && (
              <Box pl={4} mt={2} borderLeft="2px solid teal">
                {c.replies.map((r) => (
                  <Box key={r.id} mt={2}>
                    <Text fontWeight="bold">{r.user}</Text>
                    <Text>{r.text}</Text>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}

        {/* Sección para comentar */}
        <Box w="100%" mt={6}>
          {user ? (
            <>
              <Textarea placeholder="Escribe un comentario..." bg="whiteAlpha.100" mb={3} />
              <Button colorScheme="teal" onClick={handleComment}>
                Comentar
              </Button>
            </>
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
        </Box>
      </VStack>

      <PostModalLogin isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
