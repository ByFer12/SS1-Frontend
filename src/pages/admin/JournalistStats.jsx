import {
  Box,
  Heading,
  Avatar,
  Text,
  Progress,
  VStack,
  HStack,
  Spinner,
  useToast,
  Select,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNavbar from "./AdminNavbar";

export default function JournalistStats() {
  const [journalists, setJournalists] = useState([]);
  const [selected, setSelected] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchJournalists = async () => {
    try {
      const res = await api.get("/admin/journalists");
      setJournalists(res.data);
    } catch (err) {
      toast({
        title: "Error al cargar periodistas",
        status: "error",
        duration: 2500,
      });
    }
  };

  const fetchStats = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await api.get(`/admin/journalists/${selected}/summary`);
      setStats(res.data);
    } catch (err) {
      toast({
        title: "Error al cargar estadísticas",
        status: "error",
        duration: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalists();
  }, []);

  return (
    <Box bg="gray.900" color="white" minH="100vh">
      <AdminNavbar />
      <Box p={10}>
        <Heading mb={6} color="orange.300">
          Estadísticas de Orientación Política
        </Heading>

        <HStack mb={8}>
          <Select
            placeholder="Seleccione un periodista"
            bg="gray.800"
            onChange={(e) => setSelected(e.target.value)}
          >
            {journalists.map((j) => (
              <option key={j.user_id} value={j.user_id}>
                {j.user?.full_name}
              </option>
            ))}
          </Select>
          <Button colorScheme="orange" onClick={fetchStats}>
            Ver estadísticas
          </Button>
        </HStack>

        {loading && (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="orange.300" />
          </Box>
        )}

        {stats && (
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="xl"
            bg="gray.800"
            shadow="md"
            w="full"
            maxW="lg"
            mx="auto"
          >
            <VStack spacing={4}>
              <Avatar size="xl" src={stats.avatar} />
              <Heading size="md">{stats.name}</Heading>
              <Text color="gray.400">@{stats.username}</Text>
              <Text>Total artículos: {stats.totalArticles}</Text>

              {Object.entries(stats.orientationDistribution).map(([k, v]) => (
                <Box key={k} w="full">
                  <Text textTransform="capitalize">{k.replace("_", " ")}: {v}%</Text>
                  <Progress value={v} colorScheme="orange" size="sm" borderRadius="md" />
                </Box>
              ))}

              <Text mt={4} color="orange.300">
                Orientación dominante: {stats.dominantOrientation.replace("_", " ")}
              </Text>
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
