import { login as loginApi } from "@/api/authentication'/auth";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const COLORS = {
  purple: "#6420AA",
  pink: "#FF3EA5",
  grey: "#808080",
  black: "#0D0D0D",
  lightPink: "#FFB5DA",
};

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e?.preventDefault?.();
    setError("");
    setIsLoading(true);

    try {
      await loginApi(username, password);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#fff' }}>
      <Header />
      
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{ width: '100%', maxWidth: 320, backgroundColor: 'white', borderRadius: 16}}>


          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Image
              source={require("@/public/assets/image/loginImg.png")}
              style={{ width: '50%', height: 131 }}
              resizeMode="cover"
            />
          </View>

          <Text style={{ textAlign: 'center', fontWeight: '600', color: COLORS.purple, marginBottom: 16, fontSize: 20 }}>
            ĐĂNG NHẬP
          </Text>

          {error ? (
            <View style={{ marginBottom: 12, padding: 8, backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 8 }}>
              <Text style={{ color: '#dc2626', fontSize: 14, textAlign: 'center' }}>{error}</Text>
            </View>
          ) : null}

          <View style={{ gap: 12 }}>
            <View>
              <Text style={{ fontSize: 14, color: COLORS.black }}>Tên đăng nhập</Text>
              <TextInput
                placeholder="Điền tên đăng nhập"
                placeholderTextColor={COLORS.grey}
                value={username}
                onChangeText={setUsername}
                style={{ marginTop: 4, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.grey, borderRadius: 8, color: COLORS.black }}
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, color: COLORS.black }}>Mật khẩu</Text>
              <TextInput
                placeholder="Điền mật khẩu"
                placeholderTextColor={COLORS.grey}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginTop: 4, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.grey, borderRadius: 8, color: COLORS.black }}
              />
            </View>

            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                style={{ paddingHorizontal: 20, paddingVertical: 8, backgroundColor: isLoading ? COLORS.lightPink : COLORS.pink, borderRadius: 8, alignItems: 'center' }}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: 'white', fontWeight: '600' }}>Đăng nhập</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <Footer />
    </View>
  );
}
