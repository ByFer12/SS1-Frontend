import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  Textarea,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "../posts/PostModalLogin";

export default function ForumDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const forum = {
    id,
    title: "Cambio climático y acciones locales",
    description:
      "Espacio para discutir ideas y experiencias sobre iniciativas ecológicas, reducción de desechos y sostenibilidad en Guatemala.",
    posts: [
      {
        id: 1,
        user: "Lucía Pérez",
        text: "Creo que deberíamos organizar campañas en escuelas para enseñar sobre reciclaje.",
        replies: [
          {
            id: 2,
            user: "Carlos Gómez",
            text: "Excelente idea, incluso se podrían incluir talleres prácticos.",
          },
        ],
      },
      {
        id: 3,
        user: "Ana Morales",
        text: "También podríamos crear grupos en barrios para clasificar desechos correctamente.",
        replies: [],
      },
    ],
  };

  const handleComment = () => {
    if (!user) return onOpen();
    // TODO: enviar comentario
  };

  return (
    <Box
      bgGradient="linear(to-br, gray.900, teal.800)"
      color="white"
      minH="100vh"
      px={{ base: 6, md: 16 }}
      py={10}
    >
      <Heading mb={4} color="yellow.300">
        {forum.title}
      </Heading>
      <Text mb={6} fontSize="lg">
        {forum.description}
      </Text>

      <Divider mb={4} />

      <VStack align="stretch" spacing={4}>
        {forum.posts.map((p) => (
          <Box key={p.id} bg="whiteAlpha.100" p={4} borderRadius="md">
            <Text fontWeight="bold" color="teal.200">
              {p.user}
            </Text>
            <Text>{p.text}</Text>

            {p.replies.length > 0 && (
              <Box pl={4} mt={3} borderLeft="2px solid teal">
                {p.replies.map((r) => (
                  <Box key={r.id} mt={2}>
                    <Text fontWeight="bold" color="yellow.300">
                      {r.user}
                    </Text>
                    <Text>{r.text}</Text>
                  </Box>
                ))}
              </Box>
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
            />
            <Button colorScheme="teal" onClick={handleComment}>
              Publicar
            </Button>
          </>
        ) : (
          <Box
            bg="whiteAlpha.100"
            p={5}
            borderRadius="md"
            textAlign="center"
            border="1px dashed whiteAlpha.300"
          >
            <Text mb={3}>
              Debes iniciar sesión para participar en este foro.
            </Text>
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
