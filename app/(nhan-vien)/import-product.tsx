import { FetchOrCreateOrder } from "@/api/productsOrder/productsOrder";
import { ImportProductForm } from "@/components/Forms/ImportProductForm";
import { UpdateProductInProductsOrderForm } from "@/components/Forms/UpdateProductInProductsOrderForm";
import { setProductsOrder } from "@/stores/productsOrderStore";
import { RootState } from "@/stores/store";
import { ProductsOrder } from "@/types/productsOrder";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function ImportProductScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const editProduct = useSelector((state: RootState) => state.productEdit.editingProduct);

    const { data } = useQuery({
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

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <SafeAreaView edges={["top"]} className="bg-white" />
            <ScrollView
                className="flex-1"
                contentContainerClassName="px-6 pb-10"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-row items-center gap-2 mt-4 mb-6">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold">Thêm sản phẩm mới</Text>
                </View>
                {editProduct ? (
                    <UpdateProductInProductsOrderForm editProduct={editProduct}/>
                ): (
                    <ImportProductForm />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}