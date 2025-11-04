import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  Button,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHandsHelping } from "react-icons/fa";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = {
    id,
    title: "Campaña de reforestación en Totonicapán",
    date: "10 de noviembre 2025",
    location: "Bosque de los Altos",
    description:
      "Jornada de reforestación en la zona occidental. Los participantes recibirán kits ecológicos y capacitación ambiental.",
    image:
      "https://images.unsplash.com/photo-1618221612703-6e7e2ef567cc?auto=format&fit=crop&w=900&q=60",
  };

  return (
    <Box minH="100vh" px={{ base: 6, md: 16 }} py={10}>
      <Button
        variant="ghost"
        colorScheme="yellow"
        leftIcon={<FaArrowLeft />}
        mb={6}
        onClick={() => navigate("/events")}
      >
        Volver
      </Button>

      <Image src={event.image} borderRadius="md" mb={6} shadow="xl" />
      <Heading color="yellow.300">{event.title}</Heading>

      <HStack spacing={6} color="whiteAlpha.800" mt={2}>
        <Text>{event.date}</Text>
        <Text> {event.location}</Text>
      </HStack>

      <Divider my={4} />
      <Text fontSize="lg">{event.description}</Text>

      <Button
        mt={6}
        colorScheme="teal"
        leftIcon={<FaHandsHelping />}
        onClick={() => alert("Te has unido al evento")}
      >
        Unirme a la campaña
      </Button>
    </Box>
  );
}
