import MovieItem from "./MovieItem";

function MovieList({
  movies,
  subscriptions,
  onToggleFavorite,
  onDelete,
}) {
  return (
    <ul style={{ padding: 0 }}>
      {movies.map((movie) => (
        <MovieItem
          key={movie.id}
          movie={movie}
          subscriptions={subscriptions}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default MovieList;
