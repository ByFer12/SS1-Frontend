import { useEffect, useState } from "react";
import {
  Box, Heading, VStack, HStack, Text, Avatar, Button, Divider
} from "@chakra-ui/react";
import api from "../api/axios";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Obtener el ID del usuario actual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error("Error al obtener usuario actual:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await api.get("/friendships");
      console.log("Amigos cargados:", res.data);
      setFriends(res.data);
    } catch (err) {
      console.error("Error al cargar amigos:", err);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await api.delete(`/friendships/${friendId}`);
      fetchFriends(); // recargar lista
    } catch (err) {
      console.error("Error al eliminar amigo:", err);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Función para obtener el amigo (el que NO soy yo)
  const getFriend = (friendship) => {
    if (!currentUserId) return null;
    
    // Si yo soy el user_id, el amigo es el requested
    if (friendship.user_id === currentUserId) {
      return friendship.requested;
    }
    // Si yo soy el friend_id, el amigo es el requester
    return friendship.requester;
  };

  return (
    <Box bgGradient="linear(to-br, gray.900, teal.800)" color="white" minH="100vh" p={8}>
      <Heading color="yellow.300" mb={6}>Mis Amigos</Heading>

      <VStack spacing={4} align="stretch">
        {friends.length === 0 ? (
          <Text color="whiteAlpha.700">Aún no tienes amigos añadidos.</Text>
        ) : (
          friends.map((f) => {
            const friend = getFriend(f);
            if (!friend) return null;

            return (
              <Box 
                key={`${f.user_id}-${f.friend_id}`} 
                bg="whiteAlpha.100" 
                p={4} 
                borderRadius="md"
              >
                <HStack justify="space-between">
                  <HStack>
                    <Avatar size="sm" src={friend.avatar_url} />
                    <Box>
                      <Text fontWeight="bold">
                        {friend.full_name || friend.username}
                      </Text>
                    </Box>
                  </HStack>
                  <Button 
                    size="sm" 
                    colorScheme="red" 
                    variant="outline"
                    onClick={() => handleRemoveFriend(friend.id)}
                  >
                    Eliminar
                  </Button>
                </HStack>
              </Box>
            );
          })
        )}
      </VStack>
    </Box>
  );
}