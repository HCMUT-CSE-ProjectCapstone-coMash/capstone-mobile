import { MenuGrid } from "@/components/MenuGrid";
import { MenuItem } from "@/types/UITypes";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const employeeItems: MenuItem[] = [
    { label: "Chụp hàng", icon: "camera-outline", color: "#D4537E", bg: "#FBEAF0", route: "/(nhan-vien)/capture-product" },
    { label: "Nhập hàng", icon: "cube-outline", color: "#185FA5", bg: "#E6F1FB", route: "/(nhan-vien)/import-product" },
];

export default function HomeScreen() {
    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={["top"]} className="bg-white" />
            <SafeAreaView edges={["left", "right"]} className="p-10">
                <MenuGrid items={employeeItems} />
            </SafeAreaView>
        </View>
    );
}