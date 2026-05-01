import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

const USE_MOCK_DATA = true;

const mockStats = {
  totalReports: 128,
  inProgress: 42,
  resolved: 31,
};

const mockRecentUpdates = [
  {
    id: 1,
    category: "Road",
    title: "Road damage near Main Chowk",
    description: "The issue has been reviewed and forwarded for repair planning.",
    status: "In Progress",
  },
  {
    id: 2,
    category: "Electricity",
    title: "Street light not working",
    description: "The report has been marked as reviewed by the admin team.",
    status: "Reviewed",
  },
];

const categories = [
  { icon: "🛣️", title: "Road", subtitle: "Potholes & damage" },
  { icon: "🗑️", title: "Waste", subtitle: "Garbage issues" },
  { icon: "💧", title: "Water", subtitle: "Supply & leakage" },
  { icon: "💡", title: "Electricity", subtitle: "Street lights" },
  { icon: "🌳", title: "Environment", subtitle: "Parks & pollution" },
  { icon: "➕", title: "Others", subtitle: "Other concerns" },
];

export default function HomeScreen() {
  const stats = USE_MOCK_DATA ? mockStats : null;
  const recentUpdates = USE_MOCK_DATA ? mockRecentUpdates : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.appName}>Hetauda Civic</Text>
        </View>

        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>📍 Hetauda</Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Community Reporting</Text>
        </View>

        <Text style={styles.heroTitle}>
          Report local problems and follow their progress
        </Text>

        <Text style={styles.heroSubtitle}>
          Raise issues about roads, waste, water, electricity, environment, and
          other public concerns in your community.
        </Text>

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/create-report")}
          >
            <Text style={styles.primaryButtonText}>Report Issue</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/reports")}
          >
            <Text style={styles.secondaryButtonText}>View Reports</Text>
          </Pressable>
        </View>
      </View>

      {stats && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalReports}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Report Categories</Text>
        <Text style={styles.sectionSubtitle}>Choose the type of issue</Text>
      </View>

      <View style={styles.categoryGrid}>
        {categories.map((item) => (
          <View key={item.title} style={styles.categoryCard}>
            <View style={styles.categoryIconBox}>
              <Text style={styles.categoryIcon}>{item.icon}</Text>
            </View>

            <Text style={styles.categoryTitle}>{item.title}</Text>
            <Text style={styles.categorySubtitle}>{item.subtitle}</Text>
          </View>
        ))}
      </View>

      {recentUpdates.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
            <Text style={styles.sectionSubtitle}>
              Latest activity from the community
            </Text>
          </View>

          {recentUpdates.map((item) => (
            <View key={item.id} style={styles.updateCard}>
              <View style={styles.updateTopRow}>
                <Text style={styles.updateCategory}>{item.category}</Text>

                <Text
                  style={
                    item.status === "In Progress"
                      ? styles.statusProgress
                      : styles.statusReviewed
                  }
                >
                  {item.status}
                </Text>
              </View>

              <Text style={styles.updateTitle}>{item.title}</Text>
              <Text style={styles.updateDescription}>{item.description}</Text>
            </View>
          ))}
        </>
      )}

      <View style={styles.newsCard}>
        <Text style={styles.newsLabel}>Local News</Text>
        <Text style={styles.newsTitle}>Hetauda updates coming soon</Text>
        <Text style={styles.newsText}>
          News and public notices will be added after the report system is ready.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  greeting: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  appName: {
    fontSize: 26,
    color: "#0F172A",
    fontWeight: "900",
    marginTop: 2,
  },
  locationBadge: {
    backgroundColor: "#EAF1FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  locationText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "800",
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    marginBottom: 18,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: "#047857",
    fontSize: 12,
    fontWeight: "900",
  },
  heroTitle: {
    fontSize: 28,
    color: "#0F172A",
    fontWeight: "900",
    lineHeight: 35,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 23,
    marginBottom: 22,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "900",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "700",
    marginTop: 3,
  },
  sectionHeader: {
    marginBottom: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#0F172A",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 3,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 26,
  },
  categoryCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    minHeight: 130,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  categoryIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  updateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  updateTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  updateCategory: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "900",
  },
  statusProgress: {
    fontSize: 12,
    color: "#B45309",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontWeight: "900",
  },
  statusReviewed: {
    fontSize: 12,
    color: "#0369A1",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontWeight: "900",
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 6,
  },
  updateDescription: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  newsCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 20,
    marginTop: 14,
  },
  newsLabel: {
    fontSize: 13,
    color: "#93C5FD",
    fontWeight: "900",
    marginBottom: 6,
  },
  newsTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "900",
    marginBottom: 6,
  },
  newsText: {
    fontSize: 14,
    color: "#CBD5E1",
    lineHeight: 21,
  },
});