import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#111827",
        },
        headerTintColor: "#f9fafb",
        contentStyle: {
          backgroundColor: "#f3f4f6",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="popularMovies"
        options={{ title: "Popular Movies" }}
      />
      <Stack.Screen name="movie" options={{ title: "Movie" }} />
    </Stack>
  );
}
