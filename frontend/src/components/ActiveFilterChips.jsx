import {
  X,
  Star,
  Play,
  ArrowDownAZ,
  Filter,
} from "lucide-react";

export default function ActiveFilterChips({
  showFavoritesOnly,
  typeFilter,
  minImdbScore,
  maxDuration,
  showAvailableNow,
  showNoService,
  serviceFilters,
  services,
  titleQuery,
  sortBy,
  onClearFavorites,
  onClearType,
  onClearImdb,
  onClearDuration,
  onClearAvailable,
  onClearNoService,
  onClearService,
  onClearTitle,
  onClearSort,

}) {
  const chips = [];

  if (titleQuery) {
    chips.push({
      label: `Titel: "${titleQuery}"`,
      icon: <Filter size={14} />,
      onClear: onClearTitle,
    });
  }

  if (showFavoritesOnly) {
    chips.push({
      label: "Favoriten",
      icon: <Star size={14} />,
      onClear: onClearFavorites,
    });
  }

  if (typeFilter !== "all") {
    chips.push({
      label:
        typeFilter === "film"
          ? "Film"
          : typeFilter === "serie"
            ? "Serie"
            : "Doku",
      icon: <Filter size={14} />,
      onClear: onClearType,
    });
  }

  if (minImdbScore !== "") {
    chips.push({
      label: `IMDB ≥ ${minImdbScore}`,
      icon: <Star size={14} />,
      onClear: onClearImdb,
    });
  }

  if (maxDuration !== "") {
    chips.push({
      label: `Dauer ≤ ${maxDuration} min`,
      icon: <Filter size={14} />,
      onClear: onClearDuration,
    });
  }

  if (showAvailableNow) {
    chips.push({
      label: "Jetzt verfügbar",
      icon: <Play size={14} />,
      onClear: onClearAvailable,
    });
  }

  if (showNoService) {
    chips.push({
      label: "ohne Dienst",
      icon: <Filter size={14} />,
      onClear: onClearNoService,
    });
  }

  serviceFilters.forEach((serviceId) => {
    const service = services.find(
      (s) => s.id === serviceId
    );
    if (service) {
      chips.push({
        label: service.name,
        icon: <Filter size={14} />,
        onClear: () => onClearService(serviceId),
      });
    }
  });

  // 🔃 Sortier-Chip (nur wenn NICHT Standard A–Z)
  if (sortBy && sortBy !== "title") {
    const labelMap = {
      favorites: "Favoriten zuerst",
      available: "Jetzt verfügbar zuerst",
      imdb: "IMDB ↓",
      year: "Jahr ↓",
    };

    chips.push({
      label: `Sortierung: ${labelMap[sortBy]}`,
      icon: <ArrowDownAZ size={14} />,
      onClear: onClearSort,
    });
  }

  if (chips.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginBottom: "16px",
      }}
    >
      {chips.map((chip, index) => (
        <button
          key={index}
          onClick={chip.onClear}
          title="Filter entfernen"
          style={{
            background: "#1f2933",
            color: "#e5e7eb",
            border: "1px solid #374151",
            borderRadius: 999,
            padding: "6px 10px",
            fontSize: 13,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {chip.icon}
          <span>{chip.label}</span>
          <X size={14} style={{ opacity: 0.7 }} />
        </button>
      ))}
    </div>
  );
}
