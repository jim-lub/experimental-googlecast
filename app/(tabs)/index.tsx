import { useCallback, useState } from "react";
import { StyleSheet, View, Text, Button, ScrollView } from "react-native";
import GoogleCast, {
  CastButton,
  useCastDevice,
  useDevices,
  useRemoteMediaClient,
  Device,
} from "react-native-google-cast";

export default function HomeScreen() {
  const device = useCastDevice();
  const discoveryManager = GoogleCast.getDiscoveryManager();
  const sessionManager = GoogleCast.getSessionManager();
  
  const devices = useDevices();
  const [getDeviceResult, setGetDeviceResult] = useState<Device[]>();

  const getDevicesWithDiscoveryManager = useCallback(async () => {
    const devices = await discoveryManager.getDevices()
    setGetDeviceResult(devices)
  }, [])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.title}>1. CastButton</Text>
        <Text style={styles.description}>
          {
            "- Double devices\n- Can always connect to devices (even after backgrounding app)"
          }
        </Text>

        <CastButton style={{ width: 24, height: 24, tintColor: "black" }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>2. useDevices()</Text>
        <Text style={styles.description}>
          {
            "- Double devices\n- Cannot connect after backgrounding app\n- Devices disappear when hot reloading after backgrounding app"
          }
        </Text>
        {devices.map((d, index) => {
          const active = device?.deviceId === d.deviceId;

          return (
            <Button
              color={active ? "green" : undefined}
              key={d.deviceId + index}
              onPress={() =>
                active
                  ? sessionManager.endCurrentSession()
                  : sessionManager.startSession(d.deviceId)
              }
              title={d.friendlyName}
            />
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>3. getDevices() (with discoveryManager)</Text>
        <Text style={styles.description}>
          {"- Double devices\n- Cannot find devices after backgrounding app"}
        </Text>
        <Button onPress={getDevicesWithDiscoveryManager} title="Find devices" />

        {getDeviceResult?.map((d, index) => {
          const active = device?.deviceId === d.deviceId;

          return (
            <Button
              color={active ? "green" : undefined}
              key={d.deviceId + index}
              onPress={() =>
                active
                  ? sessionManager.endCurrentSession()
                  : sessionManager.startSession(d.deviceId)
              }
              title={d.friendlyName}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 128,
    paddingHorizontal: 16,
  },
  section: {
    minWidth: 200,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    paddingVertical: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 11,
    fontWeight: "normal",
    fontStyle: "italic",
    marginBottom: 16,
  },
});
