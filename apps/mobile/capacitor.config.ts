import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kabaad.karodpati",
  appName: "Kabaad to Karodpati",
  webDir: "../../apps/web/out",
  server: {
    androidScheme: "https",
  },
  android: {
    buildOptions: {
      keystorePath: undefined, // Set via env vars for release
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
    },
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    permissions: [
      "INTERNET",
      "ACCESS_NETWORK_STATE",
      "WAKE_LOCK",
      "VIBRATE",
    ],
  },
  ios: {
    contentInset: "automatic",
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ed730c",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#ed730c",
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
    },
  },
};

export default config;