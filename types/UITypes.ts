import { Ionicons } from "@expo/vector-icons";

export type MenuItem = {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bg: string;
    route: string;
};