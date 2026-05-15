import { Stack } from "expo-router";

export default function ProductsOrderLayout() {

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{
                    title: "Danh sách chờ duyệt",
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: "Chi tiết đơn nhập",
                }}
            />
        </Stack>
    )
}