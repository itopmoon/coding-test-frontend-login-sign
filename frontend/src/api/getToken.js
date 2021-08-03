import { config } from "../config";
import { api } from "./api";

export const getToken = (publicAddress, signature) =>
  api
    .post(`${config.backendUrl}/auth`, {
      publicAddress,
      signature,
    })
    .then((res) => res.data);
