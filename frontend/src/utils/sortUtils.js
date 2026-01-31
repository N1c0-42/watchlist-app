export function sortMovies(list, sortBy, today) {
  const sorted = [...list];

  switch (sortBy) {
    case "favorites":
      sorted.sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));
      break;

    case "available":
      sorted.sort((a, b) => {
        const aAvail = a.availableFrom && a.availableFrom <= today;
        const bAvail = b.availableFrom && b.availableFrom <= today;
        return Number(bAvail) - Number(aAvail);
      });
      break;

    case "imdb":
      sorted.sort((a, b) => (b.imdbScore || 0) - (a.imdbScore || 0));
      break;

    case "year":
      sorted.sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
      break;

    case "title":
    default:
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return sorted;
}
