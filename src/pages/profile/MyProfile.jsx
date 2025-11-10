import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Avatar,
  Text,
  VStack,
  Divider,
  Spinner,
  SimpleGrid,
  Tag,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaFileAlt, FaHeart, FaRetweet, FaUserCheck } from "react-icons/fa";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editData, setEditData] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setProfile(res.data);
      setEditData(res.data);
    } catch (err) {
      console.error("Error al cargar el perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      await api.put("/auth/me", editData);
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios se han guardado correctamente.",
        status: "success",
        duration: 3000,
        position: "top",
      });
      onClose();
      fetchProfile();
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios.",
        status: "error",
        duration: 3000,
        position: "top",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout(); // limpia contexto
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
        status: "info",
        duration: 2500,
        position: "top",
      });
      navigate("/login");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
        <Text color="whiteAlpha.700" mt={4}>
          Cargando tu perfil...
        </Text>
      </Box>
    );

  if (!profile)
    return (
      <Text color="red.400" mt={10} textAlign="center">
        Error al cargar los datos del perfil.
      </Text>
    );

  return (
    <Box bg="gray.900" color="white" p={10} minH="100vh">
      <VStack spacing={5}>
        <Avatar size="xl" src={profile.avatar_url} name={profile.username} />
        <Heading color="yellow.300" size="xl">
          {profile.full_name}
        </Heading>
        <Text color="whiteAlpha.700" fontSize="lg">
          @{profile.username}
        </Text>
        <Tag colorScheme={profile.role?.name === "ADMIN" ? "purple" : "teal"}>
          {profile.role?.name}
        </Tag>
            <HStack>
          <Button colorScheme="yellow" variant="outline" onClick={onOpen}>
            Editar Perfil
          </Button>
          <Button colorScheme="red" variant="ghost" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </HStack>
        <Divider my={4} borderColor="whiteAlpha.300" w="50%" />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full" maxW="700px">
          <Box bg="whiteAlpha.100" p={4} borderRadius="md">
            <Text fontSize="xs" color="whiteAlpha.500">
              Biografía
            </Text>
            <Text>{profile.bio || "No has agregado una biografía."}</Text>
          </Box>

          <Box bg="whiteAlpha.100" p={4} borderRadius="md">
            <Text fontSize="xs" color="whiteAlpha.500">
              Residencia
            </Text>
            <Text>{profile.residence || "No especificada."}</Text>
          </Box>

          <Box bg="whiteAlpha.100" p={4} borderRadius="md">
            <Text fontSize="xs" color="whiteAlpha.500">
              Fecha de nacimiento
            </Text>
            <Text>
              {profile.birth_date
                ? new Date(profile.birth_date).toLocaleDateString()
                : "No especificada."}
            </Text>
          </Box>

          <Box bg="whiteAlpha.100" p={4} borderRadius="md">
            <Text fontSize="xs" color="whiteAlpha.500">
              Miembro desde
            </Text>
            <Text>{new Date(profile.created_at).toLocaleDateString()}</Text>
          </Box>
        </SimpleGrid>

        <Divider my={6} borderColor="whiteAlpha.300" />

        <Tabs variant="enclosed" colorScheme="yellow" w="full" maxW="800px">
          <TabList>
            <Tab><FaFileAlt />&nbsp; Mis publicaciones</Tab>
            <Tab><FaHeart />&nbsp; Likes dados</Tab>
            <Tab><FaRetweet />&nbsp; Compartidos</Tab>
            <Tab><FaUserCheck /> Siguiendo</Tab>

          </TabList>

          <TabPanels>
            {[profile.posts, profile.liked_posts, profile.shared_posts].map((list, i) => (
              <TabPanel key={i}>
                {list?.length ? (
                  list.map((p) => (
                    <Box
                      key={p.id}
                      p={4}
                      bg="whiteAlpha.100"
                      borderRadius="md"
                      mb={3}
                      _hover={{ bg: "whiteAlpha.200", cursor: "pointer" }}
                      onClick={() => navigate(`/posts/${p.id}`)}
                    >
                      <Heading size="sm" color="yellow.200">
                        {p.title}
                      </Heading>
                      <Text fontSize="sm">{p.summary}</Text>
                    </Box>
                  ))
                ) : (
                  <Text color="whiteAlpha.600">Nada que mostrar aquí.</Text>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        <Divider my={6} borderColor="whiteAlpha.300" />

      </VStack>

      {/* 🔧 MODAL DE EDICIÓN */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Editar Perfil</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nombre completo</FormLabel>
                <Input name="full_name" value={editData.full_name || ""} onChange={handleEditChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Nombre de usuario</FormLabel>
                <Input name="username" value={editData.username || ""} onChange={handleEditChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Biografía</FormLabel>
                <Textarea name="bio" value={editData.bio || ""} onChange={handleEditChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Residencia</FormLabel>
                <Input name="residence" value={editData.residence || ""} onChange={handleEditChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <Input type="date" name="birth_date" value={editData.birth_date?.split("T")[0] || ""} onChange={handleEditChange} />
              </FormControl>
              <FormControl>
                <FormLabel>URL del Avatar</FormLabel>
                <Input name="avatar_url" value={editData.avatar_url || ""} onChange={handleEditChange} />
              </FormControl>
              <FormControl>
                <FormLabel>Restablecer contraseña</FormLabel>
                <Input type="password" name="password" placeholder="Nueva contraseña (opcional)" onChange={handleEditChange} />
              </FormControl>
              <Button colorScheme="yellow" w="full" onClick={handleSaveChanges}>
                Guardar Cambios
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
