import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  Tag,
  Spinner,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNavbar from "./AdminNavbar";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      toast({
        title: "Error al cargar usuarios",
        status: "error",
        duration: 2500,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      const url = isActive
        ? `/admin/users/${id}/ban`
        : `/admin/users/${id}/restore`;
      await api.patch(url);
      toast({
        title: isActive ? "Usuario desactivado" : "Usuario reactivado",
        status: "success",
        duration: 2000,
        position: "top",
      });
      fetchUsers();
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      toast({
        title: "No se pudo actualizar el estado",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="yellow.300" />
        <Text mt={3}>Cargando usuarios...</Text>
      </Box>
    );

  return (
    <Box bg="gray.900" color="white" minH="100vh">
      <AdminNavbar />
      <Box p={10}>
        <Heading mb={6} color="yellow.300">
          Gestión de Usuarios
        </Heading>
        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="yellow.300">Nombre</Th>
              <Th color="yellow.300">Correo</Th>
              <Th color="yellow.300">Rol</Th>
              <Th color="yellow.300">Reportes</Th>
              <Th color="yellow.300">Estado</Th>
              <Th color="yellow.300">Acción</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((u) => (
              <Tr key={u.id}>
                <Td>{u.full_name || u.username}</Td>
                <Td>{u.email}</Td>
                <Td>
                  <Tag
                    colorScheme={
                      u.role?.name === "ADMIN"
                        ? "purple"
                        : u.role?.name === "PERIODISTA"
                        ? "orange"
                        : "teal"
                    }
                  >
                    {u.role?.name}
                  </Tag>
                </Td>
                {/* 👇 Nueva columna de reportes */}
                <Td>
                  <Badge
                    colorScheme={
                      u.report_count >= 5
                        ? "red"
                        : u.report_count >= 3
                        ? "orange"
                        : "green"
                    }
                    fontSize="md"
                    px={2}
                    py={1}
                    rounded="md"
                  >
                    {u.report_count ?? 0}
                  </Badge>
                </Td>
                <Td>
                  <Tag colorScheme={u.is_active ? "green" : "red"}>
                    {u.is_active ? "Activo" : "Inactivo"}
                  </Tag>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme={u.is_active ? "red" : "green"}
                    onClick={() => toggleActive(u.id, u.is_active)}
                  >
                    {u.is_active ? "Desactivar" : "Reactivar"}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
