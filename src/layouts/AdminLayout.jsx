import { Box, Flex, VStack, HStack, Text, IconButton, Button } from "@chakra-ui/react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUsers, FaNewspaper, FaUserTie, FaClipboardCheck, FaSignOutAlt, FaBalanceScale } from "react-icons/fa";

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: FaClipboardCheck },
    { label: "Usuarios", path: "/admin/users", icon: FaUsers },
    { label: "Reportes", path: "/admin/reports", icon: FaClipboardCheck },
    { label: "Periodistas", path: "/admin/journalists", icon: FaUserTie },
    { label: "Validar Posts", path: "/admin/posts/validate", icon: FaNewspaper },
    { label: "Estadísticas de Periodistas", path: "/admin/journalists/stats", icon: FaBalanceScale },
    { label: "Crear Publicación", path: "/admin/posts/create", icon: FaNewspaper },

    { label: "Medios de Comunicación", path: "/admin/media", icon: FaNewspaper },
    { label: "Mi Perfil", path: "/admin/me", icon: FaUserTie },
    
  ];

  return (
    <Flex bg="gray.900" minH="100vh" color="white">
      {/* Sidebar */}
      <Box
        w="260px"
        bg="gray.800"
        p={6}
        display={{ base: "none", md: "block" }}
        boxShadow="xl"
      >
        <VStack align="stretch" spacing={5}>
          <Text fontSize="2xl" fontWeight="bold" color="yellow.300" textAlign="center">
            Admin Panel
          </Text>
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                background: isActive ? "#2C7A7B" : "transparent",
                borderRadius: "8px",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: isActive ? "white" : "#CBD5E0",
                fontWeight: isActive ? "bold" : "normal",
                textDecoration: "none",
              })}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
          <Button
            mt={6}
            colorScheme="red"
            leftIcon={<FaSignOutAlt />}
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </VStack>
      </Box>

      {/* Contenido principal */}
      <Box flex="1" p={6} bgGradient="linear(to-br, gray.900, teal.800)">
        <Outlet />
      </Box>
    </Flex>
  );
}
