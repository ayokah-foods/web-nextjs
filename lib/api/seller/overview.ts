import api from "../axios";

export async function getOverview(range: string) {
  const { data } = await api.get(`/vendor/order/statistics?range=${range}`);
  return data.data;
}
