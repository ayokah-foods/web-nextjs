import Item from "@/interfaces/items";
import api from "./axios";
 
export interface CheckoutPayload {
  email: string;
  products: CheckoutProduct[];
  shipping_fee: number;
  shipping_carrier: string;
  estimated_delivery: string;
}


interface CheckoutProduct {
  id: number;
  quantity: number;
}


export const checkoutStripe = async (payload: CheckoutPayload) => {
  const res = await api.post("/session/checkout", {
    ...payload,
    device_name: navigator.userAgent,
  });
  return res.data;
};