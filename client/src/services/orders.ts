import api from "./api";
import type { Order, OrderStatus, ShippingAddress } from "../types/types";

export const orderService = {
  create: (shippingAddress: ShippingAddress) =>
    api.post<{ order: Order }>("/orders", { shippingAddress }),
  mine: () => api.get<{ orders: Order[] }>("/orders/my-orders"),
  all: () => api.get<{ orders: Order[] }>("/orders"),
  updateStatus: (id: string, status: OrderStatus) =>
    api.patch<{ order: Order }>(`/orders/${id}/status`, { status }),
};
