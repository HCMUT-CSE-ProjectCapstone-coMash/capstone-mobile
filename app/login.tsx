import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 items-center justify-center bg-white">
                <TouchableOpacity 
                    className="px-4 py-2 bg-blue-500 rounded"
                    onPress={() => router.replace({ pathname: "/(tabs)" })}
                >
                    <Text className="text-white font-bold">Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}