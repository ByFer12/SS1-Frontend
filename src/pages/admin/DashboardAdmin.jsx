import {
  Box,
  Heading,
  VStack,
  SimpleGrid,
  Button,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  return (
    <Box bg="gray.900" color="white" minH="100vh">
      <AdminNavbar />
      <VStack spacing={8} align="center" py={10}>
        <Heading color="yellow.300">Panel de Administración</Heading>
        <Text color="whiteAlpha.700">
          Gestiona usuarios, periodistas y valida contenido del sistema.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Button
            colorScheme="teal"
            size="lg"
            onClick={() => navigate("/admin/users")}
          >
            Gestión de Usuarios
          </Button>

          <Button
            colorScheme="orange"
            size="lg"
            onClick={() => navigate("/admin/journalists")}
          >
            Gestión de Periodistas
          </Button>

          <Button
            colorScheme="purple"
            size="lg"
            onClick={() => navigate("/admin/posts/validate")}
          >
            Validar Noticias / Publicaciones
          </Button>

          <Button
            colorScheme="yellow"
            size="lg"
            onClick={() => navigate("/admin/journalists/orientation")}
          >
            Asignar Orientación Política
          </Button>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
