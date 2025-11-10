import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Button, FormControl, FormLabel, Input,
  VStack, useToast, Select, Spinner, SimpleGrid, Heading, Textarea, Skeleton
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import api from "../../api/axios";

const orientationOptions = [
  { value: "left", label: "Izquierda" },
  { value: "center_left", label: "Centro Izquierda" },
  { value: "center", label: "Centro" },
  { value: "center_right", label: "Centro Derecha" },
  { value: "right", label: "Derecha" },
  { value: "neutral", label: "Neutral" },
];

export default function EditJournalistModal({ isOpen, onClose, journalist, onSuccess }) {
  const toast = useToast();
  const [formData, setFormData] = useState({});
  const [mediaOutlets, setMediaOutlets] = useState([]);
  const [genders, setGenders] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [loadingAux, setLoadingAux] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        description: "No se pudieron cargar los datos auxiliares.",
        status: "error",
        duration: 3000,
        position: "top",
      });
    } finally {
      setLoadingAux(false);
    }
  };

  useEffect(() => {
    if (journalist) {
      const user = journalist.user || {};
      const birthDate = user.birth_date
        ? new Date(user.birth_date).toISOString().split("T")[0]
        : "";

      setFormData({
        full_name: user.full_name || "",
        username: user.username || "",
        email: user.email || "",
        residence: user.residence || "",
        birth_date: birthDate,
        bio: user.bio || "",
        avatar_url: user.avatar_url || "",
        gender_id: user.gender_id || "",
        profession_id: user.profession_id || "",
        media_id: journalist.media_id || "",
        political_orientation: journalist.political_orientation || "",
      });
    }
  }, [journalist]);

  useEffect(() => {
    if (isOpen) fetchAuxiliaryData();
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    console.log("Cargando datos de los periodistaasssssssssssssss.", journalist);
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch(`/admin/journalists/${journalist.user_id}`, formData);
      toast({
        title: "Actualización Exitosa",
        description: `Los datos de ${formData.full_name} fueron actualizados.`,
        status: "success",
        duration: 3000,
        position: "top",
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al actualizar periodista:", err);
      toast({
        title: "Error al actualizar",
        description:
          err.response?.data?.message ||
          "Hubo un problema al actualizar el periodista.",
        status: "error",
        duration: 4000,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!journalist) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="gray.900" color="white" maxH="90vh" overflowY="auto">
        <ModalHeader borderBottom="1px" borderColor="gray.700">
          Editar Periodista: {journalist?.user?.full_name}
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody py={6}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {/* Datos principales */}
              <VStack spacing={4} align="stretch">
                <Heading size="sm" color="cyan.300">
                  Datos Principales
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
                <FormControl>
                  <FormLabel>Avatar URL</FormLabel>
                  <Input size="sm" bg="gray.700" name="avatar_url" value={formData.avatar_url} onChange={handleChange} />
                </FormControl>
              </VStack>

              {/* Datos personales */}
              <VStack spacing={4} align="stretch">
                <Heading size="sm" color="cyan.300">
                  Datos Personales
                </Heading>
                <FormControl>
                  <FormLabel>Residencia</FormLabel>
                  <Input size="sm" bg="gray.700" name="residence" value={formData.residence} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <Input size="sm" bg="gray.700" type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>Biografía</FormLabel>
                  <Textarea size="sm" bg="gray.700" name="bio" value={formData.bio} onChange={handleChange} />
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

              {/* Datos de periodista */}
              <VStack spacing={4} align="stretch">
                <Heading size="sm" color="cyan.300">
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
                <FormControl>
                  <FormLabel>Orientación Política</FormLabel>
                  <Select size="sm" bg="gray.700" name="political_orientation" value={formData.political_orientation} onChange={handleChange} placeholder="Sin orientación">
                    {orientationOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </VStack>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter borderTop="1px" borderColor="gray.700">
            <Button colorScheme="cyan" mr={3} type="submit" isLoading={isSubmitting}>
              Guardar Cambios
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
