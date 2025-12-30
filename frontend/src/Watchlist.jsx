import { useState, useEffect } from "react";

function Watchlist() {
  // ✅ State 1: Filme (aus localStorage)
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem("movies");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ State 2: Eingabefeld
  const [newTitle, setNewTitle] = useState("");

  // ✅ State 3: Favoriten-Filter
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // ✅ Bei jeder Änderung speichern
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

  // ✅ Gefilterte Anzeige (nur Darstellung!)
  const filteredMovies = showFavoritesOnly
    ? movies.filter((movie) => movie.isFavorite)
    : movies;

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

      <button
        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        style={{ marginTop: "10px" }}
      >
        {showFavoritesOnly ? "Alle anzeigen" : "Nur Favoriten ❤️"}
      </button>

      {filteredMovies.length === 0 && (
        <p style={{ marginTop: "10px" }}>
          Keine Filme in der Watchlist 🎬
        </p>
      )}

      <ul style={{ marginTop: "10px" }}>
        {filteredMovies.map((movie) => (
          <li key={movie.id}>
            <span
              style={{
                fontWeight: movie.isFavorite ? "bold" : "normal",
              }}
            >
              {movie.title}
            </span>

            <button
              onClick={() => toggleFavorite(movie.id)}
              style={{ marginLeft: "8px" }}
            >
              ❤️
            </button>
            <button
              onClick={() => deleteMovie(movie.id)}
              style={{ marginLeft: "4px" }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Watchlist;
