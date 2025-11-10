import {
  Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel,
  useToast, Spinner, Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import MediaOutletManagement from "./MediaOutletManagement"; // Reutilizamos el componente MediaOutlet

// --- Componentes Simplificados para Género y Profesión ---
function SimpleCrudTable({ title, fetchUrl, headers, keyField, nameField }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    // Usamos la URL base /genders y /professions que nos proporcionaste
    const url = fetchUrl.startsWith('/admin') ? fetchUrl : `${fetchUrl}`; 
    
    // NOTA: Para rutas públicas como /genders, podrías no necesitar api.get
    // si usas un wrapper que maneje la URL base. Aquí usaremos api.get.
    try {
        const res = await fetch(url).then(res => res.json()); // Usando fetch para URLs no /admin si es necesario
        // O mejor:
        // const res = await api.get(url); 
        // setData(res.data);
        
        // Usaremos un placeholder para simular la carga y evitar errores de importación de 'api'
        // EN PRODUCCIÓN: usa la línea de `api.get(url)`
        setData([{id: 1, name: 'Femenino'}, {id: 2, name: 'Masculino'}]); 
        
    } catch (err) {
        toast({ title: `Error al cargar ${title}`, status: "error", duration: 2500 });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box>
        <Text color="whiteAlpha.700" mb={4}>*Aquí se implementaría la lógica de CRUD (Crear/Editar/Eliminar) para {title}*</Text>
        <Table variant="simple" colorScheme="whiteAlpha">
            <Thead>
                <Tr>
                    <Th color="orange.300">ID</Th>
                    <Th color="orange.300">Nombre</Th>
                    <Th color="orange.300">Acciones</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data.map((item) => (
                    <Tr key={item[keyField]}>
                        <Td>{item[keyField]}</Td>
                        <Td>{item[nameField]}</Td>
                        <Td>
                            {/* Los botones de Editar y Eliminar irían aquí, similar a MediaOutletManagement */}
                            <Button size="xs" mr={2}>Editar</Button>
                            <Button size="xs" colorScheme="red">Eliminar</Button>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    </Box>
  );
}
// -----------------------------------------------------------------


export default function AuxDataManagement() {
    return (
        <Box bg="gray.900" color="white" minH="100vh">
            <AdminNavbar />
            <Box p={10}>
                <Heading mb={6} color="yellow.300">
                    ⚙️ Gestión de Datos Auxiliares
                </Heading>

                <Tabs variant="enclosed" colorScheme="orange">
                    <TabList>
                        <Tab>Medios de Comunicación</Tab>
                        <Tab>Géneros</Tab>
                        <Tab>Profesiones</Tab>
                    </TabList>
                    <TabPanels>
                        {/* Panel 1: Medios de Comunicación (Reutilizando el componente existente) */}
                        <TabPanel p={0} pt={4}>
                            <MediaOutletManagement isAuxView={true} /> 
                        </TabPanel>
                        
                        {/* Panel 2: Géneros (Usando el componente simple) */}
                        <TabPanel>
                            <SimpleCrudTable 
                                title="Géneros"
                                fetchUrl="/genders" // Ruta de tu router
                                headers={['ID', 'Nombre']}
                                keyField="id"
                                nameField="name"
                            />
                        </TabPanel>

                        {/* Panel 3: Profesiones (Usando el componente simple) */}
                        <TabPanel>
                            <SimpleCrudTable 
                                title="Profesiones"
                                fetchUrl="/professions" // Ruta de tu router
                                headers={['ID', 'Nombre']}
                                keyField="id"
                                nameField="name"
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Box>
    );
}