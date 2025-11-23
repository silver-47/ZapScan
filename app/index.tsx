import { type HistoryData, type QRData } from "@/constants/types";
import { useThemedColors } from "@/hooks/useThemedColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, BackHandler, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ScannerScreen() {
  const colors = useThemedColors();
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) requestPermission();
  }, [permission, requestPermission]);

  const resetScanState = useCallback(() => {
    setScanned(false);
    setIsTorchOn(false);
    return () => {
      setIsTorchOn(false);
    };
  }, []);

  useFocusEffect(resetScanState);

  const saveScanToHistory = async (qrData: QRData) => {
    try {
      const existingHistory = await AsyncStorage.getItem("QRScanHistory");
      const parsedHistory: HistoryData = existingHistory ? JSON.parse(existingHistory) : [];
      await AsyncStorage.setItem("QRScanHistory", JSON.stringify([{ timestamp: Date.now(), ...qrData }, ...parsedHistory]));
      setTimeout(() => setScanned(false), 1000);
    } catch (err) {
      let errorMessage = "Something happened please try again!";
      if (err instanceof Error) errorMessage = err.message;
      else if (typeof err === "string") errorMessage = err;
      Alert.alert("Failed to Save", errorMessage);
    }
  };

  const handleBarCodeScanned = async (scanData: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const qrData: QRData = { type: scanData.extra?.type === "url" ? "url" : "text", data: scanData.data };
    Alert.alert(
      "QR Scanned",
      "Do you want to view the Result or Save it.",
      [
        { text: "Save Only", onPress: () => saveScanToHistory(qrData) },
        { text: "View Only", onPress: () => router.push({ pathname: "/result", params: qrData }) },
        {
          text: "Save & View",
          onPress: () => {
            saveScanToHistory(qrData);
            router.push({ pathname: "/result", params: qrData });
          },
        },
      ],
      { cancelable: true, onDismiss: resetScanState }
    );
  };

  if (!permission) return null;
  else if (!permission.granted)
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <MaterialCommunityIcons name="camera-off" size={64} color={colors.textSecondary} />
        <Text style={[styles.message, { color: colors.text }]} allowFontScaling={false}>
          Camera access is required
        </Text>
        <TouchableOpacity
          onPress={
            permission.canAskAgain
              ? requestPermission
              : () =>
                  Alert.alert(
                    "Camera access is required",
                    "Please allow Camera access from Settings to Scan QR Code",
                    [
                      {
                        text: "Ok",
                        isPreferred: true,
                        onPress: () => {
                          if (Platform.OS === "android")
                            Linking.openSettings()
                              .then(() => BackHandler.exitApp())
                              .catch(console.error);
                        },
                        style: "default",
                      },
                    ],
                    { cancelable: false }
                  )
          }
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.buttonText} allowFontScaling={false}>
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={[styles.title, { color: colors.primary }]} allowFontScaling={false}>
        Ready to Scan
      </Text>
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          enableTorch={isTorchOn}
        />

        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View
              style={[
                styles.corner,
                { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderColor: colors.primary },
              ]}
            />
            <View
              style={[
                styles.corner,
                { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderColor: colors.primary },
              ]}
            />
            <View
              style={[
                styles.corner,
                { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderColor: colors.primary },
              ]}
            />
            <View
              style={[
                styles.corner,
                { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderColor: colors.primary },
              ]}
            />
          </View>
          <View style={styles.overlayTextBG}>
            <Text style={styles.overlayText} allowFontScaling={false}>
              Align QR code within the frame
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.torchButton, { backgroundColor: isTorchOn ? colors.primary : "#0007" }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsTorchOn((t) => !t);
          }}
        >
          <MaterialCommunityIcons name={isTorchOn ? "flashlight" : "flashlight-off"} size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  message: { fontSize: 18, fontFamily: "InterMedium", marginVertical: 20 },
  button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  buttonText: { fontSize: 16, fontFamily: "InterSemiBold", color: "white" },

  title: {
    margin: 24,
    marginTop: 48,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "InterSemiBold",
  },
  cameraContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: { aspectRatio: 1, width: "70%" },
  corner: { position: "absolute", width: 40, height: 40, borderWidth: 4 },
  overlayTextBG: { marginTop: 20, padding: 8, borderRadius: 8, backgroundColor: "#0007" },
  overlayText: { fontSize: 14, fontFamily: "InterMedium", color: "#fff" },
  torchButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    aspectRatio: 1,
    width: 60,
    borderRadius: 999999,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff4",
  },
});
