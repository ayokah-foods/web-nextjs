import api from "../axios";

export async function saveShop(formData: FormData) {
  const response = await api.post("/vendor/shop/save", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function updateShopLogo(shopId: number, file: File) {
  const formData = new FormData();
  formData.append("shop_id", String(shopId));
  formData.append("logo", file);

  const response = await api.post(`/vendor/shop/logo/update/${shopId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function updateShopBanner(shopId: number, file: File) {
  const formData = new FormData();
  formData.append("shop_id", String(shopId));
  formData.append("banner", file);

  const response = await api.post(`/vendor/shop/banner/update/${shopId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}
