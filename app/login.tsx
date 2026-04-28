import { login as loginApi } from "@/api/authentication'/auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: () => {
      router.replace("/(tabs)");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Đăng nhập thất bại.");
    },
  });

  const handleLogin = (e: any) => {
    e?.preventDefault?.();
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

            <View className="flex-1 items-center justify-center">
                <View className="w-full bg-white gap-5 p-5">


                    <View className="items-center mb-8">
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
                        <View>
                            <Text className="text-sm text-tgray9 mb-2">Tên đăng nhập</Text>
                            <TextInput
                                placeholder="Điền tên đăng nhập"
                                placeholderTextColor="#808080"
                                value={username}
                                onChangeText={setUsername}
                                className="h-12 mt-1 px-3 py-2 border border-tgray5 rounded-lg text-tgray5"
                            />
                        </View>

                        <View>
                            <Text className="text-sm text-tgray9 mb-2">Mật khẩu</Text>
                            <TextInput
                                placeholder="Điền mật khẩu"
                                placeholderTextColor="#808080"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                className=" h-12 mt-1 px-3 py-2 border border-tgray5 rounded-lg text-tgray5"
                            />
                        </View>
                        
                        {error ? (
                        <View className="mb-2 p-2">
                            <Text className="text-red font-semibold text-sm text-center">{error}</Text>
                        </View>
                        ) : null}

                        <View className="items-center">
                            <TouchableOpacity
                                onPress={handleLogin}
                                disabled={loginMutation.isPending}
                                className="p-3 rounded-xl items-center bg-pink "
                            >
                                {loginMutation.isPending ? (
                                <ActivityIndicator color="white" />
                                ) : (
                                <Text className="text-white text-sm font-semibold">Đăng nhập</Text>
                                )}
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
