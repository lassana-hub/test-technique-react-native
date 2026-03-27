import axios from "axios";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTNmZDk0ZDA1MjM5MTAwMTUzMzAyYzMiLCJlbWFpbCI6Imxhc3NhbmFiYXJhZGppMTdAZ21haWwuY29tIiwiZXhwaXJhdGlvbkRhdGUiOiIyMDI2LTA3LTEwVDAwOjAwOjAwLjAwMFoiLCJpc1RyYWluaW5nIjp0cnVlLCJpYXQiOjE3NzQ2MTY2OTF9.fwqg_D-F3AmWaqtpQqVxY-jPFqcYc_lAS64rWzHJKHE";

export default function Movie() {
  const router = useRouter();
  const { id, title } = useLocalSearchParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) {
        setErrorMessage("Aucun film selectionne.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/allocine/movie/${id}`,
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
            },
          },
        );

        setMovie(response.data);
      } catch (error) {
        setErrorMessage("Impossible de recuperer les informations du film.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  if (errorMessage || !movie) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {errorMessage || "Film introuvable."}
        </Text>
      </View>
    );
  }

  const posterPath = movie.poster_path?.original || movie.thumbnail;
  const description = movie.synopsis || movie.overview;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: title || movie.title || "Movie" }} />

      {posterPath ? (
        <Image source={{ uri: posterPath }} style={styles.poster} />
      ) : null}

      <Text style={styles.title}>{movie.title}</Text>

      {description ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      ) : null}

      <Pressable
        style={styles.backButton}
        onPress={() => router.push("/popularMovies")}
      >
        <Text style={styles.backButtonText}>Retourner aux Films</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  container: {
    padding: 16,
    gap: 12,
  },
  poster: {
    width: "100%",
    height: 520,
    borderRadius: 18,
    backgroundColor: "#d1d5db",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  meta: {
    fontSize: 15,
    color: "#374151",
  },
  section: {
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
  backButton: {
    marginTop: 12,
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#046806",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f9fafb",
  },
  errorText: {
    fontSize: 16,
    color: "#b91c1c",
    textAlign: "center",
  },
});
