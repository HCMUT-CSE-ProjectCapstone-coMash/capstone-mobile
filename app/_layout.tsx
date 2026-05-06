import { GlobalAlert } from "@/components/Alert";
import { stores } from "@/stores/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import "../global.css";

export default function RootLayout() {
	const [queryClient] = useState(() => new QueryClient());

    return (
		<Provider store={stores}>
			<QueryClientProvider client={queryClient}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<SafeAreaProvider>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="index" />
							<Stack.Screen name="login" />
							<Stack.Screen name="change-password" />
							<Stack.Screen name="(nhan-vien)" />
							<Stack.Screen name="(chu-cuu-hang)" />
						</Stack>
						<GlobalAlert/>
					</SafeAreaProvider>
				</GestureHandlerRootView>
			</QueryClientProvider>
		</Provider>
    );
}
