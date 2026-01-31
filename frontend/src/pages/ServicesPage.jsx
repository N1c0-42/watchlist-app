import { useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";

function ServicesPage({
  services,
  setServices,
  subscriptions,
  setSubscriptions,
  movies = [], // optional, für Warnhinweise
}) {
  const [newServiceName, setNewServiceName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");

  // ➕ Dienst hinzufügen
  function handleAddService() {
    const name = newServiceName.trim();
    if (!name) return;

    const id = name.toLowerCase().replace(/\s+/g, "-");

    if (services.some((s) => s.id === id)) {
      setNewServiceName("");
      return;
    }

    setServices((prev) => [...prev, { id, name }]);
    setNewServiceName("");
  }

  // ✏️ Editieren
  function startEdit(service) {
    setEditingId(service.id);
    setTempName(service.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setTempName("");
  }

  function saveEdit(serviceId) {
    const name = tempName.trim();
    if (!name) return;

    setServices((prev) =>
      prev.map((s) =>
        s.id === serviceId ? { ...s, name } : s
      )
    );
    cancelEdit();
  }

  // ⭐ Abo togglen
  function toggleSubscription(serviceId) {
    setSubscriptions((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  }

  // 📊 Zählung betroffener Einträge
  function countMoviesForService(serviceId) {
    return movies.filter(
      (m) => m.streamingService === serviceId
    ).length;
  }

  // 🗑️ Dienst löschen (inkl. Warnung & Abo-Bereinigung)
  function requestDelete(service) {
    const affectedCount = countMoviesForService(
      service.id
    );

    const message =
      affectedCount > 0
        ? `Dienst "${service.name}" wirklich löschen?\n\n⚠️ Der Dienst ist ${affectedCount} Einträgen zugeordnet und wird daraus entfernt.`
        : `Dienst "${service.name}" wirklich löschen?\n\nDer Dienst ist aktuell keinem Eintrag zugeordnet.`;

    if (!window.confirm(message)) return;

    setServices((prev) =>
      prev.filter((s) => s.id !== service.id)
    );

    setSubscriptions((prev) =>
      prev.filter((id) => id !== service.id)
    );
  }

  // 🔤 Alphabetisch sortiert (de)
  const sortedServices = [...services].sort(
    (a, b) =>
      a.name.localeCompare(b.name, "de", {
        sensitivity: "base",
      })
  );

  return (
    <div>
      <h2>Meine Dienste</h2>

      <p style={{ fontSize: "0.9em", opacity: 0.8 }}>
        Verwalte hier deine Streaming-Dienste und Abonnements.
      </p>

      {/* ➕ Neuen Dienst hinzufügen */}
      <div
        style={{
          marginBottom: "16px",
          padding: "12px",
          border: "1px dashed #2a2a2a",
          borderRadius: "6px",
        }}
      >
        <strong>Neuen Dienst hinzufügen</strong>

        <div style={{ marginTop: "8px" }}>
          <input
            type="text"
            placeholder="z. B. WOW, Crunchyroll"
            value={newServiceName}
            onChange={(e) =>
              setNewServiceName(e.target.value)
            }
          />
          <button
            onClick={handleAddService}
            style={{ marginLeft: "8px" }}
            disabled={!newServiceName.trim()}
          >
            Hinzufügen
          </button>
        </div>
      </div>

      {/* 📺 Dienste */}
      <div
        style={{
          border: "1px solid #2a2a2a",
          borderRadius: "6px",
          padding: "12px",
          backgroundColor: "#1a1a1a",
        }}
      >
        <strong>Verfügbare Streaming-Dienste</strong>

        <ul style={{ marginTop: "8px", padding: 0 }}>
          {sortedServices.map((service) => {
            const isSubscribed =
              subscriptions.includes(service.id);
            const isEditing =
              editingId === service.id;

            return (
              <li
                key={service.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  opacity: isSubscribed ? 1 : 0.7,
                }}
              >
                {/* Name / Edit */}
                {isEditing ? (
                  <input
                    value={tempName}
                    onChange={(e) =>
                      setTempName(e.target.value)
                    }
                    autoFocus
                  />
                ) : (
                  <span>
                    {service.name}
                    {isSubscribed && (
                      <span
                        style={{
                          marginLeft: "6px",
                          color: "#2f80ed",
                        }}
                      >
                        ⭐ abonniert
                      </span>
                    )}
                  </span>
                )}

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                  }}
                >
                  {/* Abo */}
                  <label style={{ cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={isSubscribed}
                      onChange={() =>
                        toggleSubscription(
                          service.id
                        )
                      }
                    />{" "}
                    Abo
                  </label>

                  {isEditing ? (
                    <>
                      <button
                        onClick={() =>
                          saveEdit(service.id)
                        }
                        disabled={!tempName.trim()}
                        title="Speichern"
                      >
                        <Save size={16} />
                      </button>

                      <button
                        onClick={cancelEdit}
                        title="Abbrechen"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          startEdit(service)
                        }
                        title="Bearbeiten"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          requestDelete(service)
                        }
                        title="Löschen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <p
        style={{
          marginTop: "16px",
          fontSize: "0.85em",
          opacity: 0.7,
        }}
      >
        ℹ️ Der Filter <strong>„Jetzt verfügbar“</strong>{" "}
        berücksichtigt nur abonnierte Dienste.
      </p>
    </div>
  );
}

export default ServicesPage;
