import { login as loginApi } from "@/api/authentication'/auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

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
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    },
  });

  const handleLogin = (e: any) => {
    e?.preventDefault?.();
    setError("");
    loginMutation.mutate({ email: username, password });
  };

  return (
    <View className="flex-1 flex-col bg-white">
      <Header />
      
      <View className="flex-1 items-center justify-center">
        <View className="w-full max-w-80 bg-white rounded-2xl">


          <View className="items-center mb-8">
            <Image
              source={require("@/public/assets/image/loginImg.png")}
              className="w-1/2 h-[131px]"
              resizeMode="cover"
            />
          </View>

          <Text className="text-center font-semibold text-purple text-lg mb-4">
            ĐĂNG NHẬP
          </Text>

          {error ? (
            <View className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <Text className="text-red-600 text-sm text-center">{error}</Text>
            </View>
          ) : null}

          <View className="gap-3">
            <View>
              <Text className="text-sm text-tgray9">Tên đăng nhập</Text>
              <TextInput
                placeholder="Điền tên đăng nhập"
                placeholderTextColor="#808080"
                value={username}
                onChangeText={setUsername}
                className="mt-1 px-3 py-2 border border-gray-500 rounded-lg text-tgray9"
              />
            </View>

            <View>
              <Text className="text-sm text-tgray9">Mật khẩu</Text>
              <TextInput
                placeholder="Điền mật khẩu"
                placeholderTextColor="#808080"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="mt-1 px-3 py-2 border border-gray-500 rounded-lg text-tgray9"
              />
            </View>

            <View className="items-center">
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loginMutation.isPending}
                className="px-5 py-2 rounded-lg items-center bg-pink"
              >
                {loginMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Đăng nhập</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <Footer />
    </View>
  );
}
