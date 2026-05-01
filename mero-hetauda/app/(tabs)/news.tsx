import { API_CONFIG } from "@/constants/api";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from "react-native";

type NewsArticle = {
  id: number;
  title: string;
  summary: string;
  source_name: string;
  original_url: string;
  image_url: string;
  category: string;
  published_at: string | null;
  created_at: string;
};

// For iPhone/Android testing, do not use 127.0.0.1.
// Replace this with your MacBook local IP address.


export default function NewsScreen() {
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNews = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await fetch(`${API_CONFIG.BASE_URL}/news/`);

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }

    const data = await response.json();

    console.log("NEWS API DATA:", data);

    if (Array.isArray(data)) {
      setNewsItems(data);
    } else if (Array.isArray(data.results)) {
      setNewsItems(data.results);
    } else {
      setNewsItems([]);
    }
  } catch (err) {
    console.log("NEWS FETCH ERROR:", err);
    setError("Unable to load news. Please check if Django server is running.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchNews();
  }, []);

  const openNewsLink = async (url: string) => {
    await Linking.openURL(url);
  };

  const formatDate = (dateValue: string | null) => {
    if (!dateValue) return "Recently";

    const date = new Date(dateValue);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCategory = (category: string) => {
    return category
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Local News</Text>
        <Text style={styles.subtitle}>
          Hetauda and Makwanpur related updates from local online sources.
        </Text>
      </View>

      {loading && (
        <View style={styles.centerCard}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.centerText}>Loading latest news...</Text>
        </View>
      )}

      {!loading && error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>News unavailable</Text>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable style={styles.retryButton} onPress={fetchNews}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error && newsItems.length === 0 && (
        <View style={styles.centerCard}>
          <Text style={styles.emptyTitle}>No news found</Text>
          <Text style={styles.centerText}>
            Once news is added from Django Admin or fetch script, it will appear here.
          </Text>
        </View>
      )}

      {!loading &&
        !error &&
        newsItems.map((item) => (
          <View key={item.id} style={styles.newsCard}>
            <View style={styles.topRow}>
              <Text style={styles.category}>{formatCategory(item.category)}</Text>
              <Text style={styles.date}>
                {formatDate(item.published_at || item.created_at)}
              </Text>
            </View>

            <Text style={styles.newsTitle}>{item.title}</Text>

            {item.summary ? (
              <Text style={styles.summary}>{item.summary}</Text>
            ) : (
              <Text style={styles.summary}>
                Tap Read More to view the full article from the original source.
              </Text>
            )}

            <View style={styles.bottomRow}>
              <Text style={styles.source}>Source: {item.source_name}</Text>

              <Pressable onPress={() => openNewsLink(item.original_url)}>
                <Text style={styles.readMore}>Read More</Text>
              </Pressable>
            </View>
          </View>
        ))}
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
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    marginTop: 6,
  },
  centerCard: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 22,
    alignItems: "center",
    marginTop: 10,
  },
  centerText: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    padding: 18,
    borderRadius: 22,
    marginBottom: 14,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#991B1B",
    marginBottom: 6,
  },
  errorText: {
    fontSize: 14,
    color: "#7F1D1D",
    lineHeight: 20,
    marginBottom: 14,
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  newsCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 22,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  category: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "900",
    backgroundColor: "#EAF1FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  date: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "700",
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8,
    lineHeight: 24,
  },
  summary: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 21,
    marginBottom: 14,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  source: {
    flex: 1,
    fontSize: 13,
    color: "#475569",
    fontWeight: "700",
  },
  readMore: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "900",
  },
});