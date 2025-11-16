import { User } from "@/interfaces/user";
import api from "../axios";

export type GoogleCredentialResponse = {
  clientId: string;
  credential: string;
  select_by: string;
};

export async function ContinueWithGoogle(payload: {
  id_token: string;
  device_name: string;
}): Promise<{ token: string; user: User }> {
  const response = await api.post("/continue-with-google", payload);
  return response.data;
}
