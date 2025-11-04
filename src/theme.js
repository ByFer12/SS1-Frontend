import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bgGradient: "linear(to-br, gray.900, teal.800)",
        color: "white",
      },
    },
  },
  colors: {
    brand: {
      primary: "#0d9488", // teal.600 personalizado
      accent: "#facc15",  // amarillo cálido
      dark: "#111827",    // gris oscuro base
    },
  },
  fonts: {
    heading: "'Orbitron', sans-serif",
    body: "'Poppins', sans-serif",
  },
});

export default theme;
    