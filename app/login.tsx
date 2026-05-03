import { Login } from "@/api/authentication/auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { setUser } from "@/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

export default function LoginScreen() {
	const router = useRouter();

	const dispatch = useDispatch();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const loginMutation = useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => Login(email, password),

		onSuccess: (data) => {
			dispatch(setUser(data));
			
			if (data.hasChangedPassword) {
				if (data.role === "employee") {
					router.replace("/(nhan-vien)");
				} else if (data.role === "owner") {
					router.replace("/(chu-cuu-hang)");
				}
			} else {
				router.replace("/change-password");
			}
		},

		onError: (err: any) => {
			setError(err.response?.data?.message || "Đăng nhập thất bại.");
		},
	});

	const handleLogin = () => {
		setError("");

		if (!username && !password) {
			setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
			return;
		}

		if (!username) {
			setError("Vui lòng nhập tên đăng nhập.");
			return;
		}

		if (!password) {
			setError("Vui lòng nhập mật khẩu.");
			return;
		}

		loginMutation.mutate({ email: username, password });
	};

  	return (
		<View className="flex-1 bg-white">
			<SafeAreaView edges={["top"]} className="bg-gwhite" />

			<SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
				<Header />

				<View className="flex-1 items-center ">
					<View className="w-full bg-white gap-5 p-5">
						<View className="items-center mb-8 py-5">
						<Image
							source={require("@/public/assets/image/loginImg.png")}
							className="w-1/2 h-[131px]"
							resizeMode="cover"
						/>
						</View>

						<Text className="text-center font-semibold text-purple text-lg">
							ĐĂNG NHẬP
						</Text>

						<View className="gap-5">
							<View className="px-5">
								<Text className="text-sm text-tgray9 mb-2">Tên đăng nhập</Text>
								<TextInput
									placeholder="Điền tên đăng nhập"
									placeholderTextColor="#808080"
									value={username}
									onChangeText={setUsername}
									className="h-12 mt-1 px-3 py-2 border border-tgray5 rounded-lg text-tgray5 text-xs"
								/>
							</View>

							<View className="px-5">
								<Text className="text-sm text-tgray9 mb-2">Mật khẩu</Text>
								<TextInput
									placeholder="Điền mật khẩu"
									placeholderTextColor="#808080"
									value={password}
									onChangeText={setPassword}
									secureTextEntry
									className=" h-12 mt-1 px-3 py-2 border border-tgray5 rounded-lg text-tgray5 text-xs"
								/>
							</View>

							{error && (
								<View className="mb-2 p-2">
									<Text className="text-red font-semibold text-sm text-center">
										{error}
									</Text>
								</View>
							)}

							<View className="items-center">
								<TouchableOpacity
									onPress={handleLogin}
									disabled={loginMutation.isPending}
									className="p-3 rounded-xl items-center bg-pink "
								>
									<Text className="text-white text-sm font-semibold">
										{loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>

				<Footer />
			</SafeAreaView>

			<SafeAreaView edges={["bottom"]} className="bg-pink" />
		</View>
	);
}
