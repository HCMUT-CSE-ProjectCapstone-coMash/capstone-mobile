import { FormField } from "@/components/FormInputs/FormField";
import { sizesLetter, sizesNumber } from "@/constants/products";
import { RootState } from "@/stores/store";
import { Product } from "@/types/Product";
import { FlatList, Image, Text, View } from "react-native";
import { useSelector } from "react-redux";

interface SearchProductFormProps {
    product: Product;
}

function formatCurrency(value: number) {
    return value.toLocaleString("vi-VN") + " ₫";
}

export function SearchProductForm({ product }: SearchProductFormProps) {
    const user = useSelector((state: RootState) => state.user);
    const sizes = product.sizeType === "Number" ? sizesNumber : sizesLetter;
    const quantitiesMap = product.quantities.reduce<Record<string, number>>((acc, item) => {
        acc[item.size] = item.quantities;
        return acc;
    }, {} as Record<string, number>);

    return (
        <View className="gap-4">
            <View>
                <Text className="text-sm text-gray-500 mb-3">Hình ảnh sản phẩm</Text>
                <Image
                    source={{ uri: product.imageURL }}
                    className="w-full aspect-square rounded-xl"
                    resizeMode="cover"
                />
            </View>

            <FormField label="Mã sản phẩm">
                <Text className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    {product.productId}
                </Text>
            </FormField>

            <FormField label="Tên sản phẩm">
                <Text className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    {product.productName}
                </Text>
            </FormField>

            {user.role === "owner" ? (
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <FormField label="Giá nhập">
                            <Text className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                {formatCurrency(product.importPrice)}
                            </Text>
                        </FormField>
                    </View>
                    <View className="flex-1">
                        <FormField label="Giá bán">
                            <Text className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                {formatCurrency(product.salePrice)}
                            </Text>
                        </FormField>
                    </View>
                </View>
            ) : (
                <FormField label="Giá bán">
                    <Text className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        {formatCurrency(product.salePrice)}
                    </Text>
                </FormField>
            )}


            <View>
                <View className="flex-row items-center justify-between py-1 mb-1">
                    <Text className="text-sm text-gray-700">Kích cỡ - Số lượng</Text>
                    <Text
                        numberOfLines={1}
                        className="text-sm text-gray-500"
                    >
                        {product.sizeType === "Number" ? "Size số" : "Size chữ"}
                    </Text>
                </View>

                <FlatList
                    data={sizes}
                    keyExtractor={(item) => item}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperClassName="gap-3"
                    contentContainerClassName="gap-3"
                    renderItem={({ item: size }) => (
                        <View className="flex-1 flex-row items-center border border-gray-200 rounded-lg overflow-hidden">
                            <View className="bg-gray-50 py-2.5 border-r border-gray-200">
                                <Text className="text-sm text-gray-600 w-20 text-center">{size}</Text>
                            </View>
                            <Text className="flex-1 px-3 py-2.5 text-sm text-center text-gray-900">
                                {quantitiesMap[size] ?? 0}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}