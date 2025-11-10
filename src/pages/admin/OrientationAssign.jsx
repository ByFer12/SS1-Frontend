import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Select,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNavbar from "./AdminNavbar";

export default function OrientationAssign() {
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orientation, setOrientation] = useState({});
  const toast = useToast();

  const fetchJournalists = async () => {
    try {
      const res = await api.get("/admin/journalists");
      setJournalists(res.data);
    } catch (err) {
      console.error("Error al cargar periodistas:", err);
      toast({
        title: "Error al cargar periodistas",
        status: "error",
        duration: 2500,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrientation = async (userId) => {
    try {
      await api.patch(`/admin/journalists/${userId}/orientation`, {
        political_orientation: orientation[userId],
      });
      toast({
        title: "Orientación actualizada",
        status: "success",
        duration: 2000,
        position: "top",
      });
      fetchJournalists();
    } catch (err) {
      console.error("Error al actualizar orientación:", err);
      toast({
        title: "Error al actualizar orientación",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  useEffect(() => {
    fetchJournalists();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="orange.300" />
        <Text mt={3}>Cargando periodistas...</Text>
      </Box>
    );

  return (
    <Box bg="gray.900" color="white" minH="100vh">
      <AdminNavbar />
      <Box p={10}>
        <Heading mb={6} color="orange.300">
          Asignar Orientación Política
        </Heading>

        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="orange.300">Nombre</Th>
              <Th color="orange.300">Correo</Th>
              <Th color="orange.300">Medio</Th>
              <Th color="orange.300">Orientación Actual</Th>
              <Th color="orange.300">Nueva Orientación</Th>
              <Th color="orange.300">Acción</Th>
            </Tr>
          </Thead>
          <Tbody>
            {journalists.length === 0 ? (
              <Tr>
                <Td colSpan={6}>
                  <Text textAlign="center" color="whiteAlpha.600">
                    No hay periodistas registrados.
                  </Text>
                </Td>
              </Tr>
            ) : (
              journalists.map((j) => (
                <Tr key={j.user_id}>
                  <Td>{j.user?.full_name}</Td>
                  <Td>{j.user?.email}</Td>
                  <Td>{j.media_outlet?.name || "N/A"}</Td>
                  <Td>{j.political_orientation || "No asignada"}</Td>
                  <Td>
                    <Select
                      bg="gray.800"
                      value={orientation[j.user_id] || ""}
                      onChange={(e) =>
                        setOrientation({
                          ...orientation,
                          [j.user_id]: e.target.value,
                        })
                      }
                    >
                      <option value="">Seleccione</option>
                      <option value="left">Izquierda</option>
                      <option value="center_left">Centro Izquierda</option>
                      <option value="center">Centro</option>
                      <option value="center_right">Centro Derecha</option>
                      <option value="right">Derecha</option>
                      <option value="neutral">Neutral</option>
                    </Select>
                  </Td>
                  <Td>
                    <Button
                      colorScheme="yellow"
                      size="sm"
                      onClick={() => updateOrientation(j.user_id)}
                    >
                      Actualizar
                    </Button>
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
