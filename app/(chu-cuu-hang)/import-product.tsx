import { CreateProductIdByCategory, FetchApprovedProductByName, OwnerCreateProduct } from "@/api/products/products";
import { FormField } from "@/components/FormInputs/FormField";
import { StyledSelectInput } from "@/components/FormInputs/StyledSelectInput";
import { StyledTextInput } from "@/components/FormInputs/StyledTextInput";
import { categories, colors, patterns, sizesLetter, sizesNumber } from "@/constants/products";
import { useDebounce } from "@/hooks/useDebounce";
import { addAlert } from "@/stores/alertStore";
import { RootState } from "@/stores/store";
import { CreateProduct, Product } from "@/types/Product";
import { formatThousands, parseFormattedNumber } from "@/utilities/numberFormat";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

interface FormState {
    productId: string;
    productName: string;
    category: string;
    color: string;
    pattern: string;
    importPrice: number;
    salePrice: number;
    isNumberSize: boolean;
    letterQuantities: Record<string, number>;
    numberQuantities: Record<string, number>;
    imageUri: string | null;
    imageFile: { uri: string; name: string; type: string } | null;
}

const createInitialQuantities = (sizes: string[]) => Object.fromEntries(sizes.map((s) => [s, 0]));

const initialFormState: FormState = {
    productId: "",
    productName: "",
    category: "",
    color: "",
    pattern: "",
    isNumberSize: false,
    letterQuantities: createInitialQuantities(sizesLetter),
    numberQuantities: createInitialQuantities(sizesNumber),
    imageUri: null,
    imageFile: null,
    salePrice: 0,
    importPrice: 0,
};

export default function ImportProductScreen() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    const [form, setForm] = useState<FormState>(initialFormState);
    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const sizes = form.isNumberSize ? sizesNumber : sizesLetter;
    const quantities = form.isNumberSize ? form.numberQuantities : form.letterQuantities;

    const handleQuantityChange = (size: string, value: number) => {
        const key = form.isNumberSize ? "numberQuantities" : "letterQuantities";
        setForm(prev => ({ ...prev, [key]: { ...prev[key], [size]: value } }));
    }

    // -- IMAGE PICKER & MANIPULATOR --
    const pickImage = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            Alert.alert("Cần quyền truy cập", "Cho phép truy cập thư viện ảnh để tiếp tục.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            const manipulated = await ImageManipulator.ImageManipulator.manipulate(asset.uri).renderAsync();
            
            const saved = await manipulated.saveAsync({
                compress: 0.9,
                format: ImageManipulator.SaveFormat.JPEG,
            });
            
            // imageUri — the local file path, used to render the preview <Image>
            // imageFile — a file object shaped for FormData upload (uri + name + type)
            setField("imageUri", saved.uri);
            setField("imageFile", {
                uri: saved.uri,
                name: "product.jpg",
                type: "image/jpeg",
            });
        }
    };

    // -- PRODUCT NAME SUGGESTIONS --
    const debouncedName = useDebounce(form.productName, 500);
    const { data: suggestions = [] } = useQuery({
        queryKey: ["products", debouncedName],
        queryFn: () => FetchApprovedProductByName(debouncedName),
        enabled: debouncedName.length > 2,
        staleTime: 0,
        gcTime: 0,
    });
    const [showSuggestions, setShowSuggestions] = useState(false);

    // -- Create Product Id Mutation --
    const createProductIdMutation = useMutation({
        mutationFn: (category: string) => CreateProductIdByCategory(category),
        onSuccess: (data) => setField("productId", data.productId),
    });

    // -- SUBMIT MUTATION --
    const ownerCreateMutation = useMutation({
        mutationFn: (productData: CreateProduct) => OwnerCreateProduct(productData),
        onSuccess: () => {
            dispatch(addAlert({ type: "success", message: "Sản phẩm đã được thêm thành công." }));
            setForm(initialFormState);
        },
        onError: () => {
            dispatch(addAlert({ type: "error", message: "Thêm sản phẩm thất bại. Vui lòng thử lại." }));
        }
    });

    const employeeCreateMutation = useMutation({

    });

    const handleSubmit = () => {
        if (!user.id) return;

        if (!form.imageFile) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng chọn hình ảnh sản phẩm." }));
            return;
        }

        if (!form.productName) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng nhập tên sản phẩm." }));
            return;
        }

        if (!form.category) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng chọn phân loại sản phẩm." }));
            return;
        }

        if (!form.color) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng chọn màu sắc sản phẩm." }));
            return;
        }

        if (user.role === "owner" && form.importPrice <= 0) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng nhập giá nhập." }));
            return;
        }

        if (user.role === "owner" && form.salePrice <= 0) {
            dispatch(addAlert({ type: "warning", message: "Vui lòng nhập giá bán." }));
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

        const payload: CreateProduct = {
            productName: form.productName,
            category: form.category,
            color: form.color,
            pattern: form.pattern,
            sizeType: form.isNumberSize ? "Number" : "Letter",
            quantities: formattedQuantities,
            createdBy: user.id,
            image: form.imageFile,
            importPrice: form.importPrice,
            salePrice: form.salePrice,
        }

        if (user.role === "owner") {
            ownerCreateMutation.mutate(payload);
        } else {
            employeeCreateMutation.mutate();
        }
    }

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
                <Text className="text-xl font-semibold mt-4 mb-6">Thêm sản phẩm mới</Text>

                <View className="mb-6">
                    <Text className="text-sm text-gray-500 mb-2">Hình ảnh sản phẩm</Text>
                    {form.imageUri ? (
                        <View className="relative">
                            <Image
                                source={{ uri: form.imageUri }}
                                className="w-full aspect-square rounded-xl"
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 items-center justify-center shadow"
                                onPress={() => { setField("imageUri", null); setField("imageFile", null); }}
                            >
                                <Text className="text-pink text-sm">✕</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            className="w-full aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 items-center justify-center gap-3"
                            onPress={pickImage}
                        >
                            <Text className="text-4xl text-gray-300">📷</Text>
                            <Text className="text-sm text-gray-400">Chọn ảnh từ thư viện</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View className="gap-4">
                    <FormField label="Mã sản phẩm">
                        <Text className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                            {form.productId}
                        </Text>
                    </FormField>

                    <FormField label="Tên sản phẩm">
                        <StyledTextInput
                            value={form.productName}
                            onChangeText={(text) => {
                                setField("productName", text);
                                setShowSuggestions(true);
                            }}
                            placeholder="Nhập tên sản phẩm"
                        />

                        {showSuggestions && suggestions.length > 0 && (
                            <ScrollView
                                className="border border-gray-200 rounded-lg mt-1 bg-white shadow-sm max-h-40"
                                keyboardShouldPersistTaps="handled"
                                nestedScrollEnabled
                            >
                                {suggestions.map((item: Product) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        className="px-3 py-3 border-b border-gray-50 flex-row items-center gap-3"
                                        onPress={() => {
                                            setField("productName", item.productName);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        <Image
                                            source={{ uri: item.imageURL }}
                                            className="w-8 h-8 rounded"
                                            resizeMode="cover"
                                        />
                                        <Text className="text-sm flex-1">{item.productName}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </FormField>
                    
                    <StyledSelectInput label="Phân loại" value={form.category} options={categories} onSelect={(v) => {
                        setField("category", v);
                        createProductIdMutation.mutate(v)
                    }}/>

                    <StyledSelectInput label="Màu sắc" value={form.color} options={colors} onSelect={(v) => setField("color", v)} />

                    <StyledSelectInput label="Hoạ tiết" value={form.pattern} options={patterns} onSelect={(v) => setField("pattern", v)} />

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

                    <View className="flex-row items-center justify-between py-1">
                        <Text className="text-sm text-gray-700">Kích cỡ - Số lượng</Text>
                        <View className="flex-row items-center gap-2">
                            <Text className="text-sm text-gray-500">Size số</Text>
                            <Switch
                                value={form.isNumberSize}
                                onValueChange={(v) => setField("isNumberSize", v)}
                                trackColor={{ false: "#e5e7eb", true: "#f9a8d4" }}
                                thumbColor={form.isNumberSize ? "#ec4899" : "#fff"}
                            />
                        </View>
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

                    <TouchableOpacity
                        className={`mt-4 py-3.5 rounded-xl items-center ${ownerCreateMutation.isPending || employeeCreateMutation.isPending ? "bg-pink/50" : "bg-pink"}`}
                        onPress={handleSubmit}
                        disabled={ownerCreateMutation.isPending || employeeCreateMutation.isPending}
                    >
                        {ownerCreateMutation.isPending || employeeCreateMutation.isPending ? (
                            <View className="flex-row items-center gap-2">
                                <ActivityIndicator size="small" color="#fff" />
                                <Text className="text-white text-sm font-medium">Đang thêm...</Text>
                            </View>
                        ) : (
                            <Text className="text-white text-sm font-medium">
                                {user.role === "owner" ? "Thêm sản phẩm" : "Thêm vào danh sách duyệt"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}