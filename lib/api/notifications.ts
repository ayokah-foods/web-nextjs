import api from "./axios";
import {
  InitialSettings,
  NotificationPayload,
  SaveResponse,
} from "@/interfaces/notification";

export async function getCommunicationSettings(): Promise<InitialSettings> {
  const response = await api.get(`/communication-preferences`);
  return response.data.data;
}

export async function saveCommunicationSettings(payload: NotificationPayload) {
  const response = await api.post(`/communication/create`, payload);
  return response.data;
}
