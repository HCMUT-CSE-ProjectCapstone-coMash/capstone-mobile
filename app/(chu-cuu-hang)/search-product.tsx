import { FetchProductByProductId } from "@/api/products/products";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { SearchProductForm } from "@/components/Forms/SearchProductForm";
import { useDebounce } from "@/hooks/useDebounce";
import { addAlert } from "@/stores/alertStore";
import { Product } from "@/types/Product";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

function parseProductIdFromBarcode(barcode: string) {
    const cleaned = barcode.trim();
    if (!cleaned) return "";
    const parts = cleaned.split("-");
    if (parts.length <= 1) return cleaned;
    const lastPart = parts[parts.length - 1];
    if (lastPart.length === 1 && /^[A-Z]$/i.test(lastPart)) {
        return parts.slice(0, -1).join("-");
    }
    return cleaned;
}

export default function SearchProductScreen() {
    const router = useRouter();
    const dispatch = useDispatch();

    const [showScanner, setShowScanner] = useState(true);
    const [barcodeText, setBarcodeText] = useState("");
    const [product, setProduct] = useState<Product | null>(null);

    const debouncedBarcodeText = useDebounce(barcodeText, 400);

    const lastFetchedProductId = useRef("");
    const hasScanned = useRef(false);

    const fetchProductMutation = useMutation({
        mutationFn: (productId: string) =>
            FetchProductByProductId(productId),

        onSuccess: (data) => {
            setProduct(data);
        },

        onError: () => {
            setProduct(null);

            dispatch(
                addAlert({
                    type: "error",
                    message: "Không tìm thấy sản phẩm.",
                })
            );
        },
    });

    const handleSearch = (rawBarcode?: string) => {
        const code = rawBarcode ?? barcodeText;
        const productId = parseProductIdFromBarcode(code);
        if (!productId) {
            dispatch(
                addAlert({
                    type: "warning",
                    message: "Vui lòng nhập mã barcode hợp lệ.",
                })
            );

            return;
        }

        setBarcodeText(code);
        lastFetchedProductId.current = productId;
        fetchProductMutation.mutate(productId);
    };

    const handleScannerScanned = (data: string) => {
        if (hasScanned.current) return;
        hasScanned.current = true;
        setProduct(null);

        const cleaned = data.trim().toUpperCase();
        setBarcodeText(cleaned);
        setShowScanner(false);
        lastFetchedProductId.current = "";
        handleSearch(cleaned);
    };

    useEffect(() => {
        const trimmed = debouncedBarcodeText.trim();
        if (!trimmed) return;
        const productId = parseProductIdFromBarcode(trimmed);
        if (
            !productId ||
            productId === lastFetchedProductId.current
        ) {
            return;
        }

        lastFetchedProductId.current = productId;
        fetchProductMutation.mutate(productId);
    }, [debouncedBarcodeText]);

    const handleRescan = () => {
        hasScanned.current = false;
        setProduct(null);
        setBarcodeText("");

        fetchProductMutation.reset();
        lastFetchedProductId.current = "";
        setShowScanner(true);
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <SafeAreaView edges={["top"]} className="bg-white" />

            <View className="flex-row items-center justify-between mt-4 mb-6 px-4">
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color="#111827"
                        />
                    </TouchableOpacity>

                    <Text className="text-xl font-semibold">
                        Tìm sản phẩm
                    </Text>
                </View>

                <TouchableOpacity onPress={handleRescan}>
                    <Ionicons
                        name="scan-outline"
                        size={24}
                        color="#ec4899"
                    />
                </TouchableOpacity>
            </View>

            <View className="flex-1 bg-white px-4 py-4">
                <Modal
                    visible={showScanner}
                    animationType="slide"
                    onRequestClose={() => setShowScanner(false)}
                >
                    <SafeAreaView
                        edges={["top"]}
                        className="bg-white"
                    />

                    <View className="flex-1 bg-white px-4 py-4">
                        <BarcodeScanner
                            key={String(showScanner)}
                            onClose={() => setShowScanner(false)}
                            onScanned={handleScannerScanned}
                            hintText="Đưa mã vào khung để tự động quét"
                        />
                    </View>
                </Modal>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 28 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="gap-4">
                        {fetchProductMutation.isPending ? (
                            <Text className="text-center text-gray-500 mt-10">
                                Đang tải sản phẩm...
                            </Text>
                        ) : (
                            product && (
                                <SearchProductForm product={product} />
                            )
                        )}
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}