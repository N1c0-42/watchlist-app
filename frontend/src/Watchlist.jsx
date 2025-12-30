import { useState, useEffect } from "react";

function Watchlist() {
  // 1️⃣ Beim Start aus localStorage lesen
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem("movies");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTitle, setNewTitle] = useState("");

  // 2️⃣ Bei jeder Änderung speichern
  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  function addMovie() {
    if (newTitle.trim() === "") return;

    const newMovie = {
      id: Date.now(),
      title: newTitle,
      isFavorite: false,
    };

    setMovies([...movies, newMovie]);
    setNewTitle("");
  }

  function deleteMovie(id) {
    setMovies(movies.filter((movie) => movie.id !== id));
  }

  function toggleFavorite(id) {
    setMovies(
      movies.map((movie) =>
        movie.id === id
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      )
    );
  }

  return (
    <div>
      <h2>Meine Watchlist</h2>

      <input
        type="text"
        placeholder="Filmtitel eingeben"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />

      <button onClick={addMovie}>Hinzufügen</button>

      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <span
              style={{
                fontWeight: movie.isFavorite ? "bold" : "normal",
              }}
            >
              {movie.title}
            </span>

            <button onClick={() => toggleFavorite(movie.id)}>❤️</button>
            <button onClick={() => deleteMovie(movie.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Watchlist;