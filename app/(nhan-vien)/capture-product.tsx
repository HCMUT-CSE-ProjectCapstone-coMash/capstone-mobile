import { CameraCapture } from "@/components/CameraCapture";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function CaptureProductScreen() {
    const router = useRouter();

    return (
        <View className="flex-1">
            <CameraCapture
                onCapture={(file) => {}}
                onClose={() => router.back()}
            />
        </View>
    );
}