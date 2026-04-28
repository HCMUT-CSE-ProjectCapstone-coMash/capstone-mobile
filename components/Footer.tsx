import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function Footer() {

    return (
        <View style={{ backgroundColor: '#ec4899', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 40, paddingVertical: 10 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <Ionicons name="call-outline" size={18} color="white" />
                <Text style={{ fontFamily: 'System', fontSize: 14, color: 'white' }}>Liên hệ hỗ trợ</Text>
                <Text style={{ fontFamily: 'System', fontSize: 14, color: 'white' }}>(090 - 181 - 1306)</Text>
            </View>
        </View>
    )
}