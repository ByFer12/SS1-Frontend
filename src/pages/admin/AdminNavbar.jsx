import { HStack, Button, Box, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  return (
    <Box bg="gray.800" py={4} px={8} boxShadow="lg">
      <HStack justify="space-between">
        <Heading size="md" color="yellow.300">
          Panel Admin
        </Heading>
        <HStack spacing={4}>
          <Button variant="ghost" colorScheme="yellow" onClick={() => navigate("/admin")}>
            Inicio
          </Button>
          <Button variant="ghost" colorScheme="teal" onClick={() => navigate("/admin/users")}>
            Usuarios
          </Button>
          <Button variant="ghost" colorScheme="orange" onClick={() => navigate("/admin/journalists")}>
            Periodistas
          </Button>
          <Button variant="ghost" colorScheme="purple" onClick={() => navigate("/admin/posts/validate")}>
            Noticias
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
