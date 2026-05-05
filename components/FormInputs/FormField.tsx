import { Text, View } from "react-native";

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <View className="gap-1">
            <Text className="text-sm text-gray-500">{label}</Text>
            {children}
        </View>
    );
}