import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Button, FormControl, FormLabel, Input,
  VStack, useToast, Select, SimpleGrid, Heading, Textarea, Skeleton
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function CreateJournalistModal({ isOpen, onClose, onSuccess }) {
  const toast = useToast();
  const [mediaOutlets, setMediaOutlets] = useState([]);
  const [genders, setGenders] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [loadingAux, setLoadingAux] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    residence: "",
    birth_date: "",
    bio: "",
    avatar_url: "",
    gender_id: "",
    profession_id: "",
    media_id: "",
  });

  const fetchAuxiliaryData = async () => {
    setLoadingAux(true);
    try {
      const [mediaRes, genderRes, professionRes] = await Promise.all([
        api.get("/admin/media-outlets"),
        api.get("/genders"),
        api.get("/professions"),
      ]);
      setMediaOutlets(mediaRes.data);
      setGenders(genderRes.data);
      setProfessions(professionRes.data);
    } catch (err) {
      toast({
        title: "Error de carga",
        description: "No se pudieron cargar los datos auxiliares (medios, géneros, profesiones).",
        status: "error",
        duration: 3000,
        position: "top",
      });
    } finally {
      setLoadingAux(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchAuxiliaryData();
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/admin/journalists", formData);
      toast({
        title: "Creación Exitosa",
        description: `El periodista ${formData.full_name} ha sido registrado.`,
        status: "success",
        duration: 3000,
        position: "top",
      });
      onSuccess();
      onClose();
      setFormData({
        full_name: "",
        username: "",
        email: "",
        password: "",
        residence: "",
        birth_date: "",
        bio: "",
        avatar_url: "",
        gender_id: "",
        profession_id: "",
        media_id: "",
      });
    } catch (err) {
      console.error("Error al crear periodista:", err);
      toast({
        title: "Error al crear",
        description: err.response?.data?.message || "Hubo un problema al registrar el periodista.",
        status: "error",
        duration: 4000,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.900" color="white" maxH="90vh" overflowY="auto">
        <ModalHeader borderBottom="1px" borderColor="gray.700">
          Crear Nuevo Periodista
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody py={6}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {/* COLUMNA 1 */}
              <VStack spacing={4} align="stretch">
                <Heading size="sm" color="orange.300">
                  Credenciales
                </Heading>
                <FormControl isRequired>
                  <FormLabel>Nombre Completo</FormLabel>
                  <Input size="sm" bg="gray.700" name="full_name" value={formData.full_name} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Usuario</FormLabel>
                  <Input size="sm" bg="gray.700" name="username" value={formData.username} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input size="sm" bg="gray.700" name="email" type="email" value={formData.email} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Contraseña</FormLabel>
                  <Input size="sm" bg="gray.700" name="password" type="password" value={formData.password} onChange={handleChange} />
                </FormControl>
              </VStack>

              {/* COLUMNA 2 */}
              <VStack spacing={4} align="stretch">
                <Heading size="sm" color="orange.300">
                  Datos Personales
                </Heading>
                <FormControl>
                  <FormLabel>Residencia</FormLabel>
                  <Input size="sm" bg="gray.700" name="residence" value={formData.residence} onChange={handleChange} placeholder="País y ciudad" />
                </FormControl>
                <FormControl>
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <Input size="sm" bg="gray.700" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Avatar (URL)</FormLabel>
                  <Input size="sm" bg="gray.700" name="avatar_url" value={formData.avatar_url} onChange={handleChange} placeholder="URL de imagen" />
                </FormControl>
                <FormControl>
                  <FormLabel>Biografía</FormLabel>
                  <Textarea size="sm" bg="gray.700" name="bio" value={formData.bio} onChange={handleChange} placeholder="Breve descripción" />
                </FormControl>
                <FormControl>
                  <FormLabel>Género</FormLabel>
                  {loadingAux ? (
                    <Skeleton height="32px" />
                  ) : (
                    <Select size="sm" bg="gray.700" name="gender_id" value={formData.gender_id} onChange={handleChange} placeholder="Seleccione género">
                      {genders.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Profesión</FormLabel>
                  {loadingAux ? (
                    <Skeleton height="32px" />
                  ) : (
                    <Select size="sm" bg="gray.700" name="profession_id" value={formData.profession_id} onChange={handleChange} placeholder="Seleccione profesión">
                      {professions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </FormControl>
              </VStack>

              {/* COLUMNA 3 */}
              <VStack spacing={4} align="stretch">
                <Heading size="sm" color="orange.300">
                  Datos de Periodista
                </Heading>
                <FormControl isRequired>
                  <FormLabel>Medio de Comunicación</FormLabel>
                  {loadingAux ? (
                    <Skeleton height="32px" />
                  ) : (
                    <Select size="sm" bg="gray.700" name="media_id" value={formData.media_id} onChange={handleChange} placeholder="Seleccione medio">
                      {mediaOutlets.map((media) => (
                        <option key={media.id} value={media.id}>
                          {media.name}
                        </option>
                      ))}
                    </Select>
                  )}
                </FormControl>
              </VStack>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter borderTop="1px" borderColor="gray.700">
            <Button colorScheme="orange" mr={3} type="submit" isLoading={isSubmitting}>
              Crear Periodista
            </Button>
            <Button onClick={onClose} variant="outline" colorScheme="gray">
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
