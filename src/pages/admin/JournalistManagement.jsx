import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  Spinner,
  useToast,
  useDisclosure,
  HStack, // Añadido para los botones de acción
  Icon,  // Añadido para los íconos de los botones
  // Ya no necesitamos 'Select' ni 'Tag' si eliminamos la columna de orientación
} from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Iconos
import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminNavbar from "./AdminNavbar";
import JournalistSummaryModal from "./JournalistSummaryModal"; // Para ver el resumen
import CreateJournalistModal from "./CreateJournalistModal"; // Nuevo componente
import EditJournalistModal from "./EditJournalistModal"; // Nuevo componente

export default function JournalistManagement() {
  const [journalists, setJournalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Estados para los tres modales (Ver Resumen, Crear, Editar)
  const { isOpen: isSummaryOpen, onOpen: onSummaryOpen, onClose: onSummaryClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const [selectedJournalist, setSelectedJournalist] = useState(null);

  const fetchJournalists = async () => {
    try {
      const res = await api.get("/admin/journalists");
      console.log("Periodistas cargados:", res.data);
      // Ya no inicializamos 'orientation'
      setJournalists(res.data);
    } catch (err) {
      console.error("Error al cargar periodistas:", err);
      toast({
        title: "Error al cargar periodistas",
        status: "error",
        duration: 2500,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  // 1. Función para ELIMINAR Periodista
  const handleDelete = async (userId, fullName) => {
    if (!window.confirm(`¿Estás seguro de que quieres ELIMINAR permanentemente a ${fullName}?`)) {
        return;
    }
    try {
        await api.delete(`/admin/journalists/${userId}`);
        toast({
            title: "Periodista Eliminado",
            description: `${fullName} ha sido eliminado del sistema.`,
            status: "success",
            duration: 3000,
            position: "top",
        });
        fetchJournalists(); // Recargar la lista
    } catch (err) {
        console.error("Error al eliminar periodista:", err);
        toast({
            title: "Error al eliminar",
            description: err.response?.data?.message || "No se pudo eliminar el periodista.",
            status: "error",
            duration: 3000,
            position: "top",
        });
    }
  };

  // Función para abrir el modal de resumen
  const handleRowClick = (journalist) => {
    setSelectedJournalist(journalist);
    onSummaryOpen();
  };

  // Función para abrir el modal de edición
  const handleEditClick = (journalist) => {
    setSelectedJournalist(journalist);
    onEditOpen();
  };


  useEffect(() => {
    fetchJournalists();
  }, []);

  if (loading)
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="yellow.300" />
        <Text mt={3}>Cargando periodistas...</Text>
      </Box>
    );

  return (
    <Box bg="gray.900" color="white" minH="100vh">
      <AdminNavbar />
      <Box p={10}>
        <Heading mb={6} color="orange.300">
          Gestión de Periodistas
        </Heading>

        <HStack mb={6} justify="flex-end">
            <Button
                colorScheme="orange"
                leftIcon={<Icon as={FaPlus} />}
                onClick={onCreateOpen} // Abre el modal de creación
            >
                Crear Nuevo Periodista
            </Button>
        </HStack>

        <Table variant="simple" colorScheme="whiteAlpha">
          <Thead>
            <Tr>
              <Th color="orange.300">Nombre</Th>
              <Th color="orange.300">Correo</Th>
              <Th color="orange.300">Medio</Th>
              <Th color="orange.300">Orientación Asignada</Th> {/* Columna informativa */}
              <Th color="orange.300">Acciones</Th> {/* Columna de acciones CRUD */}
            </Tr>
          </Thead>
          <Tbody>
            {journalists.map((j) => (
              <Tr
                key={j.user_id}
                _hover={{ bg: "gray.700", cursor: "pointer" }}
                onClick={() => handleRowClick(j)} // Click en fila para ver resumen
              >
                <Td>{j.user?.full_name}</Td>
                <Td>{j.user?.email}</Td>
                <Td>{j.media_outlet?.name || "Sin medio"}</Td>
                <Td>
                   <Text 
                      color={j.political_orientation ? "yellow.300" : "whiteAlpha.500"}
                      fontWeight="bold"
                   >
                     {j.political_orientation || "N/A"}
                   </Text>
                </Td>
                {/* Columna de Acciones: Evita propagación para no abrir el modal de resumen */}
                <Td onClick={(e) => e.stopPropagation()}> 
                  <HStack spacing={2}>
                    <Button
                      colorScheme="cyan"
                      size="sm"
                      leftIcon={<Icon as={FaEdit} />}
                      onClick={() => handleEditClick(j)}
                    >
                      Editar
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      leftIcon={<Icon as={FaTrash} />}
                      onClick={() => handleDelete(j.user_id, j.user.full_name)}
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

      {/* MODALES */}
      
      {/* 1. Modal para ver el resumen (JournalistSummaryModal) */}
      {selectedJournalist && (
        <JournalistSummaryModal
          isOpen={isSummaryOpen}
          onClose={onSummaryClose}
          journalist={selectedJournalist}
        />
      )}
      
      {/* 2. Modal para CREAR Periodista */}
      <CreateJournalistModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={fetchJournalists} // Recarga la lista al crear
      />

      {/* 3. Modal para EDITAR Periodista */}
      {selectedJournalist && (
        <EditJournalistModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          journalist={selectedJournalist} // Pasa los datos actuales
          onSuccess={fetchJournalists} // Recarga la lista al editar
        />
      )}
    </Box>
  );
}