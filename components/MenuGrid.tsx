import { MenuItem } from "@/types/UITypes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type MenuGridProps = {
    items: MenuItem[];
};

export function MenuGrid({ items }: MenuGridProps) {
    const router = useRouter();

    return (
        <FlatList
            data={items}
            keyExtractor={(item) => item.route}
            numColumns={4}
            scrollEnabled={false}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => router.push(item.route as any)}
                    className="items-center gap-2"
                    style={{ width: '25%' }}
                >
                    <View
                        className="w-16 h-16 rounded-2xl items-center justify-center"
                        style={{ backgroundColor: item.bg }}
                    >
                        <Ionicons name={item.icon} size={32} color={item.color} />
                    </View>
                    <Text className="text-[11px] text-center text-gray-600">
                        {item.label}
                    </Text>
                </TouchableOpacity>
            )}
        />
    );
}