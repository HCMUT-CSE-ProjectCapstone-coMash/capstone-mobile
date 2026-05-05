import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ImportProductScreen() {
    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={["top"]} className="bg-white" />
            <Text>Import Screen</Text>
        </View>
    )
}