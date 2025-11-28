import api from "./axios";

export async function listShops(limit: number, offset: number, type:string) {
  const response = await api.get("/shops", {
    params: { limit, offset, type },
  });
  return response.data;
}

export async function getShopDetail(orderId: string) {
  const response = await api.get(`/shops/${orderId}`);
  return response.data;
}
