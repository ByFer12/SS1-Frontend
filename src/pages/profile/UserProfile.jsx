import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box, Heading, Avatar, Button, Text, VStack, Divider,
  Spinner, SimpleGrid, Tag, useToast, HStack, Progress
} from "@chakra-ui/react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

// Helper para convertir el valor de orientación a etiqueta (para la UI)
const orientationLabels = {
  left: "Izquierda",
  center_left: "Centro Izquierda",
  center: "Centro",
  center_right: "Centro Derecha",
  right: "Derecha",
  neutral: "Neutral",
};

// Helper para asignar un esquema de color
const orientationColors = {
  left: "red",
  center_left: "orange",
  center: "yellow",
  center_right: "teal",
  right: "blue",
  neutral: "gray",
};


export default function UserProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Nuevo estado para el resumen del periodista
  const [journalistSummary, setJournalistSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // ----------------------------------------------------
  // LOGICA PRINCIPAL
  // ----------------------------------------------------

  const fetchProfile = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await api.get(`/users/${id}`);
      setProfile(res.data);
      console.log("Perfil cargado:", res.data);

      // Lógica de amistad (si el usuario es diferente al actual)
      if (user?.id !== id && res.data.role?.name !== "PERIODISTA") {
         const friendsRes = await api.get(`/friendships/${id}/is-friend`);
         setIsFriend(friendsRes.data.isFriend);
      }
      
      // Lógica de suscripción (si el usuario es diferente y es un periodista)
      if (user?.id !== id && res.data.role?.name === "PERIODISTA") {
         await checkSubscriptionStatus(id);
      }

      // Lógica para cargar el resumen si es un periodista
      if (res.data.role?.name === "PERIODISTA") {
        await fetchJournalistSummary(id);
      }

    } catch (err) {
      console.error("Error al cargar perfil:", err);
      if (err.response?.status === 404) setNotFound(true);
      else {
        toast({
          title: "Error de carga",
          description: "No se pudo cargar la información del perfil.",
          status: "error",
          duration: 3000,
          position: "top",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async (profileId) => {
    try {
      const res = await api.get(`/subscriptions/${profileId}/is-following`);
      setIsSubscribed(res.data.isFollowing);
    } catch (err) {
      console.error("Error al verificar suscripción:", err);
    }
  };

  const fetchJournalistSummary = async (userId) => {
    setLoadingSummary(true);
    setJournalistSummary(null);
    try {
        const res = await api.get(`/admin/journalists/${userId}/summary`);
        setJournalistSummary(res.data);
    } catch (err) {
        console.error("Error al cargar resumen del periodista:", err);
        // El error 404/403 es común si no es un Admin o el periodista no tiene artículos.
        if (err.response?.status !== 404 && err.response?.status !== 403) {
             toast({
              title: "Error",
              description: "No se pudo cargar el resumen de orientación política.",
              status: "warning",
              duration: 2000,
              position: "top",
            });
        }
    } finally {
        setLoadingSummary(false);
    }
  };


  useEffect(() => {
    fetchProfile();
    // La lógica de suscripción y resumen se movió dentro de fetchProfile para usar 
    // el rol devuelto en la misma petición y evitar múltiples llamadas iniciales innecesarias.
  }, [id]);


  // ----------------------------------------------------
  // MANEJADORES DE ACCIONES
  // ----------------------------------------------------

  const handleFriendAction = async () => {
    try {
      // Simplificado: si es amigo, elimina; si no, añade (aunque la lógica de 'add' no está aquí)
      if (isFriend) {
        await api.delete(`/friendships/${id}/remove`);
        setIsFriend(false);
        toast({
          title: "Amigo eliminado exitosamente",
          status: "success",
          duration: 2000,
          position: "top",
        });
      } else {
         // Lógica para enviar solicitud de amistad (asumiendo que es un POST a otro endpoint o un cambio en el 'delete')
         // Para este ejemplo, solo implementamos la eliminación según tu código original
         // o deberías usar un endpoint POST /friendships/:id/add 
          toast({
             title: "Añadir Amigo",
             description: "Funcionalidad de añadir amigo no implementada en este ejemplo.",
             status: "info",
             duration: 2000,
             position: "top",
         });
      }
      
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


  // ----------------------------------------------------
  // RENDERIZADO CONDICIONAL
  // ----------------------------------------------------

  if (loading)
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" color="yellow.300" />
        <Text color="whiteAlpha.700" mt={4}>
          Cargando perfil...
        </Text>
      </Box>
    );

  if (notFound || !profile)
    return (
      <Box textAlign="center" p={10}>
        <Heading color="red.500" size="2xl">
          :(
        </Heading>
        <Text color="whiteAlpha.700" mt={4} fontSize="lg">
          {notFound ? "Perfil no encontrado." : "Error: No se pudo cargar la información."}
        </Text>
      </Box>
    );

  const isJournalist = profile.role?.name === "PERIODISTA";

  return (
    <Box bg="gray.900" color="white" p={10} minH="100vh">
      <VStack spacing={6} align="center">
        {/* Sección de Encabezado */}
        <Avatar size="xl" src={profile.avatar_url} name={profile.username} />
        <Heading color="yellow.300" size="xl">
          {profile.full_name}
        </Heading>
        <Text color="whiteAlpha.700" fontSize="lg">
          @{profile.username}
        </Text>
        <Tag colorScheme={isJournalist ? "teal" : profile.role?.name === "ADMIN" ? "purple" : "blue"}>
          {profile.role?.name}
        </Tag>

        {/* Sección de Acciones (Amistad/Suscripción) */}
        {user?.id !== id && (
          <HStack spacing={4}>
            {isJournalist && (
              <Button
                colorScheme={isSubscribed ? "red" : "orange"}
                onClick={handleSubscriptionAction}
                size="lg"
              >
                {isSubscribed ? "Cancelar suscripción" : "Suscribirme"}
              </Button>
            )}

            {!isJournalist && (
              <Button
                colorScheme={isFriend ? "red" : "blue"}
                onClick={handleFriendAction}
                size="lg"
              >
                {isFriend ? "Eliminar Amigo" : "Agregar Amigo"}
              </Button>
            )}
          </HStack>
        )}

        <Divider my={4} w="50%" borderColor="whiteAlpha.300" />
         {/* Sección de Información Adicional (Biografía, Residencia, etc.) */}
        <Box w="full" maxW="600px">
          <Heading size="md" mb={3} color="yellow.200">
            Información Personal
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

        {/* ---------------------------------------------------- */}
        {/* NUEVA SECCIÓN: Resumen de Orientación Política */}
        {/* ---------------------------------------------------- */}
        {isJournalist && (
          <Box w="full" maxW="800px">
            <Heading size="lg" mb={4} color="orange.300">
              Resumen de Artículos (Orientación)
            </Heading>
            {loadingSummary ? (
                <Text color="whiteAlpha.500" textAlign="center">Cargando resumen de orientación...</Text>
            ) : journalistSummary ? (
                <VStack spacing={6} align="stretch" p={5} bg="gray.800" borderRadius="lg" shadow="xl">
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <Box p={3} bg="gray.700" borderRadius="md" textAlign="center">
                            <Text fontSize="sm" color="whiteAlpha.500">Total de Artículos</Text>
                            <Text fontWeight="bold" fontSize="2xl" color="yellow.300">
                                {journalistSummary.totalArticles}
                            </Text>
                        </Box>
                        <Box p={3} bg="gray.700" borderRadius="md" textAlign="center">
                            <Text fontSize="sm" color="whiteAlpha.500">Orientación Dominante</Text>
                            <Tag 
                                size="lg" 
                                mt={1}
                                colorScheme={orientationColors[journalistSummary.dominantOrientation] || "gray"}
                            >
                                {orientationLabels[journalistSummary.dominantOrientation] || journalistSummary.dominantOrientation}
                            </Tag>
                        </Box>
                         <Box p={3} bg="gray.700" borderRadius="md" textAlign="center">
                            <Text fontSize="sm" color="whiteAlpha.500">Medio Actual</Text>
                            <Text fontWeight="bold" fontSize="lg" mt={1}>
                                {profile.media_outlet?.name || "Sin Medio"}
                            </Text>
                        </Box>
                    </SimpleGrid>

                    {journalistSummary.orientationDistribution && (
                        <Box pt={4}>
                            <Heading size="sm" mb={3} color="orange.200">
                                Distribución de Artículos por Orientación (%)
                            </Heading>
                            <VStack spacing={3} align="stretch">
                                {Object.entries(journalistSummary.orientationDistribution).map(
                                    ([key, value]) => (
                                        <Box key={key}>
                                            <HStack justify="space-between" mb={1}>
                                                <Tag size="sm" colorScheme={orientationColors[key]}>
                                                    {orientationLabels[key]}
                                                </Tag>
                                                <Text fontSize="sm" fontWeight="bold">
                                                    {value}%
                                                </Text>
                                            </HStack>
                                            <Progress
                                                value={value}
                                                size="sm"
                                                colorScheme={orientationColors[key]}
                                                borderRadius="full"
                                            />
                                        </Box>
                                    )
                                )}
                            </VStack>
                        </Box>
                    )}
                </VStack>
            ) : (
                <Text color="whiteAlpha.500" textAlign="center">No hay datos de orientación política disponibles para este periodista o no hay artículos publicados.</Text>
            )}
            <Divider my={6} w="full" borderColor="whiteAlpha.300" />
          </Box>
        )}
        
       

        {isFriend && !isJournalist && ( // Solo mostrar el estado de amigo si no es periodista
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