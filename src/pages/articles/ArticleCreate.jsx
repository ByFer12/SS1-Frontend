// src/pages/articles/ArticleCreate.jsx
import {
  Box,
  Heading,
  VStack,
  Input,
  Textarea,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function ArticleCreate() {
  const [article, setArticle] = useState({ title: "", content: "" });
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!article.title.trim() || !article.content.trim()) {
      toast({
        title: "Completa todos los campos",
        status: "warning",
        duration: 2000,
        position: "top",
      });
      return;
    }

    try {
      await api.post("/posts", {
        title: article.title,
        content: article.content,
        type: "article",
      });

      toast({
        title: "Artículo creado",
        status: "success",
        duration: 2000,
        position: "top",
      });

      navigate("/articles");
    } catch (err) {
      console.error("Error al crear artículo:", err);
      toast({
        title: "Error al crear artículo",
        status: "error",
        duration: 2000,
        position: "top",
      });
    }
  };

  return (
    <Box
      bgGradient="linear(to-br, gray.900, teal.800)"
      color="white"
      minH="100vh"
      px={{ base: 6, md: 16 }}
      py={10}
    >
      <Heading mb={6} color="yellow.300">
        Crear nuevo artículo
      </Heading>

      <VStack spacing={4} align="stretch" maxW="3xl">
        <Input
          placeholder="Título del artículo"
          bg="whiteAlpha.200"
          value={article.title}
          onChange={(e) => setArticle({ ...article, title: e.target.value })}
        />
        <Textarea
          placeholder="Contenido del artículo..."
          bg="whiteAlpha.200"
          value={article.content}
          onChange={(e) => setArticle({ ...article, content: e.target.value })}
        />
        <Button colorScheme="teal" onClick={handleSubmit}>
          Publicar
        </Button>
      </VStack>
    </Box>
  );
}
