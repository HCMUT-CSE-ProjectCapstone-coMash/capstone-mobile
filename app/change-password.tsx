import { ChangePassword } from "@/api/authentication/auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RootState } from "@/stores/store";
import { setUser } from "@/stores/userStore";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function ChangePasswordScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const changePasswordMutation = useMutation({
        mutationFn: ({ userId, newPassword } : { newPassword: string, userId: string}) => ChangePassword(userId, newPassword),

        onSuccess: () => {
            dispatch(setUser({ ...user, hasChangedPassword: true }));
            
            if (user.role === "employee") {
                router.replace("/(nhan-vien)");
            } else if (user.role === "owner") {
                router.replace("/(chu-cuu-hang)");
            }
        },

        onError: (err: any) => {
            setError(err.response?.data?.message || "Đổi mật khẩu thất bại.");
        },
    });

    const handleChangePassword = () => {
        setError("");

        if (!user.id) return;

        if (!newPassword) {
            setError("Vui lòng nhập mật khẩu mới.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        changePasswordMutation.mutate({ userId: user.id, newPassword });
    };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={["top"]} className="bg-gwhite" />

            <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
                <Header />

                <View className="flex-1 items-center">
                    <View className="w-full bg-white gap-5 p-5">
                        <View className="items-center mb-8 py-5">
                            <Image
                                source={require("@/public/assets/image/loginImg.png")}
                                className="w-1/2 h-[131px]"
                                resizeMode="cover"
                            />
                        </View>

                        <Text className="text-center font-semibold text-purple text-lg">
                            ĐỔI MẬT KHẨU
                        </Text>

                        <View className="gap-5">
                            <View className="px-5">
                                <Text className="text-sm text-tgray9 mb-2">Mật khẩu mới</Text>
                                <TextInput
                                    placeholder="Điền mật khẩu mới"
                                    placeholderTextColor="#808080"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                    className="h-12 mt-1 px-3 py-2 border border-tgray5 rounded-lg text-tgray5 text-xs"
                                />
                            </View>

                            <View className="px-5">
                                <Text className="text-sm text-tgray9 mb-2">Xác nhận mật khẩu mới</Text>
                                <TextInput
                                    placeholder="Điền lại mật khẩu mới"
                                    placeholderTextColor="#808080"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    className="h-12 mt-1 px-3 py-2 border border-tgray5 rounded-lg text-tgray5 text-xs"
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
                                    onPress={handleChangePassword}
                                    disabled={changePasswordMutation.isPending}
                                    className="p-3 rounded-xl items-center bg-pink"
                                >
                                    {changePasswordMutation.isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white text-sm font-semibold">
                                            Xác nhận
                                        </Text>
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