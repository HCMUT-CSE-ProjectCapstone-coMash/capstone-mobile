import { PendingListTable } from "@/components/Tables/PendingListTable/PendingListTable";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductsOrder() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white px-6">
            <SafeAreaView edges={["top"]} className="bg-white" />
            <View className="flex-row items-center gap-2 mt-4 mb-6">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold">Danh sách chờ duyệt</Text>
            </View>
            <PendingListTable/>
        </View>
    )
}