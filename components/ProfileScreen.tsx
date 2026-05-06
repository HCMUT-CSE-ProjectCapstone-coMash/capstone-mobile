import { Logout } from "@/api/authentication/auth";
import { clearEditingProduct } from "@/stores/productEditStore";
import { clearProductsOrder } from "@/stores/productsOrderStore";
import { RootState } from "@/stores/store";
import { clearUser } from "@/stores/userStore";
import { formatDate } from "@/utilities/timeFormat";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const roleLabel: Record<string, string> = {
    employee: "Nhân viên",
    owner: "Chủ cửa hàng",
};

export function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    const logoutMutation = useMutation({
        mutationFn: Logout,
        onSettled: async () => {
            await SecureStore.deleteItemAsync("accessToken");
            dispatch(clearUser());
            dispatch(clearEditingProduct());
            dispatch(clearProductsOrder());
            router.replace("/login");
        },
    });

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={["top"]} className="bg-white" />

            <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
                <View className="p-5 gap-6">
                    <View className="items-center py-6 gap-3">
                        {user?.imageURL ? (
                            <Image
                                source={{ uri: user.imageURL }}
                                className="w-24 h-24 rounded-full"
                            />
                        ) : (
                            <View className="w-24 h-24 rounded-full bg-pink items-center justify-center">
                                <Text className="text-white text-3xl font-bold">
                                    {user?.fullName?.charAt(0) ?? "?"}
                                </Text>
                            </View>
                        )}
                        <Text className="text-lg font-bold text-tgray9">{user.fullName}</Text>
                        <Text className="text-sm text-tgray5">{roleLabel[user?.role ?? ""]}</Text>
                    </View>

                    <View className="gap-4 px-2">
                        <InfoRow label="Mã nhân viên" value={user.employeeId} />
                        <InfoRow label="Email" value={user.email} />
                        <InfoRow label="Số điện thoại" value={user.phoneNumber} />
                        <InfoRow label="Giới tính" value={user.gender} />
                        <InfoRow label="Ngày sinh" value={formatDate(user?.dateOfBirth ?? "")} />
                    </View>
                </View>

                <View className="p-5">
                    <TouchableOpacity
                        onPress={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="p-3 rounded-xl items-center bg-pink"
                    >
                        <Text className="text-white text-sm font-semibold">
                            {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <View className="flex-row justify-between py-3 border-b border-tgray5">
            <Text className="text-sm text-tgray5">{label}</Text>
            <Text className="text-sm font-medium text-tgray9">{value ?? "—"}</Text>
        </View>
    );
}