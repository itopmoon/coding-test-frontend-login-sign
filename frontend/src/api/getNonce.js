import { api } from "./api";

export const getNonce = (publicAddress) =>
  api.post("/token", { publicAddress }).then((res) => res.data);
