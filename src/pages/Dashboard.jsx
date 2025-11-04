import { Box, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <Box p={6}>
      <Heading>Panel principal</Heading>
      <Text>Hola, {user?.username} ({user?.role_id})</Text>
    </Box>
  );
}
