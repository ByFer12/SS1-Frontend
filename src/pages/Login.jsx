import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await login(email, password);

      toast({
        title: "Inicio de sesión exitoso",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      if (user.role_id === 2) {
        console.log("Usuario común ha iniciado sesión", user );
        console.log("ID del rol:", user.role_id," nombre del rol:", user.role_name);  
        navigate("/posts"); // home para usuario común
      } else {
        navigate("/dashboard"); // admin o moderador
      }
    } catch (err) {
      toast({
        title: "Error al iniciar sesión",
        description: err.response?.data?.message || "Credenciales incorrectas",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

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
        <Heading color="yellow.300">Iniciar Sesión</Heading>
        <Input
          placeholder="Correo electrónico porfavor"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          bg="whiteAlpha.200"
        />
        <Input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          bg="whiteAlpha.200"
        />
        <Button
          colorScheme="teal"
          w="full"
          isLoading={loading}
          onClick={handleLogin}
        >
          Entrar
        </Button>
        <Text fontSize="sm">
          ¿No tienes una cuenta?{" "}
          <Link color="yellow.300" onClick={() => navigate("/register")}>
            Regístrate aquí
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}
