import { UpdateProductsOrder } from "@/types/productsOrder";
import { axiosClient } from "../axiosClient";

export async function FetchOrCreateOrder(userId: string) {
    const response = await axiosClient.post(
        "products-orders/fetch/" + userId,
        {},
    );
    return response.data;
}

export async function DeleteProductFromProductsOrders(orderId: string, productId: string) {
    const response = await axiosClient.delete(
        "products-orders/delete/" + orderId + "/" + productId,
    );

    return response.data;
}

export async function PatchOrderAndStatus(orderId: string, updateData: UpdateProductsOrder) {
    const formData = new FormData();
    
    if (updateData.orderName) formData.append("OrderName", updateData.orderName);
    if (updateData.orderDescription) formData.append("OrderDescription", updateData.orderDescription);
    if (updateData.orderStatus) formData.append("OrderStatus", updateData.orderStatus);

    const response = await axiosClient.patch(
        "products-orders/patch/" + orderId,
        formData,
    );
    
    return response.data;
}

export async function GetProductsOrdersExcludingPending(currentPage: number, pageSize: number, search?: string) {
    const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
    });

    if (search) params.append("search", search);

    const response = await axiosClient.get(
        `products-orders/fetch-excluding-pending?${params}`, 
    );
    
    return response.data;
}

export async function GetProductsOrderById(orderId: string) {
    const response = await axiosClient.get(
        `products-orders/${orderId}`,
    );
    
    return response.data;
}