import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHandHoldingHeart } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "../posts/PostModalLogin";

export default function HelpDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const help = {
    id,
    title: "Colecta de víveres para comunidades del Petén",
    type: "Donación",
    date: "Hasta el 25 de noviembre 2025",
    location: "Cobán, Ciudad de Guatemala",
    description:
      "Esta iniciativa busca reunir víveres y materiales de apoyo para familias afectadas por las recientes inundaciones en Petén. Puedes donar alimentos no perecederos, agua, ropa, o colaborar como voluntario en la clasificación de suministros.",
    contact: "ayudahumanitaria@ss1.org",
    image:
      "https://images.unsplash.com/photo-1581094479760-6c2a0e4c9a97?auto=format&fit=crop&w=900&q=60",
  };

  const handleJoin = () => {
    if (!user) return onOpen();
    alert("¡Gracias por unirte a la causa!");
  };

  return (
    <Box minH="100vh" px={{ base: 6, md: 16 }} py={10}>
      <Button
        variant="ghost"
        colorScheme="yellow"
        leftIcon={<FaArrowLeft />}
        mb={6}
        onClick={() => navigate("/help")}
      >
        Volver
      </Button>

      <Image src={help.image} borderRadius="md" mb={6} shadow="xl" />
      <Heading color="yellow.300">{help.title}</Heading>

      <HStack spacing={6} color="whiteAlpha.800" mt={2}>
        <Text>📅 {help.date}</Text>
        <Text>📍 {help.location}</Text>
        <Text>🩸 Tipo: {help.type}</Text>
      </HStack>

      <Divider my={4} />
      <Text fontSize="lg">{help.description}</Text>

      <VStack align="start" spacing={3} mt={6}>
        <Text>
          📧 <strong>Contacto:</strong> {help.contact}
        </Text>
        <Button
          colorScheme="teal"
          leftIcon={<FaHandHoldingHeart />}
          onClick={handleJoin}
        >
          Participar / Donar
        </Button>
      </VStack>

      <PostModalLogin isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
