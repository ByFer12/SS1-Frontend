import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box, Text, Button, Spinner, Badge, VStack
} from "@chakra-ui/react";
import api from "../../api/axios";

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/reports/${id}`);
        console.log("Detalle del reporte obtenido:", res.data);
        setReport(res.data);
      } catch (error) {
        console.error("Error al obtener el reporte:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleMarkReviewed = async () => {
    try {
      await api.patch(`/reports/${id}/review`);
      alert("Reporte marcado como revisado.");
      navigate("/admin/reports");
    } catch (error) {
      console.error("Error al marcar reporte:", error);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Cargando detalle...</Text>
      </Box>
    );

  if (!report) return <Text>Reporte no encontrado.</Text>;

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Detalle del reporte #{report.id}
      </Text>

      <VStack align="start" spacing={3}>
        <Text><strong>Post:</strong> {report.post?.title || "—"}</Text>
        <Text><strong>Usuario reportante:</strong> {report.user?.name || "—"}</Text>
        <Text><strong>Motivo:</strong> {report.reason}</Text>
        <Text><strong>Descripción:</strong> {report.description}</Text>
        <Text>
          <strong>Estado:</strong>{" "}
          <Badge colorScheme={report.reviewed ? "green" : "red"}>
            {report.reviewed ? "Revisado" : "Pendiente"}
          </Badge>
        </Text>
      </VStack>

      {!report.reviewed && (
        <Button
          mt={6}
          colorScheme="green"
          onClick={handleMarkReviewed}
        >
          Marcar como revisado
        </Button>
      )}

      <Button
        mt={4}
        variant="outline"
        colorScheme="teal"
        onClick={() => navigate("/admin/reports")}
      >
        Volver a la lista
      </Button>
    </Box>
  );
}
