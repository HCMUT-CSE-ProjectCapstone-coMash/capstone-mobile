import { Tabs } from "expo-router";

export default function TabsLayout() {

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Trang chủ",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Hồ sơ",
                }}
            />
        </Tabs>
    )
}