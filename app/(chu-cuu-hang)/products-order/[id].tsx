import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SaleOrderDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    return (
        <View className="flex-1 bg-white px-6">
            <SafeAreaView edges={["top"]} className="bg-white" />
            <View className="flex-row items-center gap-2 mt-4 mb-6">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold">Chi tiết đơn nhập</Text>
            </View>
            {/* dùng id để fetch data */}
        </View>
    );
}