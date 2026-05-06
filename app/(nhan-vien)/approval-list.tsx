import { FetchOrCreateOrder } from "@/api/productsOrder/productsOrder";
import { setProductsOrder } from "@/stores/productsOrderStore";
import { RootState } from "@/stores/store";
import { Product } from "@/types/Product";
import { ProductsOrder } from "@/types/productsOrder";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

function QuantityInfo({ product }: { product: Product }) {
    if (product.quantityChanges && product.quantityChanges.length > 0) {
        return (
            <View className="gap-1 mt-1">
                {product.quantityChanges.map((change) => (
                    <View key={change.size} className="flex-row items-center gap-2">
                        <Text className="text-xs font-medium text-gray-600">{change.size}:</Text>
                        <Text className="text-xs text-red line-through">{change.oldQuantity}</Text>
                        <Text className="text-xs text-gray-400">→</Text>
                        <Text className="text-xs text-purple font-bold">{change.newQuantity}</Text>
                    </View>
                ))}
            </View>
        );
    }

    return (
        <View className="gap-1 mt-1">
            {product.quantities.map((q) => (
                <View key={q.size} className="flex-row items-center gap-2">
                    <Text className="text-xs font-medium text-gray-600">{q.size}:</Text>
                    <Text className="text-xs text-purple font-bold">{q.quantities}</Text>
                </View>
            ))}
        </View>
    );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <View className="flex-row items-center bg-white border border-gray-100 rounded-xl px-4 py-3 mb-3 shadow-sm">
            <Image
                source={{ uri: product.imageURL }}
                className="w-16 h-16 rounded-lg bg-gray-100"
                resizeMode="cover"
            />
            <View className="flex-1 ml-3">
                <Text className="text-xs text-gray-400 mb-0.5">{product.productId}</Text>
                <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
                    {product.productName}
                </Text>
                <QuantityInfo product={product} />
            </View>
        </View>
    );
}

export default function PendingApprovalScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const productsOrder = useSelector((state: RootState) => state.productsOrder.productsOrder);

    const { data, isLoading } = useQuery({
        queryKey: ["pendingProducts"],
        queryFn: () => FetchOrCreateOrder(user.id!),
        enabled: !!user.id,
    });

    useEffect(() => {
        if (data) {
            const order: ProductsOrder = {
                id: data.id,
                createdBy: data.createdBy,
                createdAt: data.createdAt,
                orderName: data.orderName,
                orderDescription: data.orderDescription,
                orderStatus: data.orderStatus,
                products: data.products,
            };
            dispatch(setProductsOrder(order));
        }
    }, [data, dispatch]);

    const products = productsOrder?.products ?? [];

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "white" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <SafeAreaView edges={["top"]} style={{ backgroundColor: "white" }} />
            <View className="flex-1 px-6">
                {/* Header */}
                <View className="flex-row items-center gap-2 mt-4 mb-6">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold">Danh sách duyệt</Text>
                </View>

                {/* List */}
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-gray-400">Đang tải...</Text>
                    </View>
                ) : products.length === 0 ? (
                    <View className="flex-1 items-center justify-center gap-2">
                        <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
                        <Text className="text-gray-400">Chưa có sản phẩm nào</Text>
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <ProductCard product={item} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}

                {/* Submit button */}
                {!isLoading && (
                <TouchableOpacity
                    disabled={products.length === 0}
                    className="bg-purple rounded-xl py-3 mb-12 items-center disabled:opacity-50"
                >
                    <Text className="text-white font-semibold text-sm">Yêu cầu duyệt</Text>
                </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}