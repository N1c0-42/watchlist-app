import { useState, useEffect } from "react";

function AddMovieForm({
  mode = "add",
  initialData = null,
  onAddMovie,
  onUpdateMovie,
  services,
}) {
  // 📝 Felder
  const [title, setTitle] = useState("");
  const [type, setType] = useState("film");
  const [releaseYear, setReleaseYear] = useState("");
  const [imdbScore, setImdbScore] = useState("");
  const [duration, setDuration] = useState("");
  const [streamingService, setStreamingService] = useState("");

  const [availabilityStatus, setAvailabilityStatus] =
    useState("unknown");
  const [availableFrom, setAvailableFrom] = useState("");

  const [errors, setErrors] = useState({});

  // 🔁 Vorbefüllen
  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || "");
    setType(initialData.type || "film");
    setReleaseYear(initialData.releaseYear ?? "");
    setImdbScore(initialData.imdbScore ?? "");
    setDuration(initialData.duration ?? "");
    setStreamingService(initialData.streamingService || "");
    setAvailabilityStatus(
      initialData.availabilityStatus || "unknown"
    );
    setAvailableFrom(initialData.availableFrom || "");
  }, [initialData]);

  // 🧠 Zentrale Validierung
  function validate() {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Titel ist erforderlich.";
    }

    if (imdbScore !== "") {
      const score = Number(imdbScore);
      if (isNaN(score) || score < 0 || score > 10) {
        newErrors.imdbScore =
          "IMDB Score muss zwischen 0 und 10 liegen.";
      } else if (!Number.isInteger(score * 10)) {
        newErrors.imdbScore =
          "Maximal eine Nachkommastelle erlaubt.";
      }
    }

    if (releaseYear !== "") {
      const year = Number(releaseYear);
      if (
        !Number.isInteger(year) ||
        year < 1900 ||
        year > 3000
      ) {
        newErrors.releaseYear =
          "Jahr muss zwischen 1900 und 3000 liegen.";
      }
    }

    if (type === "film" && duration !== "") {
      const dur = Number(duration);
      if (isNaN(dur) || dur <= 0) {
        newErrors.duration =
          "Dauer muss eine positive Zahl sein.";
      }
    }

    if (
      availabilityStatus === "scheduled" &&
      !availableFrom
    ) {
      newErrors.availableFrom =
        "Bitte ein Datum angeben.";
    }

    return newErrors;
  }

  // 🔄 Live validieren
  useEffect(() => {
    setErrors(validate());
  }, [
    title,
    imdbScore,
    releaseYear,
    duration,
    type,
    availabilityStatus,
    availableFrom,
  ]);

  const isFormValid = Object.keys(errors).length === 0;

  // 📤 Submit
  function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    const data = {
      ...(initialData || {}),
      title: title.trim(),
      type,
      releaseYear: releaseYear ? Number(releaseYear) : null,
      imdbScore: imdbScore ? Number(imdbScore) : null,
      duration:
        type === "film" && duration
          ? Number(duration)
          : null,
      streamingService: streamingService || null,
      availabilityStatus,
      availableFrom:
        availabilityStatus === "scheduled"
          ? availableFrom
          : null,
    };

    if (mode === "edit") {
      onUpdateMovie(data);
    } else {
      onAddMovie(data);

      // Reset
      setTitle("");
      setType("film");
      setReleaseYear("");
      setImdbScore("");
      setDuration("");
      setStreamingService("");
      setAvailabilityStatus("unknown");
      setAvailableFrom("");
    }
  }

  // 🎨 Mini-Error-Text
  const errorStyle = {
    color: "#f87171",
    fontSize: "0.8em",
    marginTop: "2px",
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Titel */}
      <div>
        <label>Titel *</label><br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && (
          <div style={errorStyle}>{errors.title}</div>
        )}
      </div>

      {/* Typ */}
      <div>
        <label>Typ</label><br />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="film">Film</option>
          <option value="serie">Serie</option>
          <option value="doku">Doku</option>
        </select>
      </div>

      {/* Erscheinungsjahr */}
      <div>
        <label>Erscheinungsjahr</label><br />
        <input
          type="number"
          value={releaseYear}
          onChange={(e) =>
            setReleaseYear(e.target.value)
          }
        />
        {errors.releaseYear && (
          <div style={errorStyle}>
            {errors.releaseYear}
          </div>
        )}
      </div>

      {/* IMDB */}
      <div>
        <label>IMDB Score</label><br />
        <input
          type="number"
          step="0.1"
          value={imdbScore}
          onChange={(e) =>
            setImdbScore(e.target.value)
          }
        />
        {errors.imdbScore && (
          <div style={errorStyle}>
            {errors.imdbScore}
          </div>
        )}
      </div>

      {/* Dauer */}
      {type === "film" && (
        <div>
          <label>Dauer (Minuten)</label><br />
          <input
            type="number"
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
          />
          {errors.duration && (
            <div style={errorStyle}>
              {errors.duration}
            </div>
          )}
        </div>
      )}

      {/* Streaming-Dienst */}
      <div>
        <label>Streaming-Dienst</label><br />
        <select
          value={streamingService}
          onChange={(e) =>
            setStreamingService(e.target.value)
          }
        >
          <option value="">– kein Dienst –</option>
          {services.map((service) => (
            <option
              key={service.id}
              value={service.id}
            >
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Verfügbarkeit */}
      <div style={{ marginTop: "12px" }}>
        <label>
          <strong>Verfügbarkeit</strong>
        </label>

        <div>
          <label>
            <input
              type="radio"
              value="unknown"
              checked={
                availabilityStatus === "unknown"
              }
              onChange={(e) =>
                setAvailabilityStatus(e.target.value)
              }
            />
            Datum unbekannt
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              value="available"
              checked={
                availabilityStatus === "available"
              }
              onChange={(e) =>
                setAvailabilityStatus(e.target.value)
              }
            />
            Bereits verfügbar
          </label>
        </div>

        <div>
          <label>
            <input
              type="radio"
              value="scheduled"
              checked={
                availabilityStatus === "scheduled"
              }
              onChange={(e) =>
                setAvailabilityStatus(e.target.value)
              }
            />
            Verfügbar ab Datum
          </label>
        </div>
      </div>

      {availabilityStatus === "scheduled" && (
        <div>
          <input
            type="date"
            value={availableFrom}
            onChange={(e) =>
              setAvailableFrom(e.target.value)
            }
          />
          {errors.availableFrom && (
            <div style={errorStyle}>
              {errors.availableFrom}
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <div style={{ marginTop: "12px" }}>
        <button type="submit" disabled={!isFormValid}>
          {mode === "edit"
            ? "Änderungen speichern"
            : "Eintrag speichern"}
        </button>
      </div>
    </form>
  );
}

export default AddMovieForm;
