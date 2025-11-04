import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export function useCurrentUser() {
  return useQuery(["me"], async () => {
    const { data } = await api.get("/auth/me"); // endpoint que devuelve user si cookie válida
    return data;
  }, { retry: false, refetchOnWindowFocus: false });
}
