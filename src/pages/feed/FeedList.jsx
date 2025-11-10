import {
  Box, VStack, HStack, Text, Heading, Avatar, Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function FeedList() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get("/shares/feed");
        console.log("Feed cargado:", res.data);
        setFeed(res.data);
      } catch (err) {
        console.error("Error al cargar feed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
        <Text color="whiteAlpha.700" mt={4}>Cargando feed...</Text>
      </Box>
    );

  return (
   <Box 
  bgGradient="linear(to-br, gray.900, teal.800)" 
  color="white" 
  minH="100vh" 
  px={8} 
  py={10} 
  // --- Cambios para hacerlo más angosto y centrado ---
  maxW="800px" // Limita el ancho máximo a un tamaño predefinido (ej: "lg" o "600px")
  mx="auto"  // Centra el componente horizontalmente
  // ----------------------------------------------------
>
  <Heading color="yellow.300" mb={6}>Compartidos</Heading>
      <VStack spacing={5} align="stretch">
        {feed.map((f) => (
          <Box key={`${f.user_id}-${f.post_id}`} bg="whiteAlpha.100" p={5} borderRadius="md">
            <HStack mb={3}>
                <Avatar src={f.sharer.avatar_url} name={f.sharer.full_name} size="sm" onClick={() => navigate(`/profile/${f.sharer.id}`)} />

                <Text color="yellow.200" _hover={{cursor:"pointer"}} fontWeight="bold" onClick={() => navigate(`/profile/${f.sharer.id}`)}>
                    {f.sharer.full_name || f.sharer.username}
                </Text>
                {/* MODIFICACIÓN AQUÍ: Distingue el tipo de acción */}
                <Text color="whiteAlpha.600" fontSize="sm">
                    {f.sharer.id === f.post.author.id ? 
                        "publicó esto el" : 
                        "compartió esto el"
                    } 
                    {new Date(f.shared_at).toLocaleDateString()}
                </Text>
                <Box 
                 key={`${f.user_id}-${f.post_id}`} 
                    bg={f.sharer?.role?.name? "yellow.300" : "green.300"}// Fondo amarillo claro
                    color="black" // <-- ¡Añade esta línea para que la letra sea negra!
                    p={1} 
                    borderRadius="md" 
                >
                    {f.sharer?.role?.name? "PERIODISTA" : "AMIGO"}
                </Box>
            </HStack>
            <Box pl={8}>
              {/* 2. REEMPLAZA Navigate con la función navigate */}
              <Heading size="sm" color="teal.200" _hover={{cursor:"pointer"}} onClick={() => navigate(`/posts/${f.post.id}`)}>{f.post.title}</Heading>
              <Text color="whiteAlpha.800" noOfLines={3}>{f.post.summary || f.post.content}</Text>
              <Text fontSize="xs" color="whiteAlpha.500">
                Autor original: {f.post.author?.full_name || f.post.author?.username}
              </Text>
            </Box>
          </Box>
        ))}
      </VStack>
</Box>
  );
}
