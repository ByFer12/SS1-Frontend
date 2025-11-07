import {
  Flex,
  Box,
  Button,
  Text,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  VStack,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, ChevronDownIcon, BellIcon } from "@chakra-ui/icons";
import { FaUserCircle } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const notifications = [
    { id: 1, message: "Nuevo comentario en tu publicación" },
    { id: 2, message: "Evento programado para mañana" },
    { id: 3, message: "Tu solicitud de ayuda fue aceptada" },
    { id: 4, message: "Mensaje de un voluntario" },
    { id: 5, message: "Nuevo artículo publicado" },
    { id: 6, message: "Se agregó una actualización de sistema" },
    { id: 7, message: "Tu publicación recibió 5 likes" },
    { id: 8, message: "Nuevo usuario registrado" },
    { id: 9, message: "Tu perfil fue actualizado correctamente" },
    { id: 10, message: "Recordatorio de verificación de correo" },
  ];

  return (
    <Flex
      bgGradient="linear(to-r, gray.900, teal.800)"
      color="white"
      px={{ base: 4, md: 8 }}
      py={3}
      align="center"
      justify="space-between"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      {/* Logo */}
      <Text
        as={RouterLink}
        to="/"
        fontWeight="bold"
        fontSize={{ base: "xl", md: "2xl" }}
        bgGradient="linear(to-r, teal.300, yellow.200)"
        bgClip="text"
        _hover={{
          textDecoration: "none",
          bgGradient: "linear(to-r, yellow.200, teal.200)",
        }}
      >
        SS1 - Plataforma
      </Text>

      {/* Links escritorio */}
      <HStack spacing={6} display={{ base: "none", md: "flex" }}>
        {/* Menú Posts */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
            color="yellow.300"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            Posts
          </MenuButton>
          <MenuList bg="gray.900" borderColor="teal.700" boxShadow="lg">
            <MenuItem
              as={RouterLink}
               bg="teal.600"
                    borderBottomWidth="1px"         
                    borderBottomStyle="solid"      
                    borderBottomColor="teal.700"
              to="/posts"
              _hover={{ bg: "teal.800", color: "yellow.200" }}
              color="white"
            >
              Noticias
            </MenuItem>
            {user && (
              <>
                <MenuItem
                  as={RouterLink}
                  to="/articles"
                   bg="teal.600"
                    borderBottomWidth="1px"         
                    borderBottomStyle="solid"      
                    borderBottomColor="teal.700"
                  _hover={{ bg: "teal.800", color: "yellow.200" }}
                  color="white"
                >
                  Artículos
                </MenuItem>
                <MenuItem
                  as={RouterLink}
                   bg="teal.600"
                    borderBottomWidth="1px"         
                    borderBottomStyle="solid"      
                    borderBottomColor="teal.700"
                  to="/forum"
                  _hover={{ bg: "teal.800", color: "yellow.200" }}
                  color="white"
                >
                  Foros
                </MenuItem>
              </>
            )}
          </MenuList>
        </Menu>

        {/* Menú Ayuda Humanitaria */}
        {user && (
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
              color="yellow.300"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              Ayuda Humanitaria
            </MenuButton>
            <MenuList bg="gray.900" borderColor="teal.700" boxShadow="lg">
              <MenuItem
                as={RouterLink}
                to="/help"
                 bg="teal.600"
                    borderBottomWidth="1px"         
                    borderBottomStyle="solid"      
                    borderBottomColor="teal.700"
                _hover={{ bg: "teal.800", color: "yellow.200" }}
                color="white"
              >
                Solicitar Ayuda
              </MenuItem>
              <MenuItem
                as={RouterLink}
                to="/events"
                 bg="teal.600"
                    borderBottomWidth="1px"         
                    borderBottomStyle="solid"      
                    borderBottomColor="teal.700"
                _hover={{ bg: "teal.800", color: "yellow.200" }}
                color="white"
              >
                Eventos
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>

      {/* Usuario y notificaciones */}
      <HStack spacing={4} display={{ base: "none", md: "flex" }}>
        {user ? (
          <>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={
                  <Box position="relative">
                    <BellIcon boxSize={6} color="yellow.200" />
                    <Badge
                      colorScheme="red"
                      borderRadius="full"
                      position="absolute"
                      top="-1"
                      right="-1"
                      fontSize="0.7em"
                      px="1.5"
                    >
                      {notifications.length}
                    </Badge>
                  </Box>
                }
                variant="ghost"
                _hover={{ bg: "whiteAlpha.200" }}
              />
              <MenuList
                bg="gray.900"
                borderColor="teal.700"
                boxShadow="lg"
                maxH="250px"
                overflowY="auto"
              >
                {notifications.map((n) => (
                  <MenuItem
                    key={n.id}
                    bg="teal.600"
                    borderBottomWidth="1px"         
                    borderBottomStyle="solid"      
                    borderBottomColor="teal.700"
                    _hover={{ bg: "teal.800", color: "yellow.200" }}
                    color="white"
                  >
                    {n.message}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* 👤 Menú de usuario */}
            <Menu placement="bottom-end">
              <MenuButton
                as={Button}
                variant="ghost"
                leftIcon={<FaUserCircle size={22} />}
                color="yellow.200"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                {user.username}
              </MenuButton>
              <MenuList
                bg="gray.900"
                borderColor="teal.700"
                boxShadow="lg"
                color="white"
                minW="180px"
              >
                <MenuItem
                  as={RouterLink}
                  to="/profile"
                  _hover={{ bg: "teal.800", color: "yellow.200" }}
                >
                  Ver perfil
                </MenuItem>
                <MenuItem
                  onClick={logout}
                  _hover={{ bg: "red.700" }}
                  color="red.300"
                >
                  Cerrar sesión
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <>
            <Button size="sm" colorScheme="yellow" onClick={() => navigate("/login")}>
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
              <Button as={RouterLink} to="/posts" variant="ghost" color="yellow.300">
                Noticias
              </Button>
              {user && (
                <>
                  <Button as={RouterLink} to="/articles" variant="ghost" color="yellow.300">
                    Artículos
                  </Button>
                  <Button as={RouterLink} to="/forum" variant="ghost" color="yellow.300">
                    Foros
                  </Button>
                  <Button as={RouterLink} to="/help" variant="ghost" color="yellow.300">
                    Ayuda
                  </Button>
                  <Button as={RouterLink} to="/events" variant="ghost" color="yellow.300">
                    Eventos
                  </Button>
                </>
              )}
              <Box pt={4} w="full">
                {user ? (
                  <Button w="full" variant="outline" colorScheme="red" onClick={logout}>
                    Cerrar sesión
                  </Button>
                ) : (
                  <>
                    <Button w="full" colorScheme="yellow" onClick={() => navigate("/login")}>
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
