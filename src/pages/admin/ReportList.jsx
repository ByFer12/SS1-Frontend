import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, Thead, Tbody, Tr, Th, Td, Box, Text, Spinner, Button, Badge
} from "@chakra-ui/react";
import api from "../../api/axios";

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports"); // 👈 ajusta si tu backend está en /routs/reports
        console.log("Datos de los reportes obtenidos:", res.data);
        setReports(res.data);
      } catch (error) {
        console.error("Error al obtener reportes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Cargando reportes...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Reportes de publicaciones
      </Text>

      {reports.length === 0 ? (
        <Text>No hay reportes registrados.</Text>
      ) : (
        <Table variant="simple" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Post</Th>
              <Th>Usuario</Th>
              <Th>Motivo</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reports.map((r) => (
              <Tr key={r.id}>
                <Td>{r.id}</Td>
                <Td>{r.post?.title || "—"}</Td>
                <Td>{r.user?.name || "—"}</Td>
                <Td>{r.reason}</Td>
                <Td>
                  <Badge colorScheme={r.reviewed ? "green" : "red"}>
                    {r.reviewed ? "Revisado" : "Pendiente"}
                  </Badge>
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => navigate(`/admin/reports/${r.id}`)}
                  >
                    Ver detalle
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
