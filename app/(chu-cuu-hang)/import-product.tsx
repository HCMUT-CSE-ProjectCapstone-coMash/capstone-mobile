import { ImportProductForm } from "@/components/Forms/ImportProductForm";
import { UpdateProductForm } from "@/components/Forms/UpdateProductForm";
import { RootState } from "@/stores/store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

export default function ImportProductScreen() {
    const router = useRouter();
    const editProduct = useSelector((state: RootState) => state.productEdit.editingProduct);

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
                    <UpdateProductForm editProduct={editProduct}/>
                ): (
                    <ImportProductForm />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}