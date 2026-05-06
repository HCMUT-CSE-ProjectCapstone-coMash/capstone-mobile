import { OwnerUpdateProduct } from "@/api/products/products";
import { categories, colors, patterns, sizesLetter, sizesNumber } from "@/constants/products";
import { addAlert } from "@/stores/alertStore";
import { clearEditingProduct } from "@/stores/productEditStore";
import { Product, UpdateProduct } from "@/types/Product";
import { formatThousands, parseFormattedNumber } from "@/utilities/numberFormat";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Image, Switch, Text, TouchableOpacity, View } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
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

export function UpdateProductForm({ editProduct }: UpdateProductFormProps) {
    const dispatch = useDispatch();

    const [form, setForm] = useState<FormState>(() => mapProductToForm(editProduct));
    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const isUnchanged = JSON.stringify(form) === JSON.stringify(mapProductToForm(editProduct));

    // Tuỳ theo loại size đang chọn, hiển thị input số lượng tương ứng (UI)
    const sizes = form.isNumberSize ? sizesNumber : sizesLetter;
    const quantities = form.isNumberSize ? form.numberQuantities : form.letterQuantities;

    const handleQuantityChange = (size: string, value: number) => {
        const key = form.isNumberSize ? "numberQuantities" : "letterQuantities";
        setForm((prev) => ({ ...prev, [key]: { ...prev[key], [size]: value } }));
    };

    const updateMutation = useMutation({
        mutationFn: ({ updateData, productId } : { updateData: UpdateProduct, productId: string }) => OwnerUpdateProduct(updateData, productId),

        onSuccess: () => {
            dispatch(addAlert({ type: "success", message: "Cập nhật sản phẩm thành công" }));
            dispatch(clearEditingProduct());
        }
    });

    const handleSubmit = () => {
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

        if (!form.importPrice) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng nhập giá nhập" }));
            return;
        }

        if (!form.salePrice) {
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

        const updateData: UpdateProduct = {
            productId: form.productId,
            productName: form.productName,
            category: form.category,
            color: form.color,
            pattern: form.pattern,
            sizeType: form.isNumberSize ? "Number" : "Letter",
            quantities: formattedQuantities,
            importPrice: form.importPrice,
            salePrice: form.salePrice
        };

        updateMutation.mutate({ updateData, productId: editProduct.id });
    }

    return (
        <View className="gap-4">
            <View>
                <Text className="text-sm text-gray-500">Hình ảnh sản phẩm</Text>

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
            />

            <StyledSelectInput 
                label="Hoạ tiết" 
                value={form.pattern} 
                options={patterns} 
                onSelect={(v) => setField("pattern", v)} 
            />
            
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
                        />
                    </View>
                )}
            />

            <TouchableOpacity>
                <Text
                    className={`mt-4 py-3 rounded-xl text-center text-white bg-pink disabled:opacity-60`}
                    onPress={handleSubmit}
                    disabled={isUnchanged || updateMutation.isPending}
                >
                    {updateMutation.isPending ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}