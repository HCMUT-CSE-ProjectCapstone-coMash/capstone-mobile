import { clearAlert } from "@/stores/alertStore";
import { RootState } from "@/stores/store";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const config = {
    success: { bg: "bg-green-500",  icon: "checkmark-circle" as const, label: "Thành công" },
    error:   { bg: "bg-red",    icon: "close-circle"     as const, label: "Lỗi"        },
    warning: { bg: "bg-yellow-500", icon: "warning"          as const, label: "Cảnh báo"   },
    info:    { bg: "bg-blue-500",   icon: "information-circle" as const, label: "Thông báo" },
};

export function GlobalAlert() {
    const dispatch = useDispatch();
    const { isOpen, type, message } = useSelector((state: RootState) => state.alert);
    const insets = useSafeAreaInsets();
    const translateY = useMemo(() => new Animated.Value(-100), []);

    useEffect(() => {
        if (!isOpen) return;

        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 80,
            friction: 10,
        }).start();

        const timer = setTimeout(() => dispatch(clearAlert()), 3000);
        return () => clearTimeout(timer);
    }, [isOpen, message, dispatch, translateY]);

    if (!isOpen) return null;

    const { bg, icon, label } = config[type];

    return (
        <Animated.View
            style={{
                position: "absolute",
                top: insets.top + 24,
                left: 16,
                right: 16,
                zIndex: 9999,
                transform: [{ translateY }],
            }}
        >
            <View className={`${bg} rounded-xl px-4 py-3 flex-row items-center gap-3 shadow-lg`}>
                <Ionicons name={icon} size={24} color="white" />

                <View className="flex-1">
                    <Text className="text-white text-xs font-semibold opacity-80">{label}</Text>
                    <Text className="text-white text-sm">{message}</Text>
                </View>

                <TouchableOpacity onPress={() => dispatch(clearAlert())}>
                    <Ionicons name="close" size={20} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}