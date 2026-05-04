import { MenuGrid } from "@/components/MenuGrid";
import { MenuItem } from "@/types/UITypes";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ownerItems: MenuItem[] = [
    { label: "Nhập hàng", icon: "cube-outline", color: "#185FA5", bg: "#E6F1FB", route: "/(chu-cuu-hang)/import-product" },
    { label: "Chụp hàng", icon: "camera-outline", color: "#D4537E", bg: "#FBEAF0", route: "/(chu-cuu-hang)/capture-product" },
    { label: "Nhân viên", icon: "people-outline", color: "#534AB7", bg: "#EEEDFE", route: "/(chu-cuu-hang)/employee" },
    { label: "Đơn hàng", icon: "receipt-outline", color: "#B45309", bg: "#FEF3C7", route: "/(chu-cuu-hang)/sale-order" },
];

export default function HomeScreen() {

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={["top"]} className="bg-white" />
            <SafeAreaView edges={["left", "right"]} className="p-8">
                <MenuGrid items={ownerItems} />
            </SafeAreaView>
        </View>
    );
}