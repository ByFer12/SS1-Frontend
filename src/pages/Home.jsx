import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  HStack,
} from "@chakra-ui/react";
import { use } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Flex
      direction={{ base: "column-reverse", md: "row" }}
      align="center"
      justify="space-between"
      px={{ base: 6, md: 16 }}
      py={{ base: 10, md: 20 }}
      bgGradient="linear(to-br, gray.800, teal.700)"
      color="white"
      minH="calc(100vh - 50px)"
      textAlign={{ base: "center", md: "left" }}
    >
      {/* Texto principal */}
      <VStack spacing={6} align={{ base: "center", md: "start" }}>
        <Heading size="2xl" lineHeight="shorter" color="yellow.300">
          Bienvenido a <Text as="span" color="teal.100">SS1</Text>
        </Heading>
        <Text fontSize="lg" maxW="lg" color="whiteAlpha.900">
          Plataforma ciudadana para conectar información, noticias, eventos y
          ayuda humanitaria. Mantente informado, participa y contribuye.
        </Text>
        <HStack spacing={4} pt={4}>
          <Button
            colorScheme="teal"
            variant="solid"
            size="lg"
            onClick={() => navigate("/posts")}
          >
            Ver noticias
          </Button>
          <Button
            colorScheme="teal"
            variant="solid"
            size="lg"
            onClick={() => navigate("/feed")}
          >
            Ver actividad de amigos
          </Button>
          
        { user ? null : (
          <Button
            colorScheme="yellow"
            variant="outline"
            size="lg"
            onClick={() => navigate("/register")}
          >
            Crear cuenta
          </Button>
        )}
        </HStack>



      </VStack>

      {/* Imagen ilustrativa */}
      <Box mb={{ base: 10, md: 0 }}>
        <Image
          src="https://cdn-icons-png.flaticon.com/512/6165/6165577.png"
          alt="Comunidad colaborativa"
          boxSize={{ base: "240px", md: "400px" }}
          objectFit="contain"
          borderRadius="xl"
          shadow="xl"
        />
      </Box>
    </Flex>
  );
}
