import {
  Flex,
  Box,
  Button,
  IconButton,
  Text,
  HStack,
  VStack,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const NavLinks = (
    <>
      <Text as={RouterLink} to="/posts" _hover={{ color: "yellow.300" }}>
        Noticias
      </Text>
      <Text as={RouterLink} to="/events" _hover={{ color: "yellow.300" }}>
        Alertas
      </Text>
      <Text as={RouterLink} to="/help" _hover={{ color: "yellow.300" }}>
        Ayuda Humanitaria
      </Text>
      <Text as={RouterLink} to="/forum" _hover={{ color: "yellow.300" }}>
        Foros
      </Text>
      {user?.role_id === 1 && (
        <Text as={RouterLink} to="/admin" _hover={{ color: "yellow.300" }}>
          Administración
        </Text>
      )}
    </>
  );

  return (
    <Flex
      bgGradient="linear(to-r, gray.900, teal.800)"
      color="white"
      px={{ base: 4, md: 8 }}
      py={3}
      align="center"
      boxShadow="md"
      justify="space-between"
      fontFamily="'Poppins', sans-serif"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      {/* Logo con estilo artístico */}
      <Text
        as={RouterLink}
        to="/"
        fontWeight="bold"
        fontSize={{ base: "xl", md: "2xl" }}
        bgGradient="linear(to-r, teal.300, yellow.200)"
        bgClip="text"
        fontFamily="'Orbitron', sans-serif"
        letterSpacing="wide"
        _hover={{
          textDecoration: "none",
          bgGradient: "linear(to-r, yellow.200, teal.200)",
        }}
      >
        SS1 - Plataforma
      </Text>

      {/* Links escritorio */}
      <HStack
        spacing={6}
        display={{ base: "none", md: "flex" }}
        fontWeight="medium"
        fontFamily="'Poppins', sans-serif"
      >
        {NavLinks}
      </HStack>

      {/* Botones sesión */}
      <HStack display={{ base: "none", md: "flex" }}>
        {user ? (
          <>
            <Text fontWeight="semibold" color="yellow.200">
              {user.username}
            </Text>
            <Button
              size="sm"
              variant="outline"
              borderColor="yellow.300"
              _hover={{ bg: "yellow.400", color: "gray.900" }}
              onClick={logout}
            >
              Salir
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              colorScheme="yellow"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </Button>
            <Button
              size="sm"
              variant="outline"
              borderColor="yellow.300"
              _hover={{ bg: "yellow.300", color: "gray.900" }}
              onClick={() => navigate("/register")}
            >
              Registrarse
            </Button>
          </>
        )}
      </HStack>

      {/* Menú móvil */}
      <IconButton
        aria-label="Menú"
        icon={<HamburgerIcon />}
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        bg="teal.700"
        _hover={{ bg: "teal.500" }}
      />

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.900" color="white">
          <DrawerCloseButton />
          <DrawerBody mt={10}>
            <VStack align="start" spacing={6}>
              {NavLinks}
              <Box pt={4}>
                {user ? (
                  <Button w="full" variant="outline" onClick={logout}>
                    Cerrar sesión
                  </Button>
                ) : (
                  <>
                    <Button
                      w="full"
                      colorScheme="yellow"
                      onClick={() => navigate("/login")}
                    >
                      Iniciar sesión
                    </Button>
                    <Button
                      mt={2}
                      w="full"
                      variant="outline"
                      onClick={() => navigate("/register")}
                    >
                      Registrarse
                    </Button>
                  </>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
