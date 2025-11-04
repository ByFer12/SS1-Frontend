import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Heading,
  Input,
  VStack,
  Spinner,
  Container,
  Text,
} from "@chakra-ui/react";
import PostCard from "./PostCard";
import PostFilters from "./PostFilters";
import { useNavigate } from "react-router-dom";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("recent");
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Datos de ejemplo (luego reemplazas con fetch real)
    const demoPosts = [
      {
        id: 1,
        title: "Iniciativa ciudadana de reforestación en Quetzaltenango",
        content:
          "Más de 300 voluntarios se unieron este fin de semana para reforestar el cerro El Baúl...",
        category: { name: "Medio Ambiente" },
        likes_count: 23,
        comments_count: 5,
        image:
          "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: 2,
        title: "Nuevas campañas de ayuda humanitaria en Guatemala",
        content:
          "Diversas organizaciones lanzaron campañas para apoyar comunidades afectadas por las lluvias...",
        category: { name: "Ayuda Humanitaria" },
        likes_count: 42,
        comments_count: 10,
        image:
          "https://images.unsplash.com/photo-1593113598332-cd4c9e3f3f54?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: 3,
        title: "Se registran alertas por actividad volcánica en el Pacaya",
        content:
          "El INSIVUMEH emitió una alerta preventiva por el aumento de la actividad volcánica...",
        category: { name: "Alertas" },
        likes_count: 67,
        comments_count: 15,
        image:
          "https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&w=800&q=60",
      },
    ];

    setTimeout(() => {
      setPosts(demoPosts);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <Spinner mt="10" />;

  return (
    <Box
      bgGradient="linear(to-br, gray.900, teal.800)"
      minH="100vh"
      color="white"
      py={10}
    >
      <Container maxW="6xl">
        <Heading mb={6} textAlign="center" color="yellow.300">
          Noticias y Artículos
        </Heading>

        {/* Buscador y filtros */}
        <VStack align="stretch" mb={6}>
          <Input
            placeholder="Buscar post..."
            bg="whiteAlpha.200"
            border="none"
            color="white"
            _placeholder={{ color: "whiteAlpha.700" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <PostFilters filter={filter} setFilter={setFilter} />
        </VStack>

        {/* Listado de posts */}
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
          {posts.map((post) => (
            <Box
              key={post.id}
              onClick={() => navigate(`/posts/${post.id}`)}
              cursor="pointer"
              _hover={{ transform: "scale(1.02)", transition: "0.2s" }}
            >
              <PostCard post={post} />
            </Box>
          ))}
        </Grid>

        {posts.length === 0 && (
          <Text mt={10} textAlign="center">
            No se encontraron publicaciones.
          </Text>
        )}
      </Container>
    </Box>
  );
}
