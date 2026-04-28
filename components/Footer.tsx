import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function Footer() {

  return (
    <View className="bg-pink flex-row items-center px-6 py-3">
      <Ionicons name="call-outline" size={18} color="white" />

      <Text className="text-white text-sm ml-2">
        Liên hệ hỗ trợ
      </Text>

      <Text className="text-white text-sm font ml-1">
        (090 - 181 - 1306)
      </Text>
    </View>
  );
}