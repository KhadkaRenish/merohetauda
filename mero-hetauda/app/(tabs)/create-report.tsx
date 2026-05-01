import { View, Text, StyleSheet } from "react-native";

export default function CreateReportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Report</Text>
      <Text style={styles.subtitle}>Report form will be added here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F6F8FB",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#64748B",
  },
});