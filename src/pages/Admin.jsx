import { Box, Heading, Text } from "@chakra-ui/react";

export default function Admin() {
  return (
    <Box p={6}>
      <Heading>Panel de Administración</Heading>
      <Text mt={2}>
        Área reservada para administradores: gestión de usuarios, roles y contenido.
      </Text>
    </Box>
  );
}
