import MovieList from "./components/MovieList";
import ActiveFilterChips from "./components/ActiveFilterChips";

import {
  matchesTitle,
  isAvailableNow,
  hasNoService,
} from "./utils/filterUtils";
import { sortMovies } from "./utils/sortUtils";
import usePersistentState from "./hooks/usePersistentState";

const FILTER_STORAGE_KEY = "watchlistFilters";

function Watchlist({
  movies,
  subscriptions,
  onToggleFavorite,
  onDelete,
}) {
  // 🎛️ Alle Filter zentral & persistent
  const [filters, setFilters] = usePersistentState(
    FILTER_STORAGE_KEY,
    {
      // Status
      showFavoritesOnly: false,
      showAvailableNow: false,
      showNoService: false,

      // Metadaten
      typeFilter: "all",
      minImdbScore: "",
      maxDuration: "",

      // Dienste
      serviceFilters: [],

      // Suche & Sortierung
      titleQuery: "",
      sortBy: "title",
    }
  );

  const {
    showFavoritesOnly,
    showAvailableNow,
    showNoService,
    typeFilter,
    minImdbScore,
    maxDuration,
    serviceFilters,
    titleQuery,
    sortBy,
  } = filters;

  // 🧮 Filterlogik
  const filteredMovies = movies.filter((movie) => {
    if (!matchesTitle(movie, titleQuery)) return false;

    if (showFavoritesOnly && !movie.isFavorite)
      return false;

    if (
      showAvailableNow &&
      !isAvailableNow(movie, subscriptions)
    ) {
      return false;
    }

    if (
      showNoService &&
      serviceFilters.length === 0 &&
      !hasNoService(movie)
    ) {
      return false;
    }

    if (typeFilter !== "all" && movie.type !== typeFilter)
      return false;

    if (
      minImdbScore !== "" &&
      (movie.imdbScore == null ||
        movie.imdbScore < Number(minImdbScore))
    ) {
      return false;
    }

    if (
      maxDuration !== "" &&
      movie.type === "film" &&
      (movie.duration == null ||
        movie.duration > Number(maxDuration))
    ) {
      return false;
    }

    if (
      serviceFilters.length > 0 &&
      !serviceFilters.includes(movie.streamingService)
    ) {
      return false;
    }

    return true;
  });

  const sortedMovies = sortMovies(filteredMovies, sortBy);

  // 🔄 Reset
  function resetFilters() {
    setFilters({
      showFavoritesOnly: false,
      showAvailableNow: false,
      showNoService: false,
      typeFilter: "all",
      minImdbScore: "",
      maxDuration: "",
      serviceFilters: [],
      titleQuery: "",
      sortBy: "title",
    });
  }

  // 🎨 kleiner Helper für Filter-Buttons
  const filterButtonStyle = (active) => ({
    padding: "6px 12px",
    borderRadius: "999px",
    border: "1px solid #333",
    background: active ? "#2563eb" : "#1a1a1a",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: "13px",
  });

  return (
    <div>
      <h2>Meine Watchlist</h2>

      {/* 🔍 FILTER */}
      <div
        style={{
          marginTop: "16px",
          marginBottom: "24px",
          padding: "16px",
          border: "1px solid #2a2a2a",
          borderRadius: "8px",
          backgroundColor: "#1a1a1a",
        }}
      >
        {/* 🔎 Suche & Sortierung */}
        <h4 style={{ opacity: 0.85 }}>Suche & Sortierung</h4>

        <input
          type="text"
          placeholder="Titel suchen…"
          value={titleQuery}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              titleQuery: e.target.value,
            }))
          }
          style={{
            width: "100%",
            marginTop: "6px",
            padding: "6px 8px",
          }}
        />

        <div style={{ marginTop: "8px" }}>
          <label>Sortieren: </label>
          <select
            value={sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value,
              }))
            }
          >
            <option value="title">Titel (A–Z)</option>
            <option value="favorites">
              Favoriten zuerst
            </option>
            <option value="available">
              Jetzt verfügbar zuerst
            </option>
            <option value="imdb">
              IMDB (hoch → niedrig)
            </option>
            <option value="year">
              Jahr (neu → alt)
            </option>
          </select>
        </div>

        {/* 🎯 Status */}
        <h4 style={{ marginTop: "18px", opacity: 0.85 }}>
          Status
        </h4>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <button
            style={filterButtonStyle(showFavoritesOnly)}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                showFavoritesOnly:
                  !prev.showFavoritesOnly,
              }))
            }
          >
            Nur Favoriten
          </button>

          <button
            style={filterButtonStyle(showAvailableNow)}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                showAvailableNow:
                  !prev.showAvailableNow,
              }))
            }
          >
            Jetzt verfügbar
          </button>

          <button
            style={filterButtonStyle(showNoService)}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                showNoService: !prev.showNoService,
              }))
            }
          >
            Ohne Dienst
          </button>
        </div>

        {/* 🎬 Metadaten */}
        <h4 style={{ marginTop: "18px", opacity: 0.85 }}>
          Metadaten
        </h4>

        <div style={{ marginTop: "6px" }}>
          <label>Typ: </label>
          <select
            value={typeFilter}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                typeFilter: e.target.value,
              }))
            }
          >
            <option value="all">Alle</option>
            <option value="film">Film</option>
            <option value="serie">Serie</option>
            <option value="doku">Doku</option>
          </select>
        </div>

        <div style={{ marginTop: "6px" }}>
          <label>IMDB ≥ </label>
          <input
            type="number"
            step="0.1"
            value={minImdbScore}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minImdbScore: e.target.value,
              }))
            }
            style={{ width: "80px" }}
          />

          <label style={{ marginLeft: "10px" }}>
            Dauer ≤
          </label>
          <input
            type="number"
            value={maxDuration}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxDuration: e.target.value,
              }))
            }
            style={{ width: "70px" }}
          />
        </div>

        {/* 📺 Streaming-Dienste */}
        <h4 style={{ marginTop: "18px", opacity: 0.85 }}>
          Streaming-Dienste
        </h4>

        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            marginTop: "6px",
          }}
        >
          {subscriptions.map((serviceId) => {
            const active =
              serviceFilters.includes(serviceId);

            return (
              <button
                key={serviceId}
                style={filterButtonStyle(active)}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    serviceFilters: active
                      ? prev.serviceFilters.filter(
                          (s) => s !== serviceId
                        )
                      : [
                          ...prev.serviceFilters,
                          serviceId,
                        ],
                  }))
                }
              >
                {serviceId}
              </button>
            );
          })}
        </div>

        {/* 🔄 Reset */}
        <div style={{ marginTop: "16px" }}>
          <button
            onClick={resetFilters}
            style={{
              background: "transparent",
              border: "1px dashed #444",
              color: "#9ca3af",
              fontSize: "13px",
            }}
          >
            🔄 Filter zurücksetzen
          </button>
        </div>
      </div>

      {/* 🧩 Aktive Filter */}
      <ActiveFilterChips
        showFavoritesOnly={showFavoritesOnly}
        showAvailableNow={showAvailableNow}
        showNoService={showNoService}
        typeFilter={typeFilter}
        minImdbScore={minImdbScore}
        maxDuration={maxDuration}
        serviceFilters={serviceFilters}
        services={subscriptions.map((id) => ({
          id,
          name:
            id.charAt(0).toUpperCase() + id.slice(1),
        }))}
        titleQuery={titleQuery}
        sortBy={sortBy}
        onClearFavorites={() =>
          setFilters((p) => ({
            ...p,
            showFavoritesOnly: false,
          }))
        }
        onClearAvailable={() =>
          setFilters((p) => ({
            ...p,
            showAvailableNow: false,
          }))
        }
        onClearNoService={() =>
          setFilters((p) => ({
            ...p,
            showNoService: false,
          }))
        }
        onClearType={() =>
          setFilters((p) => ({
            ...p,
            typeFilter: "all",
          }))
        }
        onClearImdb={() =>
          setFilters((p) => ({
            ...p,
            minImdbScore: "",
          }))
        }
        onClearDuration={() =>
          setFilters((p) => ({
            ...p,
            maxDuration: "",
          }))
        }
        onClearService={(id) =>
          setFilters((p) => ({
            ...p,
            serviceFilters: p.serviceFilters.filter(
              (s) => s !== id
            ),
          }))
        }
        onClearTitle={() =>
          setFilters((p) => ({
            ...p,
            titleQuery: "",
          }))
        }
        onClearSort={() =>
          setFilters((p) => ({
            ...p,
            sortBy: "title",
          }))
        }
      />

      <MovieList
        movies={sortedMovies}
        subscriptions={subscriptions}
        onToggleFavorite={onToggleFavorite}
        onDelete={onDelete}
      />
    </div>
  );
}

export default Watchlist;
