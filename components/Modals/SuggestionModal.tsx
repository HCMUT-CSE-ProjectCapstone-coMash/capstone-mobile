import { AnalyzeImage } from "@/api/products/products";
import { ProductWithOrderStatus, RNFile } from "@/types/Product";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { FlatList, Image, Modal, Text, TouchableOpacity, View } from "react-native";

interface SuggestionModalProps {
    visible: boolean;
    onClose: () => void;
    products: ProductWithOrderStatus[];
    onAnalyzeResult: (data: { productName: string; category: string; color: string; pattern: string }) => void;
    imageFile: RNFile;
}

export function SuggestionModal({ visible, onClose, products, onAnalyzeResult, imageFile } : SuggestionModalProps) {
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
                            renderItem={({ item }) => (
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
                                    <TouchableOpacity
                                        className="px-3 py-1.5 border border-pink rounded-lg"
                                    >
                                        <Text className="text-pink text-sm">Chọn</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
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