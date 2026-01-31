import { Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";
import WatchlistPage from "./pages/WatchlistPage";
import AddEntryPage from "./pages/AddEntryPage";
import ServicesPage from "./pages/ServicesPage";
import Toast from "./components/Toast";

import usePersistentState from "./hooks/usePersistentState";
import DataSettings from "./components/DataSettings";

function App() {
  // 🎬 Watchlist-Einträge
  const [movies, setMovies] = usePersistentState("movies", []);

  // 📺 Streaming-Dienste
  const defaultServices = [
    { id: "netflix", name: "Netflix" },
    { id: "prime", name: "Amazon Prime" },
    { id: "disney", name: "Disney+" },
    { id: "apple", name: "Apple TV+" },
    { id: "kino", name: "Kino" },
  ];

  const [services, setServices] = usePersistentState(
    "services",
    defaultServices
  );

  // ⭐ Abonnierte Dienste (IDs)
  const defaultSubscriptions = ["netflix", "prime"];

  const [subscriptions, setSubscriptions] =
    usePersistentState(
      "subscriptions",
      defaultSubscriptions
    );

  // 🔔 Toast + Undo
  const [toast, setToast] = usePersistentState(
    "toast",
    null
  );
  const [undoData, setUndoData] = usePersistentState(
    "undoData",
    null
  );

  // 🔔 Toast Helper
  function showToast(message, type = "success", actionLabel) {
    setToast({ message, type, actionLabel });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  // ➕ Neuer Eintrag
  function addMovie(data) {
    const newMovie = {
      id: Date.now(),
      isFavorite: false,
      ...data,
    };

    setMovies((prev) => [...prev, newMovie]);
    showToast("Eintrag gespeichert");
  }

  // ✏️ Eintrag bearbeiten
  function updateMovie(updatedMovie) {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === updatedMovie.id
          ? updatedMovie
          : movie
      )
    );
    showToast("Eintrag aktualisiert");
  }

  // ❤️ Favorit umschalten
  function toggleFavorite(id) {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? {
            ...movie,
            isFavorite: !movie.isFavorite,
          }
          : movie
      )
    );
  }

  // ❌ Eintrag löschen (mit Undo)
  function deleteMovie(id) {
    const movieToDelete = movies.find(
      (m) => m.id === id
    );
    if (!movieToDelete) return;

    setMovies((prev) =>
      prev.filter((m) => m.id !== id)
    );

    if (undoData?.timeoutId) {
      clearTimeout(undoData.timeoutId);
    }

    const timeoutId = setTimeout(() => {
      setUndoData(null);
      setToast(null);
    }, 5000);

    setUndoData({ movie: movieToDelete, timeoutId });

    setToast({
      message: "Eintrag gelöscht",
      type: "success",
      actionLabel: "Rückgängig",
    });
  }

  function undoDelete() {
    if (!undoData) return;

    clearTimeout(undoData.timeoutId);

    setMovies((prev) => [
      ...prev,
      undoData.movie,
    ]);
    setUndoData(null);
    setToast(null);
  }

  function handleImportData({ movies, services, subscriptions }) {
    setMovies(movies);
    setServices(services);
    setSubscriptions(subscriptions);
  }

  return (
    <>
      {/* 🔝 Navigation */}
      <Navigation />

      {/* 📦 Content */}
      <div
        className="app"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "16px",
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <WatchlistPage
                movies={movies}
                subscriptions={subscriptions}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteMovie}
              />
            }
          />

          <Route
            path="/add"
            element={
              <AddEntryPage
                movies={movies}
                onAddMovie={addMovie}
                onUpdateMovie={updateMovie}
                services={services}
              />
            }
          />

          <Route
            path="/edit/:id"
            element={
              <AddEntryPage
                movies={movies}
                onAddMovie={addMovie}
                onUpdateMovie={updateMovie}
                services={services}
              />
            }
          />

          <Route
            path="/services"
            element={
              <>
                <ServicesPage
                  services={services}
                  setServices={setServices}
                  subscriptions={subscriptions}
                  setSubscriptions={setSubscriptions}
                  movies={movies}
                />

                <DataSettings
                  movies={movies}
                  services={services}
                  subscriptions={subscriptions}
                  onImportData={handleImportData}
                  onShowToast={showToast}
                />
              </>
            }
          />
        </Routes>
      </div>

      {/* 🔔 Global Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          actionLabel={toast.actionLabel}
          onAction={undoDelete}
        />
      )}
    </>
  );
}

export default App;
