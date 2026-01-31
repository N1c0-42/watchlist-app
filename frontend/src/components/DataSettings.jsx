import { useRef } from "react";

function DataSettings({
  movies,
  services,
  subscriptions,
  onImportData,
  onShowToast,
}) {
  const fileInputRef = useRef(null);

  // 📤 EXPORT
  function handleExport() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        movies,
        services,
        subscriptions,
      },
    };

    const blob = new Blob(
      [JSON.stringify(payload, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "watchlist-backup.json";
    link.click();

    URL.revokeObjectURL(url);
    onShowToast?.("Daten exportiert");
  }

  // 📥 IMPORT (Replace oder Merge)
  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);

        if (
          !parsed?.data ||
          !Array.isArray(parsed.data.movies) ||
          !Array.isArray(parsed.data.services) ||
          !Array.isArray(parsed.data.subscriptions)
        ) {
          throw new Error("Ungültiges Dateiformat");
        }

        const mode = window.prompt(
          'Import-Modus wählen:\n\n"replace" = Alles ersetzen\n"merge" = Zusammenführen',
          "merge"
        );

        if (!mode) return;

        if (mode === "replace") {
          onImportData({
            movies: parsed.data.movies,
            services: parsed.data.services,
            subscriptions: parsed.data.subscriptions,
          });

          onShowToast?.("Daten ersetzt");
          return;
        }

        if (mode === "merge") {
          // 🎬 Movies mergen
          const movieMap = new Map(
            movies.map((m) => [m.id, m])
          );

          parsed.data.movies.forEach((m) => {
            if (!movieMap.has(m.id)) {
              movieMap.set(m.id, m);
            }
          });

          // 📺 Services mergen
          const serviceMap = new Map(
            services.map((s) => [s.id, s])
          );

          parsed.data.services.forEach((s) => {
            if (!serviceMap.has(s.id)) {
              serviceMap.set(s.id, s);
            }
          });

          // ⭐ Subscriptions vereinigen
          const mergedSubscriptions = Array.from(
            new Set([
              ...subscriptions,
              ...parsed.data.subscriptions,
            ])
          );

          onImportData({
            movies: Array.from(movieMap.values()),
            services: Array.from(serviceMap.values()),
            subscriptions: mergedSubscriptions,
          });

          onShowToast?.("Daten zusammengeführt");
          return;
        }

        onShowToast?.(
          "Import abgebrochen – ungültige Auswahl",
          "error"
        );
      } catch (err) {
        console.error(err);
        onShowToast?.(
          "Import fehlgeschlagen – ungültige Datei",
          "error"
        );
      } finally {
        e.target.value = "";
      }
    };

    reader.readAsText(file);
  }

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "16px",
        border: "1px solid #2a2a2a",
        borderRadius: "8px",
        backgroundColor: "#1a1a1a",
      }}
    >
      <h3>Daten</h3>

      <p style={{ fontSize: "0.85em", opacity: 0.75 }}>
        Exportiere deine Watchlist als Backup oder importiere
        sie (Ersetzen oder Zusammenführen).
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button onClick={handleExport}>
          📤 Exportieren
        </button>

        <button
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          📥 Importieren
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={handleImportFile}
        />
      </div>
    </div>
  );
}

export default DataSettings;
