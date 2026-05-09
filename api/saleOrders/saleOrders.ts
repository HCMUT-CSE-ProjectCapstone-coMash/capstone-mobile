import { axiosClient } from "../axiosClient";

export async function FetchDashboardStats() {
    const response = await axiosClient.get(
        `/sale-orders/dashboard-stats`,
        { withCredentials: true }
    );

    return response.data;
}

export async function FetchEmployeeDashboardStats(employeeId: string) {
    const response = await axiosClient.get(
        `/sale-orders/dashboard-stats/employee/${employeeId}`,
        { withCredentials: true }
    );

    return response.data;   
}