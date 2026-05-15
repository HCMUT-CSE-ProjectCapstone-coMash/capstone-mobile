import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BarcodeScannerProps {
    onClose: () => void;
    onScanned: (data: string) => void;
    hintText?: string;
}

export function BarcodeScanner({ onClose, onScanned, hintText = "Đưa mã vào khung để tự động quét" }: BarcodeScannerProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        setScanned(false);
    }, []);

    const handleBarCodeScanned = (result: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        onScanned(result.data);
    };

    if (!permission) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator color="#ec4899" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-white justify-between py-12">
                <View className="items-center gap-3.5 px-8 mt-16">
                    <View className="w-20 h-20 rounded-full bg-pink-50 items-center justify-center">
                        <Ionicons name="camera-outline" size={36} color="#ec4899" />
                    </View>
                    <Text className="text-[17px] font-semibold text-gray-800">Cần quyền truy cập camera</Text>
                    <Text className="text-sm text-gray-500 text-center leading-5">
                        Cấp quyền để quét mã barcode trực tiếp trong ứng dụng.
                    </Text>
                </View>
                <View className="px-6 gap-2">
                    <TouchableOpacity className="bg-pink py-3.5 rounded-2xl items-center" onPress={requestPermission}>
                        <Text className="text-white font-semibold text-[15px]">Cấp quyền</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-3 items-center" onPress={onClose}>
                        <Text className="text-gray-400 text-[15px]">Huỷ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
            <TouchableOpacity
                onPress={onClose}
                className="self-start flex-row items-center gap-1.5 bg-gray-100 px-5 py-2 rounded-full"
            >
                <Ionicons name="chevron-back" size={16} color="#6b7280" />
                <Text className="text-gray-500 text-sm font-medium">Quay lại</Text>
            </TouchableOpacity>

            <View className="mt-4 items-center px-4">
                <Text className="text-gray-500 text-sm text-center">{hintText}</Text>
            </View>

            <View className="items-center mx-4 mt-6 overflow-hidden rounded-3xl border border-pink/20">
                <CameraView
                    style={{ width: "100%", height: 220 }}
                    facing="back"
                    onBarcodeScanned={handleBarCodeScanned}
                />
            </View>

            <View className="items-center justify-center gap-3 px-6 py-8">
                {scanned ? (
                    <View className="rounded-2xl bg-pink/10 px-4 py-3">
                        <Text className="text-sm font-medium text-pink">Mã đã quét, đang xử lý...</Text>
                    </View>
                ) : (
                    <View className="rounded-2xl bg-gray-50 px-4 py-3">
                        <Text className="text-sm text-gray-600">Tự động quét khi mã xuất hiện trong khung.</Text>
                    </View>
                )}
            </View>
        </View>
    );
}
