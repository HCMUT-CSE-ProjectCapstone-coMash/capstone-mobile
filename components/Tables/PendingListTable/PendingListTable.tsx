import { GetProductsOrdersExcludingPending } from "@/api/productsOrder/productsOrder";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductsOrderWithCreator } from "@/types/productsOrder";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { OrderCard } from "./OrderCard";

export function PendingListTable() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    const PAGESIZE = 10;

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["products-orders-excluding-pending", debouncedSearch],
        queryFn: ({ pageParam = 1 }) => GetProductsOrdersExcludingPending(pageParam, PAGESIZE, debouncedSearch),
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.flatMap(p => p.items).length;
            return loaded < lastPage.total ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 5 * 60 * 1000,
    });

    const items: ProductsOrderWithCreator[] = data?.pages.flatMap(p => p.items) ?? [];

    return (
        <FlatList
            data={items}
            keyExtractor={item => item.id}
            contentContainerClassName="gap-3 pb-10"
            ListHeaderComponent={
                <View className="mb-4">
                    <View className="flex-row items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                        <Ionicons name="search-outline" size={16} color="#9ca3af" />
                        <TextInput
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Tìm đơn nhập hàng..."
                            placeholderTextColor="#9ca3af"
                            className="flex-1 text-sm text-gray-900"
                        />
                        {search.length > 0 && (
                            <TouchableOpacity onPress={() => setSearch("")}>
                                <Ionicons name="close-circle" size={16} color="#9ca3af" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            }
            renderItem={({ item }) => ( 
                <OrderCard item={item} />
            )}
            onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
                isFetchingNextPage
                    ? <ActivityIndicator size="small" color="#6420AA" className="py-4" />
                    : null
            }
            ListEmptyComponent={
                !isLoading ? (
                    <View className="flex-1 items-center justify-center py-10">
                        <Text className="text-sm text-gray-400">Không có đơn nào.</Text>
                    </View>
                ) : null
            }
        />
    );
}