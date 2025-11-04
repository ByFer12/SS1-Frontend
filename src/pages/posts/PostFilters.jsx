import { HStack, Select } from "@chakra-ui/react";

export default function PostFilters({ filter, setFilter }) {
  return (
    <HStack spacing={4}>
      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        maxW="300px"
      >
        <option value="recent">Más recientes</option>
        <option value="likes">Más populares</option>
        <option value="comments">Más comentados</option>
        <option value="author">Por periodista</option>
      </Select>
    </HStack>
  );
}
