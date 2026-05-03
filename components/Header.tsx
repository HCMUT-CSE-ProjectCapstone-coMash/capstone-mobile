import { Text, View } from "react-native";

export function Header() {
	return (
		<View className="h-[52px] flex-row items-center justify-center bg-gwhite">
			<Text className="text-[30px] font-bold text-pink">
				co<Text className="text-purple">Mash</Text>
			</Text>
		</View>
	);
}