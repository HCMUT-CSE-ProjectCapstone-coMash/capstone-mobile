import { stores } from "@/stores/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import "../global.css";

export default function RootLayout() {
	const queryClient = new QueryClient();

    return (
		<Provider store={stores}>
			<QueryClientProvider client={queryClient}>
				<SafeAreaProvider>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="index" />
						<Stack.Screen name="login" />
						<Stack.Screen name="change-password" />
						<Stack.Screen name="(nhan-vien)" />
						<Stack.Screen name="(chu-cuu-hang)" />
					</Stack>
				</SafeAreaProvider>
			</QueryClientProvider>
		</Provider>
    );
}
