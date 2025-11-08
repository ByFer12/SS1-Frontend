// src/pages/articles/ArticleDetail.jsx
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  Avatar,
  Button,
  useDisclosure,
  useToast,
    HStack,
   Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
} from "@chakra-ui/react";
import { FaHeart, FaExclamationTriangle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "../posts/PostModalLogin";
import api from "../../api/axios";

export default function ArticleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [article, setArticle] = useState(null);
  const [numLikes, setNumLikes] = useState(0);

  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
const [reportReason, setReportReason] = useState("");

const handleReport = async () => {
  if (!reportReason.trim()) {
    toast({
      title: "Por favor, escribe una razón para el reporte.",
      status: "warning",
      duration: 2500,
      position: "top",
    });
    return;
  }

  try {
    await api.post(`/posts/${id}/report`, { reason: reportReason });
    toast({
      title: "Reporte enviado",
      description: "Gracias por tu colaboración. Nuestro equipo revisará el contenido.",
      status: "success",
      duration: 2500,
      position: "top",
    });
    setReportReason("");
    onReportClose();
  } catch (err) {
    console.error("Error al reportar:", err);
    toast({
      title: "Error al enviar reporte",
      description: "Ocurrió un error. Intenta de nuevo.",
      status: "error",
      duration: 2500,
      position: "top",
    });
  }
};



  const fetchArticle = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setArticle(res.data);
    } catch (err) {
      console.error("Error al cargar artículo:", err);
    }
  };

  const handleLike = async () => {
    if (!user) return onOpen();
    try {
      const res = await api.post(`/likes/${id}`);
      setNumLikes(res.data.likeCount);
    } catch (err) {
      console.error("Error al dar like:", err);
    }
  };

  const getLikesCount = async () => {
    try {
      const res = await api.get(`/likes/${id}/count`);
      setNumLikes(res.data.likeCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (article) getLikesCount();
  }, [article]);

  if (!article)
    return (
      <Box textAlign="center" mt={20}>
        <Text color="whiteAlpha.700">Cargando artículo...</Text>
      </Box>
    );

  return (
    <>
    <Box
      bgGradient="linear(to-br, gray.900, teal.800)"
      color="white"
      minH="100vh"
      px={{ base: 6, md: 16 }}
      py={10}
    >
      <VStack spacing={4} align="center" mb={6}>
        <Avatar
          size="xl"
          src={article.author?.avatar_url}
          name={article.author?.username}
          border="3px solid"
          borderColor="yellow.400"
        />
        <Heading color="yellow.300" textAlign="center">
          {article.title}
        </Heading>
        <Text fontSize="sm" color="whiteAlpha.600">
          {article.author?.full_name || article.author?.username} •{" "}
          {new Date(article.created_at).toLocaleString()}
        </Text>

        <Divider />
        <Text color="whiteAlpha.900" maxW="4xl" textAlign="justify">
          {article.content}
        </Text>

        <HStack spacing={4} mt={4}>
          <Button colorScheme="pink" leftIcon={<FaHeart />} onClick={handleLike}>
            {numLikes} Me gusta
          </Button>
    <Button colorScheme="red" variant="outline" onClick={onReportOpen}>
    Reportar
  </Button>
        </HStack>
      </VStack>

      <PostModalLogin isOpen={isOpen} onClose={onClose} />
    </Box>

<Modal isOpen={isReportOpen} onClose={onReportClose} isCentered>
  <ModalOverlay />
  <ModalContent bg="gray.800" color="white">
    <ModalHeader color="yellow.300">Reportar artículo</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Textarea
        placeholder="Describe la razón del reporte..."
        value={reportReason}
        onChange={(e) => setReportReason(e.target.value)}
        bg="whiteAlpha.200"
      />
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="red" mr={3} onClick={handleReport}>
        Enviar reporte
      </Button>
      <Button variant="outline" onClick={onReportClose}>
        Cancelar
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>        

</>

  );


}


