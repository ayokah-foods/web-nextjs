import api from "../axios";

export async function ContinueWithGoogle(payload: {
  id_token: string;
  device_name: string;
}): Promise<{ token: string; user: any }> {
  const response = await api.post("/continue-with-google", payload);
  return response.data;
}
