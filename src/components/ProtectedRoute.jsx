import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner, Flex, Text } from "@chakra-ui/react";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <Flex justify="center" align="center" h="100vh" direction="column">
        <Spinner size="xl" color="teal.400" />
        <Text mt={4} color="whiteAlpha.800">
          Cargando...
        </Text>
      </Flex>
    );

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role_id)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
