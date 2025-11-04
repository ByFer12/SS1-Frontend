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

export default function EventList() {
  const navigate = useNavigate();

  const events = [
    {
      id: 1,
      title: "Campaña de reforestación en Totonicapán",
      date: "10 de noviembre 2025",
      location: "Bosque de los Altos",
      description: "Únete a esta jornada para plantar más de 1000 árboles.",
      image:
        "https://images.unsplash.com/photo-1618221612703-6e7e2ef567cc?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: 2,
      title: "Donación de víveres para familias afectadas por inundaciones",
      date: "15 de noviembre 2025",
      location: "Escuintla",
      description: "Recolecta de alimentos, agua y ropa en centros comunitarios.",
      image:
        "https://images.unsplash.com/photo-1602524201456-3b3f1b5d94a3?auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <Box minH="100vh" px={{ base: 6, md: 16 }} py={10}>
      <Heading color="yellow.300" mb={6}>
        Eventos y Campañas
      </Heading>

      <VStack spacing={6} align="stretch">
        {events.map((e) => (
          <Box
            key={e.id}
            bg="whiteAlpha.100"
            borderRadius="md"
            overflow="hidden"
            shadow="lg"
            _hover={{ bg: "whiteAlpha.200", cursor: "pointer" }}
            onClick={() => navigate(`/events/${e.id}`)}
          >
            <HStack align="stretch">
              <Image
                src={e.image}
                alt={e.title}
                w={{ base: "100px", md: "200px" }}
                objectFit="cover"
              />
              <Box p={4} flex="1">
                <Heading size="md" color="teal.200">
                  {e.title}
                </Heading>
                <Text fontSize="sm" color="whiteAlpha.800">
                  📅 {e.date} — 📍 {e.location}
                </Text>
                <Divider my={2} />
                <Text noOfLines={2}>{e.description}</Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
