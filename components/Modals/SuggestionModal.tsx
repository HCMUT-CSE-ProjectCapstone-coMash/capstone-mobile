import { AnalyzeImage } from "@/api/products/products";
import { GetProductsOrderById } from "@/api/productsOrder/productsOrder";
import { setEditingProduct } from "@/stores/productEditStore";
import { ProductWithOrderStatus, RNFile } from "@/types/Product";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

interface SuggestionModalProps {
    visible: boolean;
    onClose: () => void;
    products: ProductWithOrderStatus[];
    onAnalyzeResult: (data: { productName: string; category: string; color: string; pattern: string }) => void;
    imageFile: RNFile;
    productsOrdersId: string;
}

export function SuggestionModal({ visible, onClose, products, onAnalyzeResult, imageFile, productsOrdersId } : SuggestionModalProps) {
    const dispatch = useDispatch();

    const analyzeImageMutation = useMutation({
        mutationFn: (imageFile: RNFile) => AnalyzeImage(imageFile),
        onSuccess: (data) => {
            onAnalyzeResult({
                productName: data.productName,
                category: data.category,
                color: data.color,
                pattern: data.pattern
            });
            onClose();
        },
        onError: () => {}
    });

    const { data } = useQuery({
        queryKey: ["productsOrderDetails", productsOrdersId],
        queryFn: () => GetProductsOrderById(productsOrdersId as string),
        enabled: !!productsOrdersId
    });

    const orderProducts = data?.products ?? [];

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View className="flex-1 bg-black/40 justify-end">
                <View className="bg-white rounded-t-2xl px-4 pt-4 pb-12 max-h-[75%]">

                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-base font-semibold text-purple-600">Sản phẩm tương tự</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* List */}
                    {products.length === 0 ? (
                        <View className="items-center py-10 gap-1">
                            <Text className="text-gray-500">Không tìm thấy sản phẩm tương tự</Text>
                            <Text className="text-sm text-gray-400">Hãy tạo sản phẩm mới bên dưới</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={products}
                            keyExtractor={(item) => item.id}
                            contentContainerClassName="gap-3"
                            renderItem={({ item }) => {
                                const isInOrder = orderProducts.some((op: { id: string }) => op.id === item.id);
                            
                                return (
                                    <View className="flex-row items-center gap-3 p-3 border border-gray-200 rounded-xl">
                                        <Image
                                            source={{ uri: item.imageURL }}
                                            className="w-20 h-20 rounded-lg"
                                            resizeMode="cover"
                                        />
                                        <View className="flex-1 gap-1">
                                            <Text className="font-medium" numberOfLines={1}>{item.productName}</Text>
                                            <Text className="text-sm text-gray-500">{item.category} · {item.color}</Text>
                                            <Text className="text-sm text-gray-500">{item.pattern}</Text>
                                        </View>
                            
                                        {isInOrder ? (
                                            <TouchableOpacity
                                                className="px-3 py-1.5 border border-pink rounded-lg"
                                                onPress={() => { dispatch(setEditingProduct(item)); onClose(); }}
                                            >
                                                <Text className="text-pink text-sm">Điều chỉnh</Text>
                                            </TouchableOpacity>
                                        ) : item.isInPendingOrder ? (
                                            <Text className="text-xs text-pink shrink-0">Đang chờ duyệt</Text>
                                        ) : (
                                            <TouchableOpacity
                                                className="px-3 py-1.5 border border-purple rounded-lg"
                                                onPress={() => { dispatch(setEditingProduct(item)); onClose(); }}
                                            >
                                                <Text className="text-purple text-sm">Chọn</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            }}
                        />
                    )}

                    <TouchableOpacity
                        className="mt-4 py-3 rounded-xl bg-pink items-center"
                        onPress={() => analyzeImageMutation.mutate(imageFile)}
                    >
                        <Text className="text-white text-sm font-medium">
                            {analyzeImageMutation.isPending ? "Đang tạo..." : "Tạo sản phẩm mới"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}