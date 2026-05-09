import { ProductsOrderWithCreator } from "@/types/productsOrder";
import { formatDate } from "@/utilities/timeFormat";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const STATUS_MAP = {
    Approved: { label: "Đã duyệt",  bg: "#EAF3DE", color: "#3B6D11" },
    Sending:  { label: "Chờ duyệt", bg: "#E6F1FB", color: "#0C447C" },
};

const DEFAULT_STATUS = { label: "Chờ duyệt", bg: "#FAEEDA", color: "#633806" };

export function OrderCard({ item }: { item: ProductsOrderWithCreator }) {
    const router = useRouter();

    const status = STATUS_MAP[item.orderStatus as keyof typeof STATUS_MAP] ?? DEFAULT_STATUS;

    return (
        <View className="bg-white border border-gray-200 rounded-2xl p-4 gap-3">
            {/* Top row */}
            <View className="flex-row items-start justify-between gap-2">
                <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900">{item.orderName}</Text>
                    {item.orderDescription && (
                        <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>
                            {item.orderDescription}
                        </Text>
                    )}
                </View>
                <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: status.bg }}>
                    <Text className="text-xs font-medium" style={{ color: status.color }}>
                        {status.label}
                    </Text>
                </View>
            </View>

            {/* Bottom row */}
            <View className="h-px bg-gray-100" />
            <View className="flex-row items-center justify-between">
                <View>
                    <View className="flex-row items-center gap-1">
                        <Text className="text-xs text-gray-400">Tạo bởi:</Text>
                        <Text className="text-xs font-medium text-gray-700">{item.createdByName}</Text>
                    </View>
                    <Text className="text-xs text-gray-400 mt-0.5">{formatDate(item.createdAt)}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.push(`/(chu-cuu-hang)/products-order/${item.id}`)}
                    className="flex-row items-center gap-1 px-3 py-1.5 rounded-lg border border-purple"
                >
                    <Text className="text-xs font-medium text-purple">Xem</Text>
                    <Ionicons name="chevron-forward" size={12} color="#6420AA" />
                </TouchableOpacity>
            </View>
        </View>
    );
}