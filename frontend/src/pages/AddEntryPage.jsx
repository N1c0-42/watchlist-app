import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddMovieForm from "../components/AddMovieForm";

function AddEntryPage({
  movies,
  onAddMovie,
  onUpdateMovie,
  services,
}) {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const existingMovie = isEditMode
    ? movies.find((movie) => movie.id === Number(id))
    : null;

  // 🔍 TMDB Suche
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 📝 Formular-State (wird an AddMovieForm übergeben)
  const [prefillData, setPrefillData] = useState(existingMovie || null);

  useEffect(() => {
    // ❌ zu kurz oder leer → keine Suche
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchTmdb(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  async function searchTmdb(query) {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${import.meta.env.VITE_TMDB_API_KEY
        }&query=${encodeURIComponent(query)}&language=de-DE`
      );

      const data = await res.json();

      setSearchResults(
        (data.results || []).filter(
          (item) =>
            item.media_type === "movie" ||
            item.media_type === "tv"
        )
      );
    } catch (err) {
      console.error("TMDB search failed", err);
    } finally {
      setIsSearching(false);
    }
  }

  async function applyTmdbResult(item) {
    const baseData = {
      title: item.title || item.name,
      type: item.media_type === "movie" ? "film" : "serie",
      releaseYear: (
        item.release_date ||
        item.first_air_date ||
        ""
      ).slice(0, 4),
      imdbScore: "",
      duration: "",
    };

    setPrefillData(baseData);

    // 👉 Nur für Filme Details nachladen
    if (item.media_type === "movie") {
      await loadMovieDetails(item.id);
    }

    setSearchResults([]);
    setSearchQuery("");
  }

  async function loadMovieDetails(movieId) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_TMDB_API_KEY
        }&language=de-DE`
      );

      const data = await res.json();

      setPrefillData((prev) => ({
        ...prev,
        duration: data.runtime || "",
        imdbScore: data.vote_average
          ? Number(data.vote_average.toFixed(1))
          : "",
      }));
    } catch (err) {
      console.error("TMDB movie details failed", err);
    }
  }

  if (isEditMode && !existingMovie) {
    return <p>❌ Eintrag nicht gefunden.</p>;
  }

  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "0 auto",
        padding: "16px 0",
      }}
    >
      <h2 style={{ marginBottom: "8px" }}>
        {isEditMode ? "Eintrag bearbeiten" : "Neuer Eintrag"}
      </h2>

      <p
        style={{
          fontSize: "0.9em",
          opacity: 0.8,
          marginBottom: "16px",
        }}
      >
        {isEditMode
          ? "Bearbeite hier die Details des Eintrags."
          : "Lege hier neue Filme, Serien oder Dokus an."}
      </p>

      <div
        style={{
          padding: "16px",
          border: "1px solid #2a2a2a",
          borderRadius: "8px",
          backgroundColor: "#1a1a1a",
        }}
      >
        {/* 🔍 TMDB Suchfeld */}
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Film oder Serie suchen (TMDB)…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}

            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #333",
              background: "#111",
              color: "#e5e7eb",
            }}
          />
        </div>

        {/* 📋 Ergebnisliste */}
        {isSearching && (
          <div style={{ marginBottom: "8px", opacity: 0.7 }}>
            Suche…
          </div>
        )}

        {searchResults.length > 0 && (
          <div
            style={{
              border: "1px solid #333",
              borderRadius: "8px",
              marginBottom: "16px",
              overflow: "hidden",
            }}
          >
            {searchResults.slice(0, 6).map((item) => (
              <div
                key={`${item.media_type}-${item.id}`}
                onClick={() => applyTmdbResult(item)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #222",
                }}
              >
                <strong>
                  {item.title || item.name}
                </strong>{" "}
                <span style={{ opacity: 0.7 }}>
                  (
                  {(item.release_date ||
                    item.first_air_date ||
                    "").slice(0, 4)}
                  )
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 📝 Formular */}
        <AddMovieForm
          mode={isEditMode ? "edit" : "add"}
          initialData={prefillData}
          onAddMovie={onAddMovie}
          onUpdateMovie={onUpdateMovie}
          services={services}
        />
      </div>
    </div>
  );
}

export default AddEntryPage;
