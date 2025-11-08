import { useContext, useEffect, useState } from "react";
import {
  Box, Heading, VStack, HStack, Text, Avatar, Button, Divider
} from "@chakra-ui/react";
import api from "../api/axios";

export default function FriendRequests() {
  const [requests, setRequests] = useState([]);
  
  const fetchRequests = async () => {
    try {
      const res = await api.get("/friendships/requests");
      console.log("Solicitudes cargadas:", res.data);
      setRequests(res.data);
    } catch (err) {
      console.error("Error al cargar solicitudes:", err);
    }
  };

  const handleRespond = async (requesterId, status) => {
    try {
      console.log("Respondiendo solicitud:", { requesterId, status }); // Debug
      await api.post(`/friendships/${requesterId}/respond`, { status });
      fetchRequests(); // recargar solicitudes
    } catch (err) {
      console.error("Error al responder solicitud:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Box bgGradient="linear(to-br, gray.900, teal.800)" color="white" minH="100vh" p={8}>
      <Heading color="yellow.300" mb={6}>Solicitudes de Amistad</Heading>

      <VStack spacing={4} align="stretch">
        {requests.length === 0 ? (
          <Text color="whiteAlpha.700">No tienes solicitudes pendientes.</Text>
        ) : (
          requests.map((r) => (
            <Box key={`${r.user_id}-${r.friend_id}`} bg="whiteAlpha.100" p={4} borderRadius="md">
              <HStack justify="space-between">
                <HStack>
                  <Avatar size="sm" src={r.requester?.avatar_url} />
                  <Box>
                    <Text fontWeight="bold">
                      {r.requester?.full_name || r.requester?.username}
                    </Text>
                    <Text fontSize="sm" color="whiteAlpha.600">
                      Estado: {r.status}
                    </Text>
                  </Box>
                </HStack>
                {r.status === "pending" && (
                  <HStack>
                    <Button
                      colorScheme="teal"
                      onClick={() => handleRespond(r.user_id, "accepted")}
                    >
                      Aceptar
                    </Button>

                    <Button
                      colorScheme="red"
                      onClick={() => handleRespond(r.user_id, "blocked")}
                    >
                      Rechazar
                    </Button>
                  </HStack>
                )}
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
}