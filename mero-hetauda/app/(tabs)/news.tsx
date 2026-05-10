import { API_CONFIG } from "@/constants/api";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const imageHeight = Math.min(230, Math.max(176, width * 0.48));

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

export default function NewsScreen() {
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openNewsLink = async (url?: string) => {
    if (!url) return;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
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
    if (!category) return "Local";

    return category
      .replace("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchNews(true)}
          tintColor="#0F766E"
          colors={["#0F766E"]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <View style={styles.headerAccent} />
        <Text style={styles.title}>Local News</Text>
        <Text style={styles.subtitle}>
          Hetauda and Makwanpur related updates from local online sources.
        </Text>
      </Animated.View>

      {loading && (
        <Animated.View entering={FadeInDown.duration(450)} style={styles.centerCard}>
          <ActivityIndicator size="large" color="#0F766E" />
          <Text style={styles.centerText}>Loading latest news...</Text>
          <View style={styles.loadingLine} />
          <View style={[styles.loadingLine, styles.loadingLineShort]} />
        </Animated.View>
      )}

      {!loading && error ? (
        <Animated.View entering={FadeInDown.duration(450)} style={styles.errorCard}>
          <Text style={styles.errorTitle}>News unavailable</Text>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable style={styles.retryButton} onPress={() => fetchNews()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </Animated.View>
      ) : null}

      {!loading && !error && newsItems.length === 0 && (
        <Animated.View entering={FadeInDown.duration(450)} style={styles.centerCard}>
          <Text style={styles.emptyTitle}>No news found</Text>
          <Text style={styles.centerText}>
            Once news is added from Django Admin or fetch script, it will appear here.
          </Text>
        </Animated.View>
      )}

      {!loading &&
        !error &&
        newsItems.map((item, index) => (
          <Animated.View
            key={item.id}
            entering={FadeInDown.delay(index * 80).springify().damping(16)}
            style={styles.newsCard}
          >
            <Pressable
              onPress={() => openNewsLink(item.original_url)}
              android_ripple={{ color: "#E0F2F1" }}
              style={({ pressed }) => [
                styles.cardPressable,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.imageWrap}>
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.newsImage}
                    contentFit="cover"
                    transition={350}
                  />
                ) : (
                  <View style={styles.imageFallback}>
                    <Text style={styles.imageFallbackText}>Mero Hetauda</Text>
                  </View>
                )}

                <View style={styles.imageOverlay} />
                <View style={styles.floatingMeta}>
                  <Text style={styles.category}>{formatCategory(item.category)}</Text>
                  <Text style={styles.date}>
                    {formatDate(item.published_at || item.created_at)}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.newsTitle}>{item.title}</Text>

                <Text style={styles.summary} numberOfLines={3}>
                  {item.summary ||
                    "Tap Read More to view the full article from the original source."}
                </Text>

                <View style={styles.bottomRow}>
                  <View style={styles.sourcePill}>
                    <Text style={styles.source} numberOfLines={1}>
                      {item.source_name || "Local source"}
                    </Text>
                  </View>

                  <View style={styles.readMoreButton}>
                    <Text style={styles.readMore}>Read More</Text>
                    <Text style={styles.readMoreArrow}>›</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7F6",
  },
  content: {
    padding: 18,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: "#0F172A",
    borderRadius: 28,
    marginBottom: 18,
    overflow: "hidden",
    padding: 22,
  },
  headerAccent: {
    position: "absolute",
    right: -42,
    top: -52,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#14B8A6",
    opacity: 0.24,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 15,
    color: "#CBD5E1",
    lineHeight: 22,
    marginTop: 6,
  },
  centerCard: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
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
  loadingLine: {
    width: "82%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    marginTop: 18,
  },
  loadingLineShort: {
    width: "58%",
    marginTop: 8,
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    padding: 18,
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
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
    borderRadius: 14,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  newsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    marginBottom: 18,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
    overflow: "hidden",
  },
  cardPressable: {
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.88,
  },
  imageWrap: {
    height: imageHeight,
    backgroundColor: "#D9E8E4",
  },
  newsImage: {
    width: "100%",
    height: "100%",
  },
  imageFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#134E4A",
  },
  imageFallbackText: {
    color: "#CCFBF1",
    fontSize: 18,
    fontWeight: "900",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.18)",
  },
  floatingMeta: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  category: {
    fontSize: 12,
    color: "#ECFEFF",
    fontWeight: "900",
    backgroundColor: "rgba(15, 118, 110, 0.9)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
  },
  date: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "900",
    backgroundColor: "rgba(15, 23, 42, 0.58)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
  },
  cardBody: {
    padding: 18,
  },
  newsTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 8,
    lineHeight: 25,
  },
  summary: {
    fontSize: 14,
    color: "#526371",
    lineHeight: 22,
    marginBottom: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sourcePill: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  source: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "800",
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F766E",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 5,
  },
  readMore: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "900",
  },
  readMoreArrow: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 20,
  },
});
