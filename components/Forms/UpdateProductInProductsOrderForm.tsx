import { EmployeeUpdateProductInProductsOrder, OwnerUpdateProductInProductsOrder } from "@/api/products/products";
import { categories, colors, patterns, sizesLetter, sizesNumber } from "@/constants/products";
import { addAlert } from "@/stores/alertStore";
import { clearEditingProduct } from "@/stores/productEditStore";
import { RootState } from "@/stores/store";
import { Product, UpdateProduct } from "@/types/Product";
import { formatThousands, parseFormattedNumber } from "@/utilities/numberFormat";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FormField } from "../FormInputs/FormField";
import { StyledSelectInput } from "../FormInputs/StyledSelectInput";
import { StyledTextInput } from "../FormInputs/StyledTextInput";

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

interface UpdateProductFormProps {
    editProduct: Product;
}

const createInitialQuantities = (sizes: string[]) => Object.fromEntries(sizes.map((size) => [size, 0]));

// Chuyển dữ liệu sản phẩm từ API về dạng state của form, bao gồm mapping số lượng theo size và tạo URL preview ảnh
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

const getMinQuantities = (product: Product, sizes: string[]): Record<string, number> => {
    const map = createInitialQuantities(sizes);
    product.quantities.forEach((qty) => {
        map[qty.size] = qty.quantities;
    });
    return map;
};

export function UpdateProductInProductsOrderForm({ editProduct }: UpdateProductFormProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const productsOrder = useSelector((state: RootState) => state.productsOrder.productsOrder);

    const [form, setForm] = useState<FormState>(() => mapProductToForm(editProduct));
    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const isUnchanged = JSON.stringify(form) === JSON.stringify(mapProductToForm(editProduct));

    const allSizes = useMemo(() => [...sizesLetter, ...sizesNumber], []);
    const minQuantities = useMemo(
        () => getMinQuantities(editProduct, allSizes),
        [editProduct, allSizes]
    );

    // Tuỳ theo loại size đang chọn, hiển thị input số lượng tương ứng (UI)
    const sizes = form.isNumberSize ? sizesNumber : sizesLetter;
    const quantities = form.isNumberSize ? form.numberQuantities : form.letterQuantities;

    const handleQuantityChange = (size: string, value: number) => {
        const key = form.isNumberSize ? "numberQuantities" : "letterQuantities";
        setForm((prev) => ({ ...prev, [key]: { ...prev[key], [size]: value } }));
    };

    const OwnerUpdateProductInProductsOrderMutation = useMutation({
        mutationFn: ({ productId, productsOrderId, ownerUpdateData } : 
            { productId: string, productsOrderId: string, ownerUpdateData : UpdateProduct }) => OwnerUpdateProductInProductsOrder(productId, productsOrderId, ownerUpdateData),

        onSuccess: () => {
            dispatch(addAlert({ type: "success", message: "Cập nhật sản phẩm thành công" }));
            dispatch(clearEditingProduct());
        },

        onError: () => {
            dispatch(addAlert({ type: "error", message: "Cập nhật sản phẩm thất bại" }));
        }
    });

    const EmployeeUpdateProductInProductsOrderMutation = useMutation({
        mutationFn: ({ productId, productsOrderId, employeeUpdateData } : 
            { productId: string, productsOrderId: string, employeeUpdateData : UpdateProduct }) => EmployeeUpdateProductInProductsOrder(productId, productsOrderId, employeeUpdateData),

        onSuccess: () => {
            dispatch(addAlert({ type: "success", message: "Cập nhật sản phẩm thành công" }));
            dispatch(clearEditingProduct());
        },

        onError: () => {
            dispatch(addAlert({ type: "error", message: "Cập nhật sản phẩm thất bại" }));
        }
    });

    const handleSubmit = () => {
        if (!productsOrder?.id) return;

        if(!form.productName) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng nhập tên sản phẩm "}));
            return;
        }

        if(!form.category) {
            dispatch(addAlert({ type: "warning", message: "Vui chọn phân loại" }));
            return;
        }

        if(!form.color) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng chọn màu" }));
            return;
        }

        if (!form.importPrice && user.role === "owner") {
            dispatch(addAlert({ type: "warning", message: "Vui lòng nhập giá nhập" }));
            return;
        }

        if (!form.salePrice && user.role === "owner") {
            dispatch(addAlert({ type: "warning", message: "Vui lòng nhập giá bán" }));
            return;
        }

        const sizeQuantities = form.isNumberSize ? form.numberQuantities : form.letterQuantities;

        const formattedQuantities = Object.entries(sizeQuantities)
            .filter(([, qty]) => qty > 0)
            .map(([size, qty]) => ({ size, quantities: qty }));

        if (formattedQuantities.length === 0) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng nhập số lượng cho ít nhất một size" }));
            return;
        }

        if (form.status === "Approved") {
            const belowMin = formattedQuantities.some(
                ({ size, quantities: qty }) => qty < (minQuantities[size] ?? 0)
            );
            if (belowMin) {
                dispatch(addAlert({ type: "warning", message: "Số lượng không được thấp hơn số lượng đã duyệt" }));
                return;
            }
        }

        const updateData: UpdateProduct = {
            productId: form.productId,
            productName: form.productName,
            category: form.category,
            color: form.color,
            pattern: form.pattern,
            sizeType: form.isNumberSize ? "Number" : "Letter",
            quantities: formattedQuantities
        };

        if (user.role === "owner") {
            updateData.importPrice = form.importPrice;
            updateData.salePrice = form.salePrice;
            OwnerUpdateProductInProductsOrderMutation.mutate({ productId: editProduct.id, productsOrderId: productsOrder.id, ownerUpdateData: updateData });
        } else {
            EmployeeUpdateProductInProductsOrderMutation.mutate({ productId: editProduct.id, productsOrderId: productsOrder.id, employeeUpdateData: updateData });
        }
    }

    const isPending = OwnerUpdateProductInProductsOrderMutation.isPending || EmployeeUpdateProductInProductsOrderMutation.isPending;

    return (
        <View className="gap-4">
            <View>
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-sm text-gray-500">Hình ảnh sản phẩm</Text>

                    {user.role === "employee" && (
                        <TouchableOpacity 
                            className="px-3 py-2 rounded-xl items-center border border-gray-500 bg-white"
                            onPress={() => router.push("/(nhan-vien)/approval-list")}
                        >
                            <Text className="text-xs text-gray-500">Danh sách duyệt</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View className="relative">
                    <Image
                        source={{ uri: form.imagePreviewUrl }}
                        className="w-full aspect-square rounded-xl"
                        resizeMode="cover"
                    />
                </View>
            </View>

            {/* Product ID */}
            <FormField label="Mã sản phẩm">
                <Text className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    {form.productId}
                </Text>
            </FormField>

            {/* Product Name */}
            <FormField label="Tên sản phẩm">
                <StyledTextInput
                    value={form.productName}
                    onChangeText={(text) => setField("productName", text)}
                    placeholder="Nhập tên sản phẩm"
                    editable={form.status !== "Approved" && user.role === "employee"}
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
                editable={form.status !== "Approved" && user.role === "employee"}
            />

            <StyledSelectInput 
                label="Hoạ tiết" 
                value={form.pattern} 
                options={patterns} 
                onSelect={(v) => setField("pattern", v)} 
                editable={form.status !== "Approved" && user.role === "employee"}
            />

            {/* Prices (owner only) */}
            {user.role === "owner" && (
                <View className="flex-row gap-3">
                    <View className="flex-1">
                        <FormField label="Giá nhập">
                            <StyledTextInput
                                value={formatThousands(form.importPrice)}
                                onChangeText={(v) => setField("importPrice", parseFormattedNumber(v))}
                                placeholder="0 ₫"
                                keyboardType="numeric"
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
                            />
                        </FormField>
                    </View>
                </View>
            )}

            {/* Size type switch */}
            <View className="flex-row items-center justify-between py-1">
                <Text className="text-sm text-gray-700">Kích cỡ - Số lượng</Text>
                <View className="flex-row items-center gap-2">
                    <Text className="text-sm text-gray-500">Size số</Text>
                    <Switch
                        value={form.isNumberSize}
                        onValueChange={(v) => setField("isNumberSize", v)}
                        trackColor={{ false: "#e5e7eb", true: "#f9a8d4" }}
                        thumbColor={form.isNumberSize ? "#ec4899" : "#fff"}
                        disabled={form.status === "Approved"}
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
                    <View className="flex-1 gap-1">
                        <View className="flex-row items-center border border-gray-200 rounded-lg overflow-hidden">
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
                            />
                        </View>
                        {form.status === "Approved" && (minQuantities[size] ?? 0) > 0 && (
                            <Text className="text-xs text-gray-400 text-center">
                                Tối thiểu: {minQuantities[size]}
                            </Text>
                        )}
                    </View>
                )}
            />

            <View className="flex-row justify-end gap-3 mt-2">
                <TouchableOpacity
                    className="py-2.5 px-5 rounded-xl bg-purple items-center"
                    onPress={() => dispatch(clearEditingProduct())}
                >
                    <Text className="text-white text-sm font-medium">Huỷ bỏ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`py-2.5 px-5 rounded-xl items-center ${
                        isPending || isUnchanged ? "bg-pink/50" : "bg-pink"
                    }`}
                    onPress={handleSubmit}
                    disabled={isPending || isUnchanged}
                >
                    {isPending ? (
                        <View className="flex-row items-center gap-2">
                            <ActivityIndicator size="small" color="#fff" />
                            <Text className="text-white text-sm font-medium">
                                {form.status === "Pending" && user.role === "employee" ? "Đang lưu..." : "Đang cập nhật..."}
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-white text-sm font-medium">
                            {form.status === "Pending" && user.role === "employee" ? "Lưu thay đổi" : "Cập nhật"}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}