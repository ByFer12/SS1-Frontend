import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function PostModalLogin({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader textAlign="center" color="yellow.300">
          Inicia sesión para continuar
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="center">
            <Text>
              Debes iniciar sesión o registrarte para poder interactuar con los
              posts (likes, comentarios, etc.).
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Button
            colorScheme="teal"
            mr={3}
            onClick={() => {
              onClose();
              navigate("/login");
            }}
          >
            Iniciar sesión
          </Button>
          <Button
            variant="outline"
            colorScheme="yellow"
            onClick={() => {
              onClose();
              navigate("/register");
            }}
          >
            Registrarse
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
