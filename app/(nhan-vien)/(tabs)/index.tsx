import { FetchEmployeeDashboardStats } from "@/api/saleOrders/saleOrders";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MenuGrid } from "@/components/MenuGrid";
import { TodayStats } from "@/components/TodayStats";
import { RootState } from "@/stores/store";
import { MenuItem } from "@/types/UITypes";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const employeeItems: MenuItem[] = [
    { label: "Chụp hàng", icon: "camera-outline", color: "#D4537E", bg: "#FBEAF0", route: "/(nhan-vien)/capture-product" },
    { label: "Nhập hàng", icon: "cube-outline", color: "#185FA5", bg: "#E6F1FB", route: "/(nhan-vien)/import-product" },
    { label: "Danh sách duyệt", icon: "checkmark-circle-outline", color: "#2E7D32", bg: "#E8F5E9", route: "/(nhan-vien)/approval-list" },
];

export default function HomeScreen() {
    const user = useSelector((state: RootState) => state.user);

    const { data, isLoading } = useQuery({
        queryKey: ["employeeDashboardStats"],
        queryFn: () => FetchEmployeeDashboardStats(user.id!),
        enabled: !!user.id,
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
                    <MenuGrid items={employeeItems} />
                </View>
            </View>
        </View>
    );
}