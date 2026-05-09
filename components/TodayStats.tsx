import { RootState } from "@/stores/store";
import { DashboardStatsDto } from "@/types/saleOrder";
import { formatThousands } from "@/utilities/numberFormat";
import { Ionicons } from "@expo/vector-icons";
import React, { Text, View } from "react-native";
import { useSelector } from "react-redux";

type StatTileProps = {
    label: string;
    value: string;
    unit: string;
    badge: string;
    trend: "up" | "down";
};

function StatTile({ label, value, unit, badge, trend }: StatTileProps) {
    const isUp = trend === "up";
    return (
        <View className="flex-1 bg-gray-100 rounded-2xl p-3 gap-1">
            <Text className="text-sm text-gray-500">{label}</Text>
            <View className="flex-row items-baseline gap-1">
                <Text className="text-xl font-semibold text-gray-900">{value}</Text>
                <Text className="text-xs text-gray-500">{unit}</Text>
            </View>
            <View className={`flex-row items-center gap-1 self-start px-2 py-0.5 rounded-full ${isUp ? "bg-green-100" : "bg-red-100"}`}>
                <Ionicons
                    name={isUp ? "trending-up" : "trending-down"}
                    size={11}
                    color={isUp ? "#15803d" : "#b91c1c"}
                />
                <Text className={`text-xs font-semibold ${isUp ? "text-green-700" : "text-red-700"}`}>
                    {badge}
                </Text>
            </View>
        </View>
    );
}

type TodayStatsProps = {
    data: DashboardStatsDto;
    isLoading: boolean;
};

function calcDiff(today: number, yesterday: number): string {
    if (yesterday === 0) return today > 0 ? "+100%" : "0%";
    const pct = ((today - yesterday) / yesterday) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export function TodayStats({ data, isLoading }: TodayStatsProps) {
    const user = useSelector((state: RootState) => state.user);

    return (
        <View className="px-4 mt-5">
            <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="stats-chart-outline" size={15} color="#6b7280" />
                <Text className="text-sm font-semibold text-gray-500">
                    {user.role !== "owner" ? "Thống kê hôm nay (của tôi)" : "Thống kê hôm nay"}
                </Text>
            </View>
            <View className="flex-row gap-3">
                {isLoading ? (
                    <>
                        <View className="flex-1 bg-gray-100 rounded-2xl p-3 h-24 animate-pulse" />
                        <View className="flex-1 bg-gray-100 rounded-2xl p-3 h-24 animate-pulse" />
                    </>
                ) : (
                    <>
                        <StatTile
                            label="Doanh thu"
                            value={formatThousands(data?.totalSaleToday ?? 0)}
                            unit="VNĐ"
                            badge={calcDiff(data?.totalSaleToday ?? 0, data?.totalSaleYesterday ?? 0)}
                            trend={(data?.totalSaleToday ?? 0) >= (data?.totalSaleYesterday ?? 0) ? "up" : "down"}
                        />
                        <StatTile
                            label="Đơn hàng"
                            value={String(data?.totalOrderToday ?? 0)}
                            unit="đơn"
                            badge={calcDiff(data?.totalOrderToday ?? 0, data?.totalOrderYesterday ?? 0)}
                            trend={(data?.totalOrderToday ?? 0) >= (data?.totalOrderYesterday ?? 0) ? "up" : "down"}
                        />
                    </>
                )}
            </View>
        </View>
    );
}