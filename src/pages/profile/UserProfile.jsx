import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box, Heading, Avatar, Button, Text, VStack, Divider,
  Spinner, SimpleGrid, Tag, useToast
} from "@chakra-ui/react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";


export default function UserProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setProfile(res.data);
     
      const friendsRes = await api.get(`/friendships/${id}/is-friend`);
      console.log("Perfil cargadoooo:", res.data);
      setIsFriend(friendsRes.data.isFriend);
    } catch (err) {
      console.error("Error al cargar perfil:", err);
      if (err.response?.status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

const checkSubscriptionStatus = async () => {
  try {
    const res = await api.get(`/subscriptions/${id}/is-following`);
    setIsSubscribed(res.data.isFollowing);
  } catch (err) {
    console.error("Error al verificar suscripción:", err);
  }
};


  useEffect(() => {
    fetchProfile();
    checkSubscriptionStatus();
  }, [id]);

  const handleFriendAction = async () => {
    try {
      await api.delete(`/friendships/${id}/remove`);
      toast({
        title: "Amigo eliminado exitosamente",
        status: "success",
        duration: 2000,
        position: "top",
      });
      fetchProfile();
    } catch (err) {
      console.error("Error en acción de amistad:", err);
      toast({
        title: "Error",
        description: "No se pudo completar la acción de amistad.",
        status: "error",
        duration: 3000,
        position: "top",
      });
    }
  };

  const handleSubscriptionAction = async () => {
    try {
      if (isSubscribed) {
        await api.delete(`/subscriptions/${id}/unfollow`);
        setIsSubscribed(false);
      } else {
        await api.post(`/subscriptions/${id}/follow`);
        setIsSubscribed(true);
      }

      toast({
        title: isSubscribed ? "Suscripción cancelada" : "Suscrito con éxito",
        status: "success",
        duration: 2500,
        position: "top",
      });

      fetchProfile();
    } catch (err) {
      console.error("Error en acción de suscripción:", err);
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "No se pudo completar la acción.",
        status: "error",
        duration: 3000,
        position: "top",
      });
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
        <Text color="whiteAlpha.700" mt={4}>
          Cargando perfil...
        </Text>
      </Box>
    );

  if (notFound)
    return (
      <Box textAlign="center" p={10}>
        <Heading color="red.500" size="2xl">
          :(
        </Heading>
        <Text color="whiteAlpha.700" mt={4} fontSize="lg">
          Perfil no encontrado.
        </Text>
      </Box>
    );

  if (!profile)
    return (
      <Text color="red.500" mt={10}>
        Error: No se pudo cargar la información del perfil.
      </Text>
    );

  return (
    <Box bg="gray.900" color="white" p={10} minH="100vh">
      <VStack spacing={6} align="center">
        <Avatar size="xl" src={profile.avatar_url} name={profile.username} />
        <Heading color="yellow.300" size="xl">
          {profile.full_name}
        </Heading>
        <Text color="whiteAlpha.700" fontSize="lg">
          @{profile.username}
        </Text>
        <Tag colorScheme={profile.role?.name === "ADMIN" ? "purple" : "teal"}>
          {profile.role?.name}
        </Tag>

        {user?.id !== id && profile.role?.name === "PERIODISTA" && (
          <Button
            colorScheme={isSubscribed ? "red" : "orange"}
            onClick={handleSubscriptionAction}
            size="lg"
            mr={4}
          >
            {isSubscribed ? "Cancelar suscripción" : "Suscribirme"}
          </Button>
        )}

        {user?.id !== id && profile.role?.name !== "PERIODISTA" && (
          <Button
            colorScheme={isFriend ? "red" : "blue"}
            onClick={handleFriendAction}
            size="lg"
          >
            {isFriend ? "Eliminar Amigo" : "Agregar Amigo"}
          </Button>
        )}

        <Divider my={4} w="50%" borderColor="whiteAlpha.300" />

        <Box w="full" maxW="600px">
          <Heading size="md" mb={3} color="yellow.200">
            Información Adicional
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            <Box p={3} bg="whiteAlpha.50" borderRadius="md">
              <Text fontSize="xs" color="whiteAlpha.500">
                Biografía
              </Text>
              <Text>{profile.bio || "No ha escrito una biografía."}</Text>
            </Box>

            <Box p={3} bg="whiteAlpha.50" borderRadius="md">
              <Text fontSize="xs" color="whiteAlpha.500">
                Residencia
              </Text>
              <Text>{profile.residence || "No especificada."}</Text>
            </Box>

            <Box p={3} bg="whiteAlpha.50" borderRadius="md">
              <Text fontSize="xs" color="whiteAlpha.500">
                Fecha de nacimiento
              </Text>
              <Text>
                {profile.birth_date
                  ? new Date(profile.birth_date).toLocaleDateString()
                  : "No especificada."}
              </Text>
            </Box>

            <Box p={3} bg="whiteAlpha.50" borderRadius="md">
              <Text fontSize="xs" color="whiteAlpha.500">
                Miembro desde
              </Text>
              <Text>{new Date(profile.created_at).toLocaleDateString()}</Text>
            </Box>
          </SimpleGrid>
        </Box>

        {isFriend && (
          <>
            <Divider my={4} w="50%" borderColor="whiteAlpha.300" />
            <Text color="whiteAlpha.600">
              Estás conectado con {profile.full_name}
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
}
