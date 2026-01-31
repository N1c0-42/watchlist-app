import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Pencil,
  Heart,
  HeartOff,
  Play,
  Star,
  Clock,
  Calendar,
} from "lucide-react";

import { isAvailableNow } from "../utils/filterUtils";
import "./MovieItem.css";

/* 🛠️ Helpers */

function formatDate(dateString) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}

function getAvailabilityInfo(movie) {
  switch ((movie.availabilityStatus || "").toLowerCase()) {
    case "available":
      return {
        label: "Bereits released",
        icon: <Calendar size={14} />,
      };

    case "scheduled":
      return {
        label: movie.availableFrom
          ? `Verfügbar ab ${formatDate(movie.availableFrom)}`
          : "Geplant",
        icon: <Calendar size={14} />,
      };

    default:
      return {
        label: "Datum unbekannt",
        icon: <Calendar size={14} />,
      };
  }
}

function MovieItem({
  movie,
  subscriptions,
  onToggleFavorite,
  onDelete,
}) {
  const navigate = useNavigate();

  // 🔑 EINZIGE Wahrheit für „jetzt verfügbar“
  const availableNow = isAvailableNow(movie, subscriptions);
  const availability = getAvailabilityInfo(movie);

  return (
    <li
      style={{
        padding: "12px",
        marginBottom: "10px",
        border: "1px solid #2a2a2a",
        borderRadius: "6px",
        backgroundColor: "#181818",
        listStyle: "none",
      }}
    >
      {/* 🎬 Titel */}
      <div
        style={{
          fontWeight: movie.isFavorite ? "bold" : "normal",
          color: movie.isFavorite ? "#ff5a5a" : "inherit",
        }}
      >
        {movie.title}
      </div>

      {/* 📊 Metadaten */}
      <div
        style={{
          fontSize: "0.85em",
          opacity: 0.8,
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginTop: "2px",
        }}
      >
        {movie.releaseYear && <span>{movie.releaseYear}</span>}

        {movie.imdbScore && (
          <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <Star size={14} /> {movie.imdbScore}
          </span>
        )}

        {movie.duration && movie.type === "film" && (
          <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <Clock size={14} /> {movie.duration} min
          </span>
        )}
      </div>

      {/* 📝 Verfügbarkeitsstatus */}
      <div
        style={{
          fontSize: "0.8em",
          opacity: 0.75,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginTop: "4px",
        }}
      >
        {availability.icon}
        <span>{availability.label}</span>
      </div>

      {/* 🏷️ Badges */}
      <div
        style={{
          marginTop: "6px",
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
        }}
      >
        {/* Typ */}
        <span
          style={{
            fontSize: "0.75em",
            padding: "2px 6px",
            borderRadius: "4px",
            backgroundColor: "#2a2a2a",
          }}
        >
          {movie.type.toUpperCase()}
        </span>

        {/* Streaming-Dienst */}
        {/* Streaming-Dienst oder kein Dienst */}
        {movie.streamingService ? (
          <span
            style={{
              fontSize: "0.75em",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: "#2563eb",
              color: "#e5e7eb",
            }}
          >
            {movie.streamingService.toUpperCase()}
          </span>
        ) : (
          <span
            style={{
              fontSize: "0.75em",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: "#3a3a3a",
              color: "#bdbdbd",
              fontStyle: "italic",
            }}
          >
            kein Dienst
          </span>
        )}

        {/* ▶️ NUR bei abonnierten Diensten */}
        {availableNow && (
          <span
            style={{
              fontSize: "0.75em",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: "#1f6f43",
              color: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Play size={12} /> verfügbar
          </span>
        )}
      </div>

      {/* 📝 Notizen */}
      {movie.notes && movie.notes.trim() !== "" && (
        <div className="movie-notes">
          {movie.notes}
        </div>
      )}

      {/* 🎛️ Aktionen */}
      <div className="movie-actions">
        <button
          onClick={() => navigate(`/edit/${movie.id}`)}
          title="Bearbeiten"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => onToggleFavorite(movie.id)}
          title="Favorit"
        >
          {movie.isFavorite ? (
            <Heart size={18} fill="currentColor" />
          ) : (
            <HeartOff size={18} />
          )}
        </button>

        <button
          onClick={() => onDelete(movie.id)}
          title="Löschen"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}

export default MovieItem;
