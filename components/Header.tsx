import { Text, View } from "react-native";

export function Header() {

    return (
        <View style={{ height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F9FB' }}>
            <Text style={{ fontFamily: 'System', fontWeight: '800', fontSize: 30, color: '#ec4899' }}>
                co<Text style={{ color: '#8b5cf6' }}>Mash</Text>
            </Text>
        </View>
    )
}