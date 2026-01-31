import { getTodayISO } from "./dateUtils";

export function matchesTitle(movie, query) {
  if (!query) return true;

  return movie.title
    .toLowerCase()
    .includes(query.toLowerCase());
}

export function isAvailableNow(movie, subscriptions) {
  if (
    !movie.streamingService ||
    !subscriptions.includes(movie.streamingService)
  ) {
    return false;
  }

  const status = (movie.availabilityStatus || "")
    .trim()
    .toLowerCase();

  const today = getTodayISO();

  if (status === "available") {
    return true;
  }

  if (
    status === "scheduled" &&
    movie.availableFrom &&
    movie.availableFrom <= today
  ) {
    return true;
  }

  return false;
}

export function hasNoService(movie) {
  return !movie.streamingService;
}

