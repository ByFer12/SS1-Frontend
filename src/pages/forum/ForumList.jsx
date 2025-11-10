// src/pages/forum/ForumList.jsx
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  HStack,
  Divider,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  ModalCloseButton,
  useToast,
  Badge,
  Avatar,
} from "@chakra-ui/react";
import { FaHeart, FaPlus, FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "../posts/PostModalLogin";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function ForumList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const toast = useToast();

  const [forums, setForums] = useState([]);
  const [newForum, setNewForum] = useState({ title: "", content: "" });
  const [numLikes, setNumLikes] = useState(0);
  const [likesByPost, setLikesByPost] = useState({});



  // 🟢 Cargar todos los foros desde backend
  const fetchForums = async () => {
    try {
      const res = await api.get("/posts/forums");
     // console.log("Foros cargadosaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:", res.data);
      setForums(res.data);
    } catch (err) {
      console.error("Error al cargar foros:", err);
    }
  };
const getLikesCount = async (id) => {
  try {
    const res = await api.get(`/likes/${id}/count`);
    const count = res.data.likeCount;
    console.log(`Likes para post ${id}:`, count);

    setLikesByPost((prev) => ({
      ...prev,
      [id]: count,
    }));
  } catch (err) {
    console.error(`Error al obtener likes para post ${id}:`, err);
  }
};


  // ✳️ Crear nuevo foro
  const handleCreateForum = async () => {
    if (!newForum.title.trim() || !newForum.content.trim()) {
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
        title: newForum.title,
        content: newForum.content,
        type: "forum", // 🔥 importante
      });

      toast({
        title: "Foro creado con éxito",
        status: "success",
        duration: 2000,
        position: "top",
      });
      setNewForum({ title: "", content: "" });
      onModalClose();
      fetchForums();
    } catch (err) {
      console.error("Error al crear foro:", err);
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

useEffect(() => {
  const fetchAllLikes = async () => {
    try {
      const results = await Promise.all(
        forums.map(async (f) => {
          const res = await api.get(`/likes/${f.id}/count`);
          return { id: f.id, count: res.data.likeCount };
        })
      );

      const newLikes = {};
      results.forEach((r) => {
        newLikes[r.id] = r.count;
        console.log(`Likes para post ${r.id}:`, r.count);
      });

      setLikesByPost(newLikes);
    } catch (err) {
      console.error("Error al obtener likes:", err);
    }
  };

  if (forums.length > 0) fetchAllLikes();
}, [forums]);



  return (
    <Box bgGradient="linear(to-br, gray.900, teal.800)" color="white" minH="100vh" px={{ base: 6, md: 16 }} py={10}>
      <HStack justify="space-between" mb={6}>
        <Heading color="yellow.300">Foros Comunitarios</Heading>

        {user ? (
          <Button leftIcon={<FaPlus />} colorScheme="yellow" onClick={onModalOpen}>
            Nuevo Foro
          </Button>
        ) : (
          <Button leftIcon={<FaPlus />} colorScheme="yellow" variant="outline" onClick={onOpen}>
            Nuevo Foro
          </Button>
        )}
      </HStack>

      <VStack spacing={4} align="stretch">
        {forums.map((f) => (
  <Box
    key={f.id}
    bg="whiteAlpha.100"
    borderRadius="md"
    p={5}
    _hover={{ bg: "whiteAlpha.200", cursor: "pointer" }}
  >
    <HStack justify="space-between" align="start">
      <Box flex="1" onClick={() => navigate(`/forum/${f.id}`)}>
        <HStack spacing={3} mb={2}>
          <Avatar size="sm" src={f.author?.avatar_url} name={f.author?.username} />
          <Box>
            <Heading size="sm" color="teal.200">{f.title}</Heading>
            <Text fontSize="sm" color="whiteAlpha.700">
              Por {f.author?.full_name || f.author?.username}
            </Text>
          </Box>
        </HStack>
        <Text noOfLines={2} color="whiteAlpha.800">{f.summary || f.content}</Text>
        <Text fontSize="xs" color="whiteAlpha.600" mt={1}>
          Publicado: {new Date(f.created_at).toLocaleDateString()}
        </Text>
      </Box>

    </HStack>

    <Divider my={3} />
    <HStack justify="space-between">
      <HStack spacing={2}>
        <HStack><FaComment /><Text fontSize="sm">{f.comments_count || 0}</Text></HStack>
        <HStack><FaHeart /><Text fontSize="sm">{likesByPost[f.id] ?? 0}</Text></HStack>
      </HStack>
      <Button
        size="sm"
        colorScheme="yellow"
        variant="outline"
        onClick={() => navigate(`/forum/${f.id}`)}
      >
        Ver detalles
      </Button>
    </HStack>
  </Box>
))}

      </VStack>

      <PostModalLogin isOpen={isOpen} onClose={onClose} />

      <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader color="yellow.300">Crear nuevo foro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Título del foro"
                bg="whiteAlpha.200"
                value={newForum.title}
                onChange={(e) => setNewForum({ ...newForum, title: e.target.value })}
              />
              <Textarea
                placeholder="Descripción o tema del foro..."
                bg="whiteAlpha.200"
                value={newForum.content}
                onChange={(e) => setNewForum({ ...newForum, content: e.target.value })}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleCreateForum}>
              Crear
            </Button>
            <Button variant="outline" onClick={onModalClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
