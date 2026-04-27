import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";


export default function RootLayout() {
	const queryClient = new QueryClient();

    return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaProvider>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="index" />
					<Stack.Screen name="login" />
					<Stack.Screen name="(tabs)" />
				</Stack>
			</SafeAreaProvider>
		</QueryClientProvider>
    );
}
