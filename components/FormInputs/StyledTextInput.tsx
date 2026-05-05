import { TextInput } from "react-native";

interface StyledTextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    editable?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

export function StyledTextInput({ value, onChangeText, placeholder = "", editable = true, keyboardType = "default" } : StyledTextInputProps) {

    return (
        <TextInput
            className={`border border-gray-200 rounded-lg px-3 py-2.5 text-sm ${!editable ? "bg-gray-50 text-gray-400" : "bg-white"}`}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            editable={editable}
            keyboardType={keyboardType}
            placeholderTextColor="#9ca3af"
        />
    )
}