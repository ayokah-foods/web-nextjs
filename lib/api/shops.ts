import api from "./axios";

export async function listShops(limit: number, offset: number, type: string) {
  const response = await api.get("/shops", {
    params: { limit, offset, type },
  });
  return response.data;
}

export async function listShopItems(
  slug: string,
  options?: {
    offset?: number;
    limit?: number;
    search?: string;
  }
) {
  const { offset = 0, limit = 20, search = "" } = options || {};
  const response = await api.get(`/shop/items/${slug}`, {
    params: {
      offset,
      limit,
      search,
    },
  });

  return response.data;
}
