import { axiosClient } from "../axiosClient";

export async function FetchOrCreateOrder(userId: string) {
    const response = await axiosClient.post(
        "products-orders/fetch/" + userId,
        {},
    );
    return response.data;
}