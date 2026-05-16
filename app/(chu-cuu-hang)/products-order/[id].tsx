import { OwnerUpdateProductInProductsOrder } from "@/api/products/products";
import { ApproveProductsOrder, DeleteProductFromProductsOrders, DeleteProductsOrder, GetProductsOrderById } from "@/api/productsOrder/productsOrder";
import { FormField } from "@/components/FormInputs/FormField";
import { StyledSelectInput } from "@/components/FormInputs/StyledSelectInput";
import { StyledTextInput } from "@/components/FormInputs/StyledTextInput";
import { categories, colors, patterns, sizesLetter, sizesNumber } from "@/constants/products";
import { addAlert } from "@/stores/alertStore";
import { Product, UpdateProduct } from "@/types/Product";
import { formatThousands, parseFormattedNumber } from "@/utilities/numberFormat";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Switch, Text, TouchableOpacity, View } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

interface FormState {
    productId: string;
    productName: string;
    category: string;
    color: string;
    pattern: string;
    isNumberSize: boolean;
    letterQuantities: Record<string, number>;
    numberQuantities: Record<string, number>;
    imagePreviewUrl: string;
    status: "Pending" | "Approved",
    importPrice: number;
    salePrice: number;
}

const createInitialQuantities = (sizes: string[]) => Object.fromEntries(sizes.map((size) => [size, 0]));

const mapProductToForm = (product: Product): FormState => {
    const isNumber = product.sizeType === "Number";
    const sizes = isNumber ? sizesNumber : sizesLetter;

    const quantityMap = createInitialQuantities(sizes);
    product.quantities.forEach((qty) => {
        quantityMap[qty.size] = qty.quantities;
    });

    if (product.quantityChanges && product.quantityChanges.length > 0) {
        product.quantityChanges.forEach((change) => {
            quantityMap[change.size] = change.newQuantity;
        });
    }

    return {
        productId: product.productId,
        productName: product.productName,
        category: product.category,
        color: product.color,
        pattern: product.pattern,
        isNumberSize: isNumber,
        letterQuantities: isNumber ? createInitialQuantities(sizesLetter) : quantityMap,
        numberQuantities: isNumber ? quantityMap : createInitialQuantities(sizesNumber),
        imagePreviewUrl: product.imageURL ?? null,
        status: product.status,
        importPrice: product.importPrice,
        salePrice: product.salePrice
    };
};

interface UpdateProductPayload {
    productId: string;
    productOrderId: string;
    updateData: UpdateProduct;
};

export default function SaleOrderDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [form, setForm] = useState<FormState | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["saleOrderDetail", id],
        queryFn: () => GetProductsOrderById(id),
        enabled: !!id,
    });

    const updateProductMutation = useMutation({
        mutationFn: ({ productId, productOrderId, updateData }: UpdateProductPayload) =>
            OwnerUpdateProductInProductsOrder(productId, productOrderId, updateData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saleOrderDetail", id] });
            dispatch(addAlert({ type: "success", message: "Cập nhật sản phẩm thành công" }));
        },
        onError: () => {
            dispatch(addAlert({ type: "error", message: "Cập nhật sản phẩm thất bại" }));
        }
    });

    const deleteMutation = useMutation({
        mutationFn: ({ productOrderId, productId }: { productOrderId: string; productId: string }) =>
            DeleteProductFromProductsOrders(productOrderId, productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saleOrderDetail", id] });
            dispatch(addAlert({ type: "success", message: "Xoá sản phẩm thành công" }));
            setCurrentIndex((prev) => Math.max(0, prev - 1));
        },
        onError: () => {
            dispatch(addAlert({ type: "error", message: "Xoá sản phẩm thất bại" }));
        }
    });

    const approveMutation = useMutation({
        mutationFn: (orderId: string) => ApproveProductsOrder(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products-orders-excluding-pending", ""] });
            dispatch(addAlert({ type: "success", message: "Duyệt đơn hàng thành công" }));
            router.back();
        },
        onError: () => {
            dispatch(addAlert({ type: "error", message: "Duyệt đơn hàng thất bại" }));
        }
    });

    const deleteOrderMutation = useMutation({
        mutationFn: (orderId: string) => DeleteProductsOrder(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products-orders-excluding-pending", ""] });
            dispatch(addAlert({ type: "success", message: "Từ chối đơn thành công" }));
            router.back();
        },
        onError: () => {
            dispatch(addAlert({ type: "error", message: "Từ chối đơn thất bại" }));
        }
    });

    const products: Product[] = data?.products ?? [];
    const product = products[currentIndex];

    const isUnchanged = !!product && !!form && JSON.stringify(form) === JSON.stringify(mapProductToForm(product));

    useEffect(() => {
        if (product) {
            setForm(mapProductToForm(product));
        }
    }, [currentIndex, product]);

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => prev ? { ...prev, [key]: value } : prev);
    };

    if (isLoading || !data || !form) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400">Đang tải...</Text>
            </View>
        );
    }
    
    const isApproved = data.orderStatus === "Approved";
    const isRestock = (product?.quantityChanges ?? []).length > 0;
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < products.length - 1;

    const sizes = form.isNumberSize ? sizesNumber : sizesLetter;
    const quantities = form.isNumberSize ? form.numberQuantities : form.letterQuantities;

    const handleQuantityChange = (size: string, value: number) => {
        const key = form.isNumberSize ? "numberQuantities" : "letterQuantities";
        setForm((prev) => prev ? { ...prev, [key]: { ...prev[key], [size]: value } } : prev);
    };

    const handleUpdateProduct = () => {
        const updateData: UpdateProduct = {
            productName: form.productName,
            color: form.color,
            pattern: form.pattern,
            sizeType: form.isNumberSize ? "Number" : "Letter",
            importPrice: form.importPrice,
            salePrice: form.salePrice,
            quantities: sizes.map((size) => ({
                size,
                quantities: quantities[size] || 0
            }))
        };

        updateProductMutation.mutate({ productId: product.id, productOrderId: id, updateData });
    };

    const handleDeleteProduct = () => {
        deleteMutation.mutate({ productOrderId: id, productId: product.id });
    };

    const handleDeclineOrder = () => {
        deleteOrderMutation.mutate(id);
    };

    const handleApproveOrder = () => {
        approveMutation.mutate(id);
    };

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView edges={["top"]} className="bg-white" />

            {/* Header */}
            <View className="flex-row items-center gap-2 px-6 mt-4 mb-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold">Chi tiết đơn nhập</Text>
            </View>

            <KeyboardAwareScrollView
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 16 }}
                enableOnAndroid
                extraScrollHeight={16}
                keyboardShouldPersistTaps="handled"
            >
                {/* Product detail */}
                {product && (
                    <View className="gap-4">

                        {/* "Sản phẩm" label + delete icon on the same row */}
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm font-medium text-gray-700">Sản phẩm</Text>
                            {!isApproved && (
                                <TouchableOpacity
                                    disabled={deleteMutation.isPending || deleteOrderMutation.isPending}
                                    onPress={products.length === 1 ? handleDeclineOrder : handleDeleteProduct}
                                    className="px-5 py-3 rounded-lg border border-red"
                                >
                                    {deleteMutation.isPending || deleteOrderMutation.isPending ? (
                                        <ActivityIndicator size="small" color="#f87171" />
                                    ) : (
                                        <Text className="text-xs font-medium text-red">Xoá sản phẩm</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>

                        <View className="relative">
                            <Image
                                source={{ uri: product.imageURL }}
                                className="w-full aspect-square rounded-xl"
                                resizeMode="cover"
                            />
                        </View>

                        <View className="gap-1">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-sm text-gray-500">Mã sản phẩm</Text>
                                {isRestock ? (
                                    <View className="self-start px-2.5 py-0.5 rounded-full bg-purple/10">
                                        <Text className="text-xs font-medium text-purple">Hàng nhập thêm</Text>
                                    </View>
                                ) : (
                                    <View className="self-start px-2.5 py-0.5 rounded-full bg-pink/10">
                                        <Text className="text-xs font-medium text-pink">Hàng mới</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                {product.productId}
                            </Text>
                        </View>

                        {/* Product Name */}
                        <FormField label="Tên sản phẩm">
                            <StyledTextInput
                                value={form.productName}
                                onChangeText={(text) => setField("productName", text)}
                                placeholder="Nhập tên sản phẩm"
                                editable={!isApproved}
                            />
                        </FormField>

                        {/* Selects */}
                        <StyledSelectInput
                            label="Phân loại"
                            value={form.category}
                            options={categories}
                            onSelect={(v) => setField("category", v)}
                            editable={false}
                        />

                        <StyledSelectInput
                            label="Màu sắc"
                            value={form.color}
                            options={colors}
                            onSelect={(v) => setField("color", v)}
                            editable={!isApproved}
                        />

                        <StyledSelectInput
                            label="Hoạ tiết"
                            value={form.pattern}
                            options={patterns}
                            onSelect={(v) => setField("pattern", v)}
                            editable={!isApproved}
                        />

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <FormField label="Giá nhập">
                                    <StyledTextInput
                                        value={formatThousands(form.importPrice)}
                                        onChangeText={(v) => setField("importPrice", parseFormattedNumber(v))}
                                        placeholder="0 ₫"
                                        keyboardType="numeric"
                                        editable={!isApproved}
                                    />
                                </FormField>
                            </View>
                            <View className="flex-1">
                                <FormField label="Giá bán">
                                    <StyledTextInput
                                        value={formatThousands(form.salePrice)}
                                        onChangeText={(v) => setField("salePrice", parseFormattedNumber(v))}
                                        placeholder="0 ₫"
                                        keyboardType="numeric"
                                        editable={!isApproved}
                                    />
                                </FormField>
                            </View>
                        </View>

                        {/* Size type switch */}
                        <View className="flex-row items-center justify-between py-1">
                            <Text className={`text-sm ${isApproved ? "text-gray-400" : "text-gray-700"}`}>
                                Kích cỡ - Số lượng
                            </Text>
                            <View className="flex-row items-center gap-2">
                                <Text className={`text-sm ${isApproved ? "text-gray-400" : "text-gray-500"}`}>
                                    Size số
                                </Text>
                                <Switch
                                    value={form.isNumberSize}
                                    onValueChange={(v) => setField("isNumberSize", v)}
                                    trackColor={{ false: "#e5e7eb", true: "#f9a8d4" }}
                                    thumbColor={form.isNumberSize ? "#ec4899" : "#fff"}
                                    disabled={isApproved || isRestock}
                                />
                            </View>
                        </View>

                        {/* Size grid */}
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
                                    <TextInput
                                        className="flex-1 px-3 py-2.5 text-sm text-center"
                                        value={quantities[size] === 0 ? "" : String(quantities[size])}
                                        onChangeText={(v) => handleQuantityChange(size, parseFormattedNumber(v))}
                                        keyboardType="number-pad"
                                        placeholder="0"
                                        placeholderTextColor="#9ca3af"
                                        editable={!isApproved}
                                    />
                                </View>
                            )}
                        />
                    </View>
                )}
            </KeyboardAwareScrollView>

            {/* ─── Sticky bottom bar ─────────────────────────────────── */}
            <SafeAreaView edges={["bottom"]} className="bg-white border-t border-gray-100">
                <View className="px-6 pt-3 pb-2 gap-3">

                    {/* Navigation row — only when there are multiple products */}
                    {products.length > 1 && (
                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity
                                onPress={() => setCurrentIndex((i) => i - 1)}
                                disabled={!hasPrev}
                                className={`flex-row items-center gap-1 px-4 py-2 rounded-xl border border-purple
                                    ${hasPrev ? "opacity-100" : "opacity-30"}`}
                            >
                                <Ionicons name="chevron-back" size={14} color="#7c3aed" />
                                <Text className="text-sm font-medium text-purple">Trước</Text>
                            </TouchableOpacity>

                            <Text className="text-sm text-gray-500">
                                {currentIndex + 1} / {products.length}
                            </Text>

                            <TouchableOpacity
                                onPress={() => setCurrentIndex((i) => i + 1)}
                                disabled={!hasNext}
                                className={`flex-row items-center gap-1 px-4 py-2 rounded-xl border border-purple
                                    ${hasNext ? "opacity-100" : "opacity-30"}`}
                            >
                                <Text className="text-sm font-medium text-purple">Sau</Text>
                                <Ionicons name="chevron-forward" size={14} color="#7c3aed" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Save product button — full width now that delete is inline */}
                    {!isApproved && (
                        <TouchableOpacity
                            disabled={isApproved || isUnchanged || updateProductMutation.isPending}
                            onPress={handleUpdateProduct}
                            className={`py-3 rounded-xl items-center border
                                ${isApproved || isUnchanged ? "border-gray-200 opacity-40" : "border-purple"}`}
                        >
                            {updateProductMutation.isPending ? (
                                <ActivityIndicator size="small" color="#7c3aed" />
                            ) : (
                                <Text className={`font-semibold text-sm
                                    ${isApproved || isUnchanged ? "text-gray-400" : "text-purple"}`}>
                                    Lưu sản phẩm
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}

                    {/* Approve / Decline row — only on the last product, not yet approved */}
                    {!hasNext && !isApproved && (
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                disabled={deleteOrderMutation.isPending}
                                onPress={handleDeclineOrder}
                                className="flex-1 py-3 rounded-xl items-center border border-red"
                            >
                                {deleteOrderMutation.isPending ? (
                                    <ActivityIndicator size="small" color="#f87171" />
                                ) : (
                                    <Text className="text-red font-semibold text-sm">Từ chối đơn</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={approveMutation.isPending}
                                onPress={handleApproveOrder}
                                className="flex-1 bg-pink py-3 rounded-xl items-center"
                            >
                                {approveMutation.isPending ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text className="text-white font-semibold text-sm">Duyệt đơn nhập</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

                </View>
            </SafeAreaView>
        </View>
    );
}