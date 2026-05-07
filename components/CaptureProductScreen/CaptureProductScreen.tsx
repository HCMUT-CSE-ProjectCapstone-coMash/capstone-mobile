import { AnalyzeImageAndCreate, SearchSimilarProduct } from "@/api/products/products";
import { addAlert } from "@/stores/alertStore";
import { ProductWithOrderStatus, RNFile } from "@/types/Product";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

interface FormState {
    imageFile: { uri: string; name: string; type: string } | null;
}

interface CapturedPhoto {
    uri: string;
    width: number;
    height: number;
}

const initialFormState: FormState = {
    imageFile: null,
}

export function CaptureProductScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    
    const [permission, requestPermission] = useCameraPermissions();
    const [capturing, setCapturing] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [preview, setPreview] = useState<CapturedPhoto | null>(null);
    const cameraRef = useRef<CameraView>(null);

    // -- Form state --
    const [form, setForm] = useState<FormState>(initialFormState);
    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    // -- Suggestion modal state --
    const [showSuggestionModal, setShowSuggestionModal] = useState(false);
    const [similarProducts, setSimilarProducts] = useState<ProductWithOrderStatus[]>([]);

    // -- Mutations --
    const imageSearchMutation = useMutation({
        mutationFn: (imageFile: RNFile) => SearchSimilarProduct(imageFile),
        onSuccess: (data) => {
            if (data.length === 0) {
                if (form.imageFile) {
                    analyzeImageMutation.mutate(form.imageFile);

                    dispatch(addAlert({ type: "success", message: "Đã gửi sản phẩm mới" }));

                    setPreview(null);
                    setForm(initialFormState);
                    setSimilarProducts([]);
                    setShowSuggestionModal(false);                
                }
            } else {
                setSimilarProducts(data);
                setShowSuggestionModal(true);
            }
        }
    });

    const analyzeImageMutation = useMutation({
        mutationFn: (imageFile: RNFile) => AnalyzeImageAndCreate(imageFile),
        onSuccess: () => {},
        onError: () => {}
    });
    
    // -- Handlers --
    const handleCapture = async () => {
        if (!cameraRef.current || capturing) return;
        setCapturing(true);
        try {
            const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
            if (!photo) return;
            setPreview({ uri: photo.uri, width: photo.width, height: photo.height });
        } finally {
            setCapturing(false);
        }
    };

    const handleRetake = () => setPreview(null);

    const handleConfirm = async () => {
        if (!preview || processing) return;
        setProcessing(true);
        try {
            const size = Math.min(preview.width, preview.height);
            const originX = (preview.width - size) / 2;
            const originY = (preview.height - size) / 2;

            const manipulated = await ImageManipulator.ImageManipulator
                .manipulate(preview.uri)
                .crop({ originX, originY, width: size, height: size })
                .resize({ width: 1024, height: 1024 })
                .renderAsync();

            const saved = await manipulated.saveAsync({
                compress: 0.85,
                format: ImageManipulator.SaveFormat.JPEG,
            });

            const imageFile = { uri: saved.uri, name: "product.jpg", type: "image/jpeg" };
            setField("imageFile", imageFile);
            imageSearchMutation.mutate(imageFile);
        } finally {
            setProcessing(false);
        }
    };

    const handleCreateNew = () => {
        if (!form.imageFile) return;

        analyzeImageMutation.mutate(form.imageFile);

        dispatch(addAlert({ type: "success", message: "Đã gửi sản phẩm mới" }));

        setPreview(null);
        setForm(initialFormState);
        setSimilarProducts([]);
        setShowSuggestionModal(false);    
    }

    // -- Permission handling --
    if (!permission) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator color="#ec4899" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-white justify-between py-12">
                <View className="items-center gap-3.5 px-8 mt-16">
                    <View className="w-20 h-20 rounded-full bg-pink-50 items-center justify-center">
                        <Ionicons name="camera-outline" size={36} color="#ec4899" />
                    </View>
                    <Text className="text-[17px] font-semibold text-gray-800">
                        Cần quyền truy cập camera
                    </Text>
                    <Text className="text-sm text-gray-500 text-center leading-5">
                        Cấp quyền để chụp ảnh sản phẩm trực tiếp trong ứng dụng.
                    </Text>
                </View>
                <View className="px-6 gap-2">
                    <TouchableOpacity
                        className="bg-pink py-3.5 rounded-2xl items-center"
                        onPress={requestPermission}
                    >
                        <Text className="text-white font-semibold text-[15px]">Cấp quyền</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-3 items-center" onPress={() => router.back()}>
                        <Text className="text-gray-400 text-[15px]">Huỷ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 px-3 bg-white" style={{ paddingTop: insets.top + 8 }}>
            <TouchableOpacity
                onPress={() => router.back()}
                className="self-start flex-row items-center gap-1.5 bg-gray-100 px-5 py-2 rounded-full"
            >
                <Ionicons name="chevron-back" size={16} color="#6b7280" />
                <Text className="text-gray-500 text-sm font-medium">Quay lại</Text>
            </TouchableOpacity>

            {/* Hint text */}
            <View className="mt-24 items-center py-3">
                <Text className="text-gray-400 text-sm">
                    {preview ? "Xem trước ảnh" : "Căn chỉnh sản phẩm vào khung hình"}
                </Text>
            </View>

            {/* Frame */}
            <View className="mx-6 aspect-square">
                {/* Corner accents */}
                <View className="absolute w-[22px] h-[22px] -top-1.5 -left-1.5 border-t-[3px] border-l-[3px] border-pink rounded-tl-md z-10" />
                <View className="absolute w-[22px] h-[22px] -top-1.5 -right-1.5 border-t-[3px] border-r-[3px] border-pink rounded-tr-md z-10" />
                <View className="absolute w-[22px] h-[22px] -bottom-1.5 -left-1.5 border-b-[3px] border-l-[3px] border-pink rounded-bl-md z-10" />
                <View className="absolute w-[22px] h-[22px] -bottom-1.5 -right-1.5 border-b-[3px] border-r-[3px] border-pink rounded-br-md z-10" />

                {preview ? (
                    <>
                        <Image
                            source={{ uri: preview.uri }}
                            className="w-full h-full rounded-xl"
                            resizeMode="cover"
                        />

                        {imageSearchMutation.isPending && (
                            <View className="absolute inset-0 bg-black/40 rounded-xl items-center justify-center gap-2">
                                <ActivityIndicator size="large" color="#fff" />
                                <Text className="text-white text-sm font-medium">Đang tìm sản phẩm tương tự...</Text>
                            </View>
                        )}
                    </>
                ) : (
                    <CameraView
                        ref={cameraRef}
                        facing="back"
                        style={{ width: "100%", height: "100%" }}
                    />
                )}
            </View>

            {/* Bottom controls */}
            <View className="items-center justify-center gap-5 px-6 py-8">
                {preview ? (
                    <View className="flex-row gap-3 w-full">
                        <TouchableOpacity
                            onPress={handleRetake}
                            disabled={processing}
                            className="flex-1 flex-row items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-pink border border-pink"
                        >
                            <Ionicons name="refresh" size={18} color="white" />
                            <Text className="text-white font-semibold text-[15px]">Chụp lại</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleConfirm}
                            disabled={processing}
                            className="flex-1 flex-row items-center justify-center gap-1.5 py-3.5 rounded-2xl bg-pink"
                        >
                            {processing ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Ionicons name="checkmark" size={20} color="white" />
                                    <Text className="text-white font-semibold text-[15px]">Sử dụng</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={handleCapture}
                        disabled={capturing}
                        activeOpacity={0.85}
                        className="w-[76px] h-[76px] rounded-full bg-white border-4 border-pink items-center justify-center"
                    >
                        {capturing ? (
                            <ActivityIndicator color="#ec4899" />
                        ) : (
                            <View className="w-14 h-14 rounded-full bg-pink" />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            <Modal visible={showSuggestionModal} animationType="slide" transparent onRequestClose={() => setShowSuggestionModal(false)}>
                <View className="flex-1 bg-black/40 justify-end">
                    <View className="bg-white rounded-t-2xl px-4 pt-4 pb-12 max-h-[75%]">
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-base font-semibold text-purple-600">Sản phẩm tương tự</Text>
                            <TouchableOpacity onPress={() => setShowSuggestionModal(false)}>
                                <Ionicons name="close" size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                
                         {/* List */}
                         {similarProducts.length === 0 ? (
                            <View className="items-center py-10 gap-1">
                                <Text className="text-gray-500">Không tìm thấy sản phẩm tương tự</Text>
                                <Text className="text-sm text-gray-400">Hãy tạo sản phẩm mới bên dưới</Text>
                            </View>
                        ) : (
                            <View className="gap-3">
                                {similarProducts.map((item) => {
                                    return (
                                        <View key={item.id} className="flex-row items-center gap-3 p-3 border border-gray-200 rounded-xl">
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
                                        </View>
                                    )
                                })}
                            </View>
                        )}

                    <TouchableOpacity
                        className="mt-4 py-3 rounded-xl bg-pink items-center"
                        onPress={handleCreateNew}
                    >
                        <Text className="text-white text-sm font-medium">
                            Tạo sản phẩm mới
                        </Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}