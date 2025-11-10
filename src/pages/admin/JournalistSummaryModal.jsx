import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
  Text,
  Box,
  VStack,
  HStack,
  Avatar,
  Heading,
  Tag,
  Progress,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../api/axios";

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

export default function JournalistSummaryModal({ isOpen, onClose, journalist }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchSummary = async (userId) => {
    setLoading(true);
    setSummary(null);
    try {
      const res = await api.get(`/admin/journalists/${userId}/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error("Error al cargar resumen del periodista:", err);
      toast({
        title: "Error al cargar resumen",
        description: "No se pudo obtener el resumen de la orientación política.",
        status: "error",
        duration: 3000,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && journalist) {
      fetchSummary(journalist.user_id);
    }
  }, [isOpen, journalist]);

  // Si el componente 'journalist' no está presente o no tiene datos esenciales, no renderiza nada.
  if (!journalist || !journalist.user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent bg="gray.800" color="white" borderRadius="lg">
        <ModalHeader borderBottom="1px" borderColor="gray.700">
          Resumen de {journalist.user.full_name}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={6}>
          {loading ? (
            <VStack spacing={4} py={8}>
              <Spinner size="lg" color="orange.300" />
              <Text>Cargando datos del periodista...</Text>
            </VStack>
          ) : (
            <VStack spacing={6} align="stretch">
              <HStack spacing={4} align="center">
                <Avatar
                  size="xl"
                  src={summary?.avatar || journalist.user.avatar_url}
                  name={summary?.name || journalist.user.full_name}
                />
                <Box>
                  <Heading size="lg" color="yellow.300">
                    {summary?.name || journalist.user.full_name}
                  </Heading>
                  <Text color="whiteAlpha.600">
                    @{summary?.username || journalist.user.username}
                  </Text>
                  <Text fontSize="sm" mt={1}>
                    {summary?.email || journalist.user.email}
                  </Text>
                  <Tag colorScheme="cyan" mt={2}>
                    {journalist.media_outlet?.name || "Sin Medio Asignado"}
                  </Tag>
                </Box>
              </HStack>

              <Box>
                <Heading size="sm" mb={2} color="orange.200">
                  Resumen de Artículos
                </Heading>
                <SimpleGrid columns={2} spacing={4}>
                    <Box p={3} bg="gray.700" borderRadius="md">
                      <Text fontSize="sm" color="whiteAlpha.500">
                        Total de Artículos Publicados
                      </Text>
                      <Text fontWeight="bold" fontSize="xl" color="yellow.300">
                        {summary?.totalArticles ?? "N/A"}
                      </Text>
                    </Box>
                    <Box p={3} bg="gray.700" borderRadius="md">
                      <Text fontSize="sm" color="whiteAlpha.500">
                        Orientación Dominante
                      </Text>
                      <Tag size="lg" colorScheme={orientationColors[summary?.dominantOrientation] || "gray"}>
                        {orientationLabels[summary?.dominantOrientation] || summary?.dominantOrientation || "Sin Datos"}
                      </Tag>
                    </Box>
                </SimpleGrid>
              </Box>

              {summary?.orientationDistribution && (
                <Box>
                  <Heading size="sm" mb={3} color="orange.200">
                    Distribución de Orientación Política por Artículos (%)
                  </Heading>
                  <VStack spacing={3} align="stretch">
                    {Object.entries(summary.orientationDistribution).map(
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
          )}
        </ModalBody>

        <ModalFooter borderTop="1px" borderColor="gray.700">
          <Button colorScheme="yellow" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}