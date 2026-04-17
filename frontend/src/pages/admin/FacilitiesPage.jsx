import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Toast from "../../components/common/Toast";
import {
  deleteFacility,
  getAllFacilities,
  searchFacilities,
  filterFacilities,
  filterFacilitiesByType,
  filterFacilitiesByLocation,
  filterFacilitiesByCapacity,
  filterFacilitiesByStatus,
} from "../../api/facilityApi";

function FacilitiesPage() {
  const location = useLocation();

  const [facilities, setFacilities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [selectedFacilityName, setSelectedFacilityName] = useState("");

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const response = await getAllFacilities();
      setFacilities(response.data);
    } catch (error) {
      console.error("Error loading facilities:", error);
      showMessage("Failed to load facilities", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");

    if (searchQuery && searchQuery.trim() !== "") {
      setSearchText(searchQuery);

      const runSearchFromQuery = async () => {
        try {
          setLoading(true);
          const response = await searchFacilities(searchQuery);
          setFacilities(response.data);
        } catch (error) {
          console.error("Error searching facilities from query:", error);
          showMessage("Search failed", "error");
        } finally {
          setLoading(false);
        }
      };

      runSearchFromQuery();
    } else {
      loadFacilities();
    }
  }, [location.search]);

  const handleSearch = async () => {
    try {
      setLoading(true);

      if (searchText.trim() === "") {
        await loadFacilities();
        return;
      }

      const response = await searchFacilities(searchText);
      setFacilities(response.data);
    } catch (error) {
      console.error("Error searching facilities:", error);
      showMessage("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityChange = async (value) => {
    setAvailabilityFilter(value);

    try {
      setLoading(true);

      if (value === "all") {
        await loadFacilities();
        return;
      }

      const response = await filterFacilities(value === "true");
      setFacilities(response.data);
    } catch (error) {
      console.error("Error filtering facilities:", error);
      showMessage("Availability filter failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeFilter = async () => {
    try {
      setLoading(true);

      if (!typeFilter.trim()) {
        await loadFacilities();
        return;
      }

      const response = await filterFacilitiesByType(typeFilter);
      setFacilities(response.data);
    } catch (error) {
      console.error("Error filtering by type:", error);
      showMessage("Type filter failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFilter = async () => {
    try {
      setLoading(true);

      if (!locationFilter.trim()) {
        await loadFacilities();
        return;
      }

      const response = await filterFacilitiesByLocation(locationFilter);
      setFacilities(response.data);
    } catch (error) {
      console.error("Error filtering by location:", error);
      showMessage("Location filter failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCapacityFilter = async () => {
    try {
      setLoading(true);

      if (!capacityFilter) {
        await loadFacilities();
        return;
      }

      const response = await filterFacilitiesByCapacity(capacityFilter);
      setFacilities(response.data);
    } catch (error) {
      console.error("Error filtering by capacity:", error);
      showMessage("Capacity filter failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = async () => {
    try {
      setLoading(true);

      if (!statusFilter.trim()) {
        await loadFacilities();
        return;
      }

      const response = await filterFacilitiesByStatus(statusFilter);
      setFacilities(response.data);
    } catch (error) {
      console.error("Error filtering by status:", error);
      showMessage("Status filter failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSearchText("");
    setAvailabilityFilter("all");
    setTypeFilter("");
    setLocationFilter("");
    setCapacityFilter("");
    setStatusFilter("");
    await loadFacilities();
  };

  const openDeleteConfirm = (id, name) => {
    setSelectedFacilityId(id);
    setSelectedFacilityName(name);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setSelectedFacilityId(null);
    setSelectedFacilityName("");
    setShowDeleteConfirm(false);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteFacility(selectedFacilityId);
      showMessage("Facility deleted successfully", "success");
      closeDeleteConfirm();
      loadFacilities();
    } catch (error) {
      console.error("Error deleting facility:", error);
      showMessage("Delete failed", "error");
      closeDeleteConfirm();
    }
  };

  return (
    <div>
      <Toast message={message} type={messageType} onClose={clearMessage} />

      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Facilities List</h2>
          <p style={styles.subText}>
            Manage lecture halls, labs, rooms, and resources.
          </p>
        </div>

        <Link to="/admin/facilities/add" style={styles.addButton}>
          + Add Facility
        </Link>
      </div>

      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by facility name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.searchButton}>
          Search
        </button>

        <select
          value={availabilityFilter}
          onChange={(e) => handleAvailabilityChange(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Availability</option>
          <option value="true">Available Only</option>
          <option value="false">Unavailable Only</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Types</option>
          <option value="Lecture Hall">Lecture Hall</option>
          <option value="Lab">Lab</option>
          <option value="Meeting Room">Meeting Room</option>
          <option value="Equipment">Equipment</option>
        </select>
        <button onClick={handleTypeFilter} style={styles.secondaryButton}>
          Type
        </button>

        <input
          type="text"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          style={styles.inputSmall}
        />
        <button onClick={handleLocationFilter} style={styles.secondaryButton}>
          Location
        </button>

        <input
          type="number"
          placeholder="Min capacity"
          value={capacityFilter}
          onChange={(e) => setCapacityFilter(e.target.value)}
          style={styles.inputSmall}
          min="1"
        />
        <button onClick={handleCapacityFilter} style={styles.secondaryButton}>
          Capacity
        </button>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>
        <button onClick={handleStatusFilter} style={styles.secondaryButton}>
          Status
        </button>

        <button onClick={handleReset} style={styles.resetButton}>
          Reset
        </button>
      </div>

      {loading ? (
        <div style={styles.loaderWrapper}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading facilities...</p>
        </div>
      ) : facilities.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>🏫</div>
          <h3 style={styles.emptyTitle}>No facilities found</h3>
          <p style={styles.emptyText}>
            Try adjusting your filters or add a new facility to get started.
          </p>
          <Link to="/admin/facilities/add" style={styles.emptyButton}>
            + Add First Facility
          </Link>
        </div>
      ) : (
        <div style={styles.cardGrid}>
          {facilities.map((facility) => (
            <div
              key={facility.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 22px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,0.08)";
              }}
            >
              <div style={styles.cardTop}>
                <h3 style={styles.cardTitle}>{facility.name}</h3>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: facility.available ? "#d1fae5" : "#fee2e2",
                    color: facility.available ? "#065f46" : "#991b1b",
                  }}
                >
                  {facility.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <div style={styles.infoRow}>
                <strong>Location:</strong> {facility.location || "N/A"}
              </div>
              <div style={styles.infoRow}>
                <strong>Type:</strong> {facility.type || "N/A"}
              </div>
              <div style={styles.infoRow}>
                <strong>Capacity:</strong> {facility.capacity}
              </div>
              <div style={styles.infoRow}>
                <strong>Status:</strong> {facility.status || "N/A"}
              </div>
              <div style={styles.infoRow}>
                <strong>ID:</strong> {facility.id}
              </div>

              <div style={styles.actionRow}>
                <Link
                  to={`/admin/facilities/edit/${facility.id}`}
                  style={styles.editButton}
                >
                  Edit
                </Link>
                <button
                  onClick={() => openDeleteConfirm(facility.id, facility.name)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <h3 style={styles.modalTitle}>Confirm Delete</h3>
            <p style={styles.modalText}>
              Are you sure you want to delete <strong>{selectedFacilityName}</strong>?
            </p>

            <div style={styles.modalActions}>
              <button onClick={closeDeleteConfirm} style={styles.cancelButton}>
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                style={styles.confirmDeleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "20px",
    flexWrap: "wrap",
  },
  heading: {
    color: "#1f2f6b",
    marginBottom: "6px",
  },
  subText: {
    color: "#555",
  },
  addButton: {
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    padding: "12px 18px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  input: {
    flex: "1",
    minWidth: "220px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  inputSmall: {
    minWidth: "160px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "170px",
    outline: "none",
  },
  searchButton: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#475569",
    color: "#fff",
    border: "none",
    padding: "12px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#37424a",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: "50px 20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  spinner: {
    width: "42px",
    height: "42px",
    border: "5px solid #e5e7eb",
    borderTop: "5px solid #1f2f6b",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "14px",
    color: "#37424a",
    fontWeight: "bold",
  },
  emptyBox: {
    backgroundColor: "#fff",
    padding: "40px 30px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  emptyIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },
  emptyTitle: {
    color: "#1f2f6b",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#555",
    marginBottom: "20px",
  },
  emptyButton: {
    display: "inline-block",
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    padding: "12px 18px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
    transition: "all 0.2s ease",
    borderLeft: "5px solid #f4b400",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  cardTitle: {
    color: "#1f2f6b",
    fontSize: "24px",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  infoRow: {
    marginBottom: "10px",
    color: "#333",
    fontSize: "16px",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
  },
  editButton: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: "430px",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  modalTitle: {
    color: "#1f2f6b",
    marginBottom: "12px",
  },
  modalText: {
    color: "#444",
    marginBottom: "22px",
    lineHeight: "1.6",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  confirmDeleteButton: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default FacilitiesPage;