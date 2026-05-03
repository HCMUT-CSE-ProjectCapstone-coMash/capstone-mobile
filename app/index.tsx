import { Profile } from "@/api/authentication/auth";
import { clearUser, setUser } from "@/stores/userStore";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Index() {
    const dispatch = useDispatch();

    const { data, isError, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: Profile,
        retry: false,
    });

    useEffect(() => {
        if (data) dispatch(setUser(data));
        if (isError) dispatch(clearUser());
    }, [data, isError, dispatch]);

    if (isLoading) return null;

    if (!data || isError) return <Redirect href="/login" />;

    if (!data.hasChangedPassword) return <Redirect href="/change-password" />;

    if (data.role === "employee") return <Redirect href="/(nhan-vien)" />;

    if (data.role === "owner") return <Redirect href="/(chu-cuu-hang)" />;

    return <Redirect href="/login" />;
}