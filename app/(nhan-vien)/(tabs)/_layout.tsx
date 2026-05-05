import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const PRIMARY = "#6420AA";
const INACTIVE = "#9B8AB8";

export default function TabsLayout() {
    
    return (
        <Tabs 
            screenOptions={{ 
                headerShown: false,
                tabBarActiveTintColor: PRIMARY,
                tabBarInactiveTintColor: INACTIVE,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Trang chủ",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Hồ sơ",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color}/>
                    ),
                }}
            />
        </Tabs>
    );
}