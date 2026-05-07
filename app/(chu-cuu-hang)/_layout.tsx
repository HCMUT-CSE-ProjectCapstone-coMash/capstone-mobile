import { Stack } from "expo-router";

export default function Layout() {

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="(tabs)"
                options={{ 
                    title: "Trang chủ"
                }}
            />
            <Stack.Screen
                name="capture-product"
                options={{
                    title: "Chụp sản phẩm",
                }}
            />
            <Stack.Screen
                name="import-product"
                options={{
                    title: "Nhập hàng",
                }}
            />
        </Stack>
    )
}