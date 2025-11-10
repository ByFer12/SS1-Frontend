import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  useToast,
  Spinner,
  Tag,
  Flex,
  Image,
  HStack,
} from "@chakra-ui/react";
import api from "../../api/axios";

export default function PostCreateForm() {
  const toast = useToast();
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    type: "news",
    categoryIds: [],
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // 🔹 Cargar categorías al montar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        console.log("Categorías cargadas:", res.data);
        setCategories(res.data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
        toast({
          title: "Error al cargar categorías",
          status: "error",
          duration: 2500,
          position: "top",
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [toast]);

  // 🔹 Actualizar campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // 🔹 Categorías (múltiples)
  const handleCategoryChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value));
    setForm((prev) => ({ ...prev, categoryIds: values }));
  };

  // 🔹 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast({
        title: "Faltan campos obligatorios",
        description: "Asegúrate de llenar título y contenido",
        status: "warning",
        duration: 3000,
        position: "top",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(form));
      if (image) formData.append("cover_image", image);

      const res = await api.post("/posts/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Publicación creada con éxito",
        status: "success",
        duration: 3000,
        position: "top",
      });

      console.log("✅ Post creado:", res.data);
      setForm({
        title: "",
        summary: "",
        content: "",
        type: "news",
        categoryIds: [],
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Error al crear publicación:", err);
      toast({
        title: "Error al crear publicación",
        status: "error",
        duration: 3000,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="gray.900" color="white" p={8} rounded="lg" boxShadow="xl" maxW="4xl" mx="auto">
      <Heading size="lg" mb={6} color="yellow.300" textAlign="center">
        Crear Nueva Publicación
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">

          <FormControl isRequired>
            <FormLabel fontWeight="bold" color="yellow.200">Título</FormLabel>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Título llamativo..."
              bg="gray.800"
              border="none"
              _focus={{ bg: "gray.700", outline: "none" }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="bold" color="yellow.200">Resumen</FormLabel>
            <Textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              placeholder="Breve resumen de la publicación"
              bg="gray.800"
              border="none"
              _focus={{ bg: "gray.700", outline: "none" }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontWeight="bold" color="yellow.200">Contenido</FormLabel>
            <Textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Escribe el cuerpo completo de la publicación..."
              rows={8}
              bg="gray.800"
              border="none"
              _focus={{ bg: "gray.700", outline: "none" }}
            />
          </FormControl>

          <Flex gap={6}>
            <FormControl isRequired flex="1">
              <FormLabel fontWeight="bold" color="yellow.200">Tipo</FormLabel>
              <Select
                name="type"
                value={form.type}
                onChange={handleChange}
                bg="gray.800"
                border="none"
              >
                <option value="news">📰 Noticia</option>
                <option value="article">📄 Artículo</option>
                <option value="forum">💬 Foro</option>
              </Select>
            </FormControl>

            <FormControl flex="2">
  <FormLabel fontWeight="bold" color="yellow.200">Categorías</FormLabel>
  {loadingCategories ? (
    <Spinner color="yellow.300" />
  ) : (
    <Select
      // *** Importante: ELIMINAMOS 'multiple' y 'height' para que se vea como un dropdown simple ***
      // Asumo que tu 'handleCategoryChange' ahora maneja un solo valor (el ID de la categoría)
      value={form.categoryIds[0]} // Asumo que tomas la primera categoría seleccionada o el ID
      onChange={handleCategoryChange} 
      bg="gray.800"
      border="none"
      // Estos estilos son los que le dan la estética del select de 'Tipo'
      color="whiteAlpha.800"
      _hover={{ borderColor: "gray.600" }} 
      _focus={{ boxShadow: "outline" }}
    >
      {/* Opción por defecto (Opcional) */}
      <option value="">Selecciona una Categoría</option>
      
      {/* Mapeo de las categorías disponibles */}
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </Select>
  )}
  
</FormControl>
          </Flex>

          <FormControl>
            <FormLabel fontWeight="bold" color="yellow.200">Imagen de portada</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              bg="gray.800"
              p={1.5}
            />
            {preview && (
              <Box mt={4} textAlign="center">
                <Image src={preview} alt="Preview" maxH="200px" mx="auto" rounded="md" />
                <Text fontSize="sm" color="whiteAlpha.700">Vista previa</Text>
              </Box>
            )}
          </FormControl>

          <Button
            type="submit"
            colorScheme="yellow"
            size="lg"
            isLoading={loading}
            loadingText="Creando..."
            alignSelf="center"
            px={10}
          >
            Publicar
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
