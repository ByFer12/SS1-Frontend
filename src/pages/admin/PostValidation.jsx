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
  HStack,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNavbar from "./AdminNavbar";

export default function PostValidation() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orientation, setOrientation] = useState({}); // <-- aquí guardamos selección
  const toast = useToast();

  const fetchPendingPosts = async () => {
    try {
      const res = await api.get("/admin/posts/pending");
      setPosts(res.data);
    } catch (err) {
      console.error("Error al cargar publicaciones:", err);
      toast({
        title: "Error al cargar publicaciones",
        status: "error",
        duration: 2500,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePost = async (id, status) => {
    try {
      const political_orientation =
        status === "published" ? orientation[id] || null : null;

      await api.patch(`/admin/posts/${id}/validate`, {
        status,
        political_orientation,
      });

      toast({
        title:
          status === "published"
            ? "Publicación aprobada"
            : "Publicación rechazada",
        status: status === "published" ? "success" : "error",
        duration: 2000,
        position: "top",
      });

      fetchPendingPosts();
    } catch (err) {
      console.error("Error al validar publicación:", err);
      toast({
        title: "No se pudo actualizar el estado",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="yellow.300" />
        <Text mt={3}>Cargando publicaciones...</Text>
      </Box>
    );

  return (
    <Box bg="gray.900" color="white" minH="100vh">
      <AdminNavbar />
      <Box p={10}>
        <Heading mb={6} color="yellow.300">
          Validación de Publicaciones
        </Heading>
        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="yellow.300">Título</Th>
              <Th color="yellow.300">Autor</Th>
              <Th color="yellow.300">Fecha</Th>
              <Th color="yellow.300">Estado</Th>
              <Th color="yellow.300">Orientación</Th>
              <Th color="yellow.300">Acción</Th>
            </Tr>
          </Thead>
          <Tbody>
            {posts.length === 0 ? (
              <Tr>
                <Td colSpan={6}>
                  <Text textAlign="center" color="whiteAlpha.600">
                    No hay publicaciones pendientes.
                  </Text>
                </Td>
              </Tr>
            ) : (
              posts.map((p) => (
                <Tr key={p.id}>
                  <Td>{p.title}</Td>
                  <Td>{p.author?.full_name || p.author?.username}</Td>
                  <Td>{new Date(p.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <Tag colorScheme="orange">{p.status}</Tag>
                  </Td>
                  <Td>
                    <Select
                      placeholder="Seleccionar"
                      bg="gray.800"
                      color="white"
                      value={orientation[p.id] || ""}
                      onChange={(e) =>
                        setOrientation({
                          ...orientation,
                          [p.id]: e.target.value,
                        })
                      }
                    >
                      <option value="left">Izquierda</option>
                      <option value="center_left">Centro Izquierda</option>
                      <option value="center">Centro</option>
                      <option value="center_right">Centro Derecha</option>
                      <option value="right">Derecha</option>
                      <option value="neutral">Neutral</option>
                    </Select>
                  </Td>
                  <Td>
                    <HStack spacing={3}>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => validatePost(p.id, "published")}
                      >
                        Aprobar
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => validatePost(p.id, "archived")}
                      >
                        Rechazar
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
