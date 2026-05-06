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

export async function GetProductsOrderById(orderId: string) {
    const response = await axiosClient.get(
        `products-orders/${orderId}`,
    );
    
    return response.data;
}