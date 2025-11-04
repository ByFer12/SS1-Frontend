import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  HStack,
  Image,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function HelpList() {
  const navigate = useNavigate();

  const helps = [
    {
      id: 1,
      title: "Colecta de víveres para comunidades del Petén",
      type: "Donación",
      date: "Disponible hasta el 25 de noviembre 2025",
      location: "Puntos de recolección: Cobán, Ciudad de Guatemala",
      description:
        "Ayúdanos donando alimentos no perecederos, ropa o insumos médicos para familias afectadas por inundaciones.",
      image:
        "https://images.unsplash.com/photo-1581094479760-6c2a0e4c9a97?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 2,
      title: "Voluntariado para limpieza de playas en Puerto San José",
      type: "Voluntariado",
      date: "Sábado 16 de noviembre 2025",
      location: "Playa El Semillero, Puerto San José",
      description:
        "Participa como voluntario en la limpieza de playas y recibe material educativo sobre conservación marina.",
      image:
        "https://images.unsplash.com/photo-1565120130282-cd2574b1c5f5?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 3,
      title: "Apoyo psicológico a familias afectadas por desastres",
      type: "Servicio Social",
      date: "Convocatoria abierta",
      location: "Atención virtual y presencial",
      description:
        "Buscamos voluntarios psicólogos o estudiantes avanzados de psicología para ofrecer sesiones de apoyo emocional.",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <Box minH="100vh" px={{ base: 6, md: 16 }} py={10}>
      <Heading color="yellow.300" mb={6}>
        Ayuda Humanitaria
      </Heading>

      <VStack spacing={6} align="stretch">
        {helps.map((h) => (
          <Box
            key={h.id}
            bg="whiteAlpha.100"
            borderRadius="md"
            overflow="hidden"
            shadow="lg"
            _hover={{ bg: "whiteAlpha.200", cursor: "pointer" }}
            onClick={() => navigate(`/help/${h.id}`)}
          >
            <HStack align="stretch">
              <Image
                src={h.image}
                alt={h.title}
                w={{ base: "100px", md: "200px" }}
                objectFit="cover"
              />
              <Box p={4} flex="1">
                <Heading size="md" color="teal.200">
                  {h.title}
                </Heading>
                <Text fontSize="sm" color="whiteAlpha.800">
                  📅 {h.date} — 📍 {h.location}
                </Text>
                <Divider my={2} />
                <Text noOfLines={2}>{h.description}</Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
