import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <Box
      bgGradient="linear(to-br, gray.900, teal.800)"
      color="white"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <VStack
        spacing={6}
        bg="whiteAlpha.100"
        p={8}
        borderRadius="xl"
        w={{ base: "100%", sm: "400px" }}
        boxShadow="xl"
      >
        <Heading color="yellow.300">Crear Cuenta</Heading>
        <Input placeholder="Nombre completo" bg="whiteAlpha.200" />
        <Input placeholder="Correo electrónico" type="email" bg="whiteAlpha.200" />
        <Input placeholder="Usuario" bg="whiteAlpha.200" />
        <Input placeholder="Contraseña" type="password" bg="whiteAlpha.200" />
        <Button colorScheme="teal" w="full">
          Registrarse
        </Button>
        <Text fontSize="sm">
          ¿Ya tienes cuenta?{" "}
          <Link color="yellow.300" onClick={() => navigate("/login")}>
            Inicia sesión
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}
