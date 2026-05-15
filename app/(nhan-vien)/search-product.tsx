import { FetchProductByProductId } from "@/api/products/products";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { SearchProductForm } from "@/components/Forms/SearchProductForm";
import { addAlert } from "@/stores/alertStore";
import { Product } from "@/types/Product";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

function parseProductIdFromBarcode(barcode: string) {
    const cleaned = barcode.trim();
    if (!cleaned) return "";
    const parts = cleaned.split("-");
    if (parts.length <= 1) return cleaned;
    return parts.slice(0, -1).join("-");
}

export default function SearchProductScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [showScanner, setShowScanner] = useState(true);
    const [barcodeText, setBarcodeText] = useState("");
    const [product, setProduct] = useState<Product | null>(null);

    const fetchProductMutation = useMutation({
        mutationFn: (productId: string) => FetchProductByProductId(productId),
        onSuccess: (data) => {
            setProduct(data);
        },
        onError: () => {
            setProduct(null);
            dispatch(addAlert({ type: "error", message: "Không tìm thấy sản phẩm." }));
        },
    });

    const handleSearch = (rawBarcode?: string) => {
        const code = rawBarcode ?? barcodeText;
        const productId = parseProductIdFromBarcode(code);
        if (!productId) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng nhập mã barcode hợp lệ." }));
            return;
        }

        setBarcodeText(code);
        fetchProductMutation.mutate(productId);
    };

    const handleScannerScanned = (data: string) => {
        const cleaned = data.trim();
        setBarcodeText(cleaned);
        setShowScanner(false);
        handleSearch(cleaned);
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <SafeAreaView edges={["top"]} className="bg-white" />
            <View className="flex-row items-center gap-2 mt-4 mb-6 px-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold">Tìm sản phẩm</Text>
            </View>
            <View className="flex-1 bg-white px-4 py-4">
                <Modal visible={showScanner} animationType="slide" onRequestClose={() => setShowScanner(false)}>
                    <BarcodeScanner
                        key={String(showScanner)}
                        onClose={() => setShowScanner(false)}
                        onScanned={handleScannerScanned}
                        hintText="Đưa mã vào khung để tự động quét"
                    />
                </Modal>

                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 28 }}>
                    <View className="gap-4">
                        <TouchableOpacity
                            className="rounded-2xl border border-pink bg-white py-3 items-center"
                            onPress={() => setShowScanner(true)}
                        >
                            <Text className="text-pink font-semibold">Quét mã barcode</Text>
                        </TouchableOpacity>

                        {product && <SearchProductForm product={product} />}
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}
