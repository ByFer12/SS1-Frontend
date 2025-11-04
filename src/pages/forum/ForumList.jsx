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
} from "@chakra-ui/react";
import { FaHeart, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "../posts/PostModalLogin";
import { useState } from "react";

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

  const [forums, setForums] = useState([
    {
      id: 1,
      title: "Cambio climático y acciones locales",
      author: "Lucía Pérez",
      posts: 12,
      lastActivity: "Hace 3 horas",
      likes: 15,
    },
    {
      id: 2,
      title: "Propuestas ciudadanas para mejorar el transporte público",
      author: "Carlos Gómez",
      posts: 8,
      lastActivity: "Hace 1 día",
      likes: 22,
    },
    {
      id: 3,
      title: "Proyectos tecnológicos para comunidades rurales",
      author: "Ana Morales",
      posts: 5,
      lastActivity: "Hace 2 días",
      likes: 9,
    },
  ]);

  const [newForum, setNewForum] = useState({
    title: "",
    description: "",
  });

  // Manejo de like
  const handleLike = (id) => {
    if (!user) return onOpen();
    setForums((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, likes: f.likes + 1 } : f
      )
    );
  };

  // Crear nuevo foro
  const handleCreateForum = () => {
    if (!newForum.title.trim() || !newForum.description.trim()) {
      toast({
        title: "Completa todos los campos",
        status: "warning",
        duration: 2000,
        position: "top",
      });
      return;
    }

    const newId = forums.length + 1;
    const newEntry = {
      id: newId,
      title: newForum.title,
      author: user?.username || "Usuario",
      posts: 0,
      lastActivity: "Justo ahora",
      likes: 0,
    };

    setForums([newEntry, ...forums]);
    setNewForum({ title: "", description: "" });
    onModalClose();

    toast({
      title: "Nuevo foro creado",
      status: "success",
      duration: 2000,
      position: "top",
    });
  };

  return (
    <Box
      bgGradient="linear(to-br, gray.900, teal.800)"
      color="white"
      minH="100vh"
      px={{ base: 6, md: 16 }}
      py={10}
    >
      <HStack justify="space-between" mb={6}>
        <Heading color="yellow.300">Foro Comunitario</Heading>

        {user ? (
          <Button
            leftIcon={<FaPlus />}
            colorScheme="yellow"
            variant="solid"
            onClick={onModalOpen}
          >
            Nuevo foro
          </Button>
        ) : (
          <Button
            leftIcon={<FaPlus />}
            colorScheme="yellow"
            variant="outline"
            onClick={onOpen}
          >
            Nuevo foro
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
                <Heading size="md" color="teal.200">
                  {f.title}
                </Heading>
                <Text mt={2}>Autor: {f.author}</Text>
                <Text fontSize="sm" color="whiteAlpha.700">
                  Última actividad: {f.lastActivity}
                </Text>
              </Box>

              <VStack>
                <IconButton
                  aria-label="like"
                  icon={<FaHeart />}
                  colorScheme="pink"
                  variant="ghost"
                  onClick={() => handleLike(f.id)}
                />
                <Text fontSize="sm" color="whiteAlpha.800">
                  {f.likes}
                </Text>
              </VStack>
            </HStack>

            <Divider my={3} />
            <HStack justify="space-between">
              <Text fontSize="sm">{f.posts} publicaciones</Text>
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

      {/* Modal login si no hay sesión */}
      <PostModalLogin isOpen={isOpen} onClose={onClose} />

      {/* Modal crear nuevo foro */}
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
                onChange={(e) =>
                  setNewForum({ ...newForum, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Descripción o tema del foro..."
                bg="whiteAlpha.200"
                value={newForum.description}
                onChange={(e) =>
                  setNewForum({ ...newForum, description: e.target.value })
                }
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
