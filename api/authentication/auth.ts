import * as SecureStore from "expo-secure-store";
import { axiosClient } from "../axiosClient";

// Đăng nhập người dùng
export async function Login(email: string, password: string) {
    const response = await axiosClient.post(
        "/auth/mobile/login", 
        { email, password }
    );

    const { accessToken, ...userData } = response.data;

    await SecureStore.setItemAsync("accessToken", accessToken);

    return userData;
}

// Đổi mật khẩu người dùng
export async function ChangePassword(userId: string, newPassword: string) {
    const response = await axiosClient.post(
        "/auth/mobile/change-password",
        { userId, newPassword },
    );

    return response.data;
}

// Lấy thông tin người dùng hiện tại
export async function Profile() {
    const response = await axiosClient.get(
        "/auth/profile"
    );

    return response.data;
}

// Đăng xuất người dùng
export async function Logout() {
    const response = await axiosClient.post(
        "/auth/logout",
        {}
    );

    return response.data;
}