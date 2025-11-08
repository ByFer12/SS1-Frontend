import {
  Box,
  Heading,
  VStack,
  HStack,
  Avatar,
  Text,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function FriendSuggestions() {
  const { user } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendRequests, setFriendRequests] = useState({}); // para mostrar estado

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/commons");
      const filtered = res.data.filter((u) => u.id !== user.id);
      setUsers(filtered);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      toast({
        title: "Error al cargar usuarios",
        status: "error",
        duration: 2500,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      await api.post(`/friendships/${friendId}/request`);
      toast({
        title: "Solicitud enviada",
        description: "Esperando aceptación del usuario.",
        status: "success",
        duration: 2500,
        position: "top",
      });
      setFriendRequests((prev) => ({ ...prev, [friendId]: "sent" }));
    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      toast({
        title: "No se pudo enviar la solicitud",
        status: "error",
        duration: 2500,
        position: "top",
      });
    }
  };

  const cancelFriendRequest = async (friendId) => {
    try {
      await api.post(`/friendships/${friendId}/respond`, { status: "blocked" });
      toast({
        title: "Solicitud cancelada",
        status: "info",
        duration: 2500,
        position: "top",
      });
      setFriendRequests((prev) => ({ ...prev, [friendId]: null }));
    } catch (err) {
      console.error("Error al cancelar solicitud:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="yellow.300" />
        <Text mt={3}>Cargando usuarios...</Text>
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
      <Heading mb={6} color="yellow.300">
        Personas que quizás conozcas
      </Heading>

      <VStack spacing={4} align="stretch">
        {users.length === 0 ? (
          <Text color="whiteAlpha.700">No hay usuarios disponibles.</Text>
        ) : (
          users.map((u) => (
            <HStack
              key={u.id}
              bg="whiteAlpha.100"
              p={4}
              borderRadius="md"
              justify="space-between"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              <HStack spacing={3}>
                <Avatar src={u.avatar_url} name={u.full_name || u.username} />
                <Box>
                  <Text fontWeight="bold" color="teal.200">
                    {u.full_name || u.username}
                  </Text>
                  <Text fontSize="sm" color="whiteAlpha.700">
                    {u.bio || "Sin biografía"}
                  </Text>
                </Box>
              </HStack>

              {friendRequests[u.id] === "sent" ? (
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => cancelFriendRequest(u.id)}
                >
                  Cancelar solicitud
                </Button>
              ) : (
                <Button
                  size="sm"
                  colorScheme="yellow"
                  onClick={() => sendFriendRequest(u.id)}
                >
                  Agregar amigo
                </Button>
              )}
            </HStack>
          ))
        )}
      </VStack>
    </Box>
  );
}
