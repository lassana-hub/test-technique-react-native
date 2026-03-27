import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const API_URL =
  "https://lereacteur-bootcamp-api.herokuapp.com/api/allocine/movies/popular";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTNmZDk0ZDA1MjM5MTAwMTUzMzAyYzMiLCJlbWFpbCI6Imxhc3NhbmFiYXJhZGppMTdAZ21haWwuY29tIiwiZXhwaXJhdGlvbkRhdGUiOiIyMDI2LTA3LTEwVDAwOjAwOjAwLjAwMFoiLCJpc1RyYWluaW5nIjp0cnVlLCJpYXQiOjE3NzQ2MTY2OTF9.fwqg_D-F3AmWaqtpQqVxY-jPFqcYc_lAS64rWzHJKHE";

export default function PopularMovies() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getMovieId = (movie) => movie.code || movie.id || movie.movieId || null;
  const getMovieKey = (movie, index) =>
    String(
      getMovieId(movie) ||
        movie.slug ||
        movie.title ||
        movie.originalTitle ||
        `movie-${index}`,
    );

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        setMovies(response.data.results || []);

        console.log(response.data.results[0].poster_path);
      } catch (error) {
        setErrorMessage("Impossible de recuperer les films populaires.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item, index) => getMovieKey(item, index)}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const posterPath = item.poster_path?.original || item.thumbnail;
        const movieId = getMovieId(item);

        return (
          <Pressable
            style={styles.card}
            disabled={!movieId}
            onPress={() => {
              if (!movieId) {
                return;
              }

              router.push({
                pathname: "/movie",
                params: { id: movieId, title: item.title },
              });
            }}
          >
            {posterPath ? (
              <Image source={{ uri: posterPath }} style={styles.poster} />
            ) : (
              <View style={[styles.poster, styles.posterPlaceholder]}>
                <Text style={styles.posterPlaceholderText}>No image</Text>
              </View>
            )}

            <View style={styles.cardBody}>
              <Text style={styles.title}>{item.title}</Text>

              {item.overview ? (
                <Text numberOfLines={4} style={styles.overview}>
                  {item.overview}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  poster: {
    width: 100,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#d1d5db",
  },
  posterPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  posterPlaceholderText: {
    color: "#4b5563",
    fontWeight: "600",
  },
  cardBody: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  meta: {
    fontSize: 14,
    color: "#4b5563",
  },
  overview: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: "#b91c1c",
    textAlign: "center",
  },
});
