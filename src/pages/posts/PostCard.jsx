import {
  Box,
  Heading,
  Text,
  Image,
  HStack,
  Button,
  Badge,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaHeart, FaComment } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PostModalLogin from "./PostModalLogin";

export default function PostCard({ post }) {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLike = () => {
    if (!user) return onOpen();
    // TODO: Llamada al backend para registrar el like
  };

  const handleCommentClick = () => {
    if (!user) return onOpen();
    // TODO: Redirigir a detalle del post con foco en comentarios
  };

  return (
    <Box
      bg="whiteAlpha.100"
      borderRadius="lg"
      overflow="hidden"
      shadow="lg"
      _hover={{ shadow: "2xl", transform: "scale(1.02)", transition: "0.2s" }}
    >
      <Image
        src={post.image}
        alt={post.title}
        objectFit="cover"
        w="100%"
        h="180px"
      />

      <VStack align="start" spacing={2} p={4}>
        <Badge colorScheme="teal">{post.category?.name}</Badge>
        <Heading size="md" color="yellow.200">
          {post.title}
        </Heading>
        <Text color="whiteAlpha.800" noOfLines={3}>
          {post.content}
        </Text>

        <HStack spacing={4} pt={2}>
          <Button
            size="sm"
            colorScheme="pink"
            variant="ghost"
            leftIcon={<FaHeart />}
            onClick={handleLike}
          >
            {post.likes_count}
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            variant="ghost"
            leftIcon={<FaComment />}
            onClick={handleCommentClick}
          >
            {post.comments_count}
          </Button>
        </HStack>
      </VStack>

      <PostModalLogin isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
