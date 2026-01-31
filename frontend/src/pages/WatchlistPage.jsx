import Watchlist from "../Watchlist";

function WatchlistPage({
  movies,
  subscriptions,
  onToggleFavorite,
  onDelete,
}) {
  return (
    <Watchlist
      movies={movies}
      subscriptions={subscriptions}
      onToggleFavorite={onToggleFavorite}
      onDelete={onDelete}
    />
  );
}

export default WatchlistPage;
