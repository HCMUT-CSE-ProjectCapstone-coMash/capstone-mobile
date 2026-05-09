import { RootState } from "@/stores/store";
import { getInitials } from "@/utilities/stringFormat";
import { formatVietnameseDate } from "@/utilities/timeFormat";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export function DashboardHeader() {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);

    return (
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
            <View>
                <Text className="text-sm text-gray-600">Xin chào,</Text>
                <Text className="text-xl font-semibold text-purple mt-0.5">
                    {user.fullName ?? "Nhân viên"}
                </Text>
                <View className="flex-row items-center gap-1 mt-1.5">
                    <Ionicons name="calendar-outline" size={12} color="#9ca3af" />
                    <Text className="text-sm text-gray-600">
                        {formatVietnameseDate(new Date())}
                    </Text>
                </View>
            </View>
            <TouchableOpacity 
                className="w-14 h-14 rounded-full items-center justify-center" 
                style={{ backgroundColor: "#EEEDFE" }}
                onPress={() => router.replace("/profile")}
            >
                <Text className="text-lg font-bold text-purple">
                    {user.fullName ? getInitials(user.fullName) : "?"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}