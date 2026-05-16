import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FormField } from "./FormField";

interface StyledSelectInputProps {
    label: string,
    value: string,
    options: { label: string; value: string }[],
    onSelect: (v: string) => void
    editable?: boolean
}

export function StyledSelectInput({ label, value, options, onSelect, editable = true } : StyledSelectInputProps) {
    const [open, setOpen] = useState(false);
    const display = options.find((o) => o.value === value)?.label ?? "Chọn...";

    return (
        <>
            <FormField label={label}>
                <TouchableOpacity
                    className="border border-gray-200 rounded-lg px-3 py-2.5 flex-row justify-between items-center"
                    onPress={() => editable && setOpen(true)}
                    activeOpacity={editable ? 0.7 : 1}       
                >
                    <Text className={`text-sm text-black`}>
                        {display}
                    </Text>
                    {editable && <Ionicons name="chevron-down" size={12} color="#9ca3af" />}
                </TouchableOpacity>
            </FormField>

            <PickerModal
                visible={open} 
                title={label}
                options={options}
                onSelect={onSelect}
                onClose={() => setOpen(false)}
            />
        </>
    );
}

interface PickerModalProps {
    visible: boolean;
    options: { label: string; value: string }[];
    onSelect: (v: string) => void;
    onClose: () => void;
    title: string;
}

function PickerModal({ visible, options, onSelect, onClose, title } : PickerModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <Pressable className="flex-1 bg-black/40" onPress={onClose} />
            <View className="bg-white rounded-t-2xl max-h-[60%]">
                <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                    <Text className="text-base font-semibold">{title}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-pink font-medium">Đóng</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    {options.map((opt) => (
                        <TouchableOpacity
                            key={opt.value}
                            className="px-5 py-4 border-b border-gray-50"
                            onPress={() => { onSelect(opt.value); onClose(); }}
                        >
                            <Text className="text-sm">{opt.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
}