import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Text,
  Spinner, useToast, useDisclosure, HStack, Icon, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, FormControl, FormLabel, Input, VStack,
} from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNavbar from "./AdminNavbar"; // Asumiendo que está en el mismo nivel

// --- Componente Modal CRUD para Medios (interno para simplicidad) ---
function MediaOutletCrudModal({ isOpen, onClose, selectedMedia, onSuccess }) {
  const toast = useToast();
  const [formData, setFormData] = useState({ name: "", country: "", city: "", website: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = selectedMedia?.id;
  const title = isEditing ? "Editar Medio de Comunicación" : "Crear Nuevo Medio";

  useEffect(() => {
    if (selectedMedia) {
      setFormData({
        name: selectedMedia.name || "",
        country: selectedMedia.country || "",
        city: selectedMedia.city || "",
        website: selectedMedia.website || "",
      });
    } else {
      setFormData({ name: "", country: "", city: "", website: "" });
    }
  }, [selectedMedia]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        // PATCH: Actualizar
        await api.patch(`/admin/media-outlets/${selectedMedia.id}`, formData);
      } else {
        // POST: Crear
        await api.post("/admin/media-outlets", formData);
      }
      
      toast({
        title: isEditing ? "Actualizado" : "Creado",
        description: `Medio "${formData.name}" guardado con éxito.`,
        status: "success",
        duration: 3000,
        position: "top",
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al guardar medio:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Hubo un problema al guardar el medio.",
        status: "error",
        duration: 4000,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nombre del Medio</FormLabel>
                <Input name="name" value={formData.name} onChange={handleChange} bg="gray.700" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>País</FormLabel>
                <Input name="country" value={formData.country} onChange={handleChange} bg="gray.700" />
              </FormControl>
              <FormControl>
                <FormLabel>Ciudad</FormLabel>
                <Input name="city" value={formData.city} onChange={handleChange} bg="gray.700" />
              </FormControl>
              <FormControl>
                <FormLabel>Sitio Web (URL)</FormLabel>
                <Input name="website" type="url" value={formData.website} onChange={handleChange} bg="gray.700" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="orange" mr={3} type="submit" isLoading={isSubmitting}>
              {isEditing ? "Guardar Cambios" : "Crear Medio"}
            </Button>
            <Button onClick={onClose} variant="ghost">Cancelar</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
// --- Fin Componente Modal ---

export default function MediaOutletManagement() {
  const [mediaOutlets, setMediaOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  // Modal State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMedia, setSelectedMedia] = useState(null);

  const fetchMediaOutlets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/media-outlets");
      setMediaOutlets(res.data);
    } catch (err) {
      console.error("Error al cargar medios:", err);
      toast({
        title: "Error al cargar medios",
        status: "error",
        duration: 2500,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (media) => {
    setSelectedMedia(media);
    onOpen();
  };

  const handleCreate = () => {
    setSelectedMedia(null);
    onOpen();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de ELIMINAR el medio "${name}"? Esto puede afectar a periodistas asociados.`)) {
        return;
    }
    try {
        await api.delete(`/admin/media-outlets/${id}`);
        toast({
            title: "Medio Eliminado",
            description: `"${name}" ha sido eliminado.`,
            status: "success",
            duration: 3000,
            position: "top",
        });
        fetchMediaOutlets(); // Recargar la lista
    } catch (err) {
        console.error("Error al eliminar medio:", err);
        toast({
            title: "Error al eliminar",
            description: err.response?.data?.message || "No se pudo eliminar el medio.",
            status: "error",
            duration: 3000,
            position: "top",
        });
    }
  };

  useEffect(() => {
    fetchMediaOutlets();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="yellow.300" />
        <Text mt={3} color="whiteAlpha.700">Cargando medios de comunicación...</Text>
      </Box>
    );

  return (
    <Box bg="gray.900" color="white" minH="100vh">
      <AdminNavbar />
      <Box p={10}>
        <Heading mb={6} color="orange.300">
          Gestión de Medios de Comunicación
        </Heading>

        <HStack mb={6} justify="flex-end">
            <Button
                colorScheme="orange"
                leftIcon={<Icon as={FaPlus} />}
                onClick={handleCreate} // Abre el modal de creación
            >
                Crear Nuevo Medio
            </Button>
        </HStack>

        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="orange.300">ID</Th>
              <Th color="orange.300">Nombre</Th>
              <Th color="orange.300">País</Th>
              <Th color="orange.300">Sitio Web</Th>
              <Th color="orange.300">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {mediaOutlets.map((m) => (
              <Tr key={m.id} _hover={{ bg: "gray.700" }}>
                <Td>{m.id}</Td>
                <Td fontWeight="bold">{m.name}</Td>
                <Td>{m.country} ({m.city})</Td>
                <Td>
                    <a href={m.website} target="_blank" rel="noopener noreferrer">
                        <Text color="blue.300" isTruncated maxW="200px">
                           {m.website}
                        </Text>
                    </a>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      colorScheme="cyan"
                      size="sm"
                      leftIcon={<Icon as={FaEdit} />}
                      onClick={() => handleEdit(m)}
                    >
                      Editar
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      leftIcon={<Icon as={FaTrash} />}
                      onClick={() => handleDelete(m.id, m.name)}
                    >
                      Eliminar
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal CRUD para Crear/Editar Medios */}
      <MediaOutletCrudModal
        isOpen={isOpen}
        onClose={onClose}
        selectedMedia={selectedMedia}
        onSuccess={fetchMediaOutlets} // Recarga la lista al crear/editar
      />
    </Box>
  );
}