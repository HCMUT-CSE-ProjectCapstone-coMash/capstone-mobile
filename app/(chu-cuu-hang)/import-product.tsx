import { ImportProductForm } from "@/components/Forms/ImportProductForm";
import { KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ImportProductScreen() {
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
                <ImportProductForm />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}