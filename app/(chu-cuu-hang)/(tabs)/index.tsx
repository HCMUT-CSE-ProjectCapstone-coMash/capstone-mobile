import { FetchDashboardStats } from "@/api/saleOrders/saleOrders";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MenuGrid } from "@/components/MenuGrid";
import { TodayStats } from "@/components/TodayStats";
import { MenuItem } from "@/types/UITypes";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ownerItems: MenuItem[] = [
    { label: "Chụp hàng", icon: "camera-outline", color: "#D4537E", bg: "#FBEAF0", route: "/(chu-cuu-hang)/capture-product" },
    { label: "Nhập hàng", icon: "cube-outline", color: "#185FA5", bg: "#E6F1FB", route: "/(chu-cuu-hang)/import-product" },
    { label: "Danh sách chờ duyêt", icon: "checkmark-circle-outline", color: "#2E7D32", bg: "#E8F5E9", route: "/(chu-cuu-hang)/products-order" },
    { label: "Tìm sản phẩm", icon: "qr-code-outline", color: "#534AB7", bg: "#EEEDFE", route: "/(chu-cuu-hang)/search-product" },
];

export default function HomeScreen() {
    const { data, isLoading } = useQuery({
        queryKey: ["ownerDashboardStats"],
        queryFn: () => FetchDashboardStats(),
    })

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={["top"]} className="bg-white" />

            <DashboardHeader />

            <View className="flex-1 pt-4">
                <TodayStats data={data} isLoading={isLoading}/>

                <View className="px-4 mt-10">
                    <View className="flex-row items-center gap-2 mb-3">
                        <Ionicons name="grid-outline" size={15} color="#6b7280" />
                        <Text className="text-sm font-semibold text-gray-500">Chức năng</Text>
                    </View>
                    <MenuGrid items={ownerItems} />
                </View>
            </View>
        </View>
    );
}