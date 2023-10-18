import { useState, useEffect } from "react";

const KEY = "57235ff4";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          const response = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!response.ok)
            throw new Error("Something Went Wrong while fetching the movie");

          const data = await response.json();

          if (data.Response === "False")
            throw new Error("Please enter correct movie name");

          setMovies(data.Search);
        } catch (error) {
          if (error.name !== "AbortError") console.log(error.mesage);
          setError(error.mesage);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
