import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Toast from "../../components/common/Toast";
import {
  deleteFacility,
  getAllFacilities,
  searchFacilities,
} from "../../api/facilityApi";

function FacilitiesPage() {
  const location = useLocation();

  const [allFacilities, setAllFacilities] = useState([]);
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
      setAllFacilities(response.data);
      setFacilities(response.data);
      setCurrentPage(1);
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

    const initLoad = async () => {
      try {
        setLoading(true);
        const response = await getAllFacilities();
        const loadedData = response.data;

        setAllFacilities(loadedData);

        if (searchQuery && searchQuery.trim() !== "") {
          setSearchText(searchQuery);

          const searchResponse = await searchFacilities(searchQuery.trim());
          setFacilities(searchResponse.data);
        } else {
          setFacilities(loadedData);
        }

        setCurrentPage(1);
      } catch (error) {
        console.error("Error loading facilities:", error);
        showMessage("Failed to load facilities", "error");
      } finally {
        setLoading(false);
      }
    };

    initLoad();
  }, [location.search]);

  const handleApplyFilters = async () => {
    try {
      setLoading(true);

      let workingData = [...allFacilities];

      if (searchText.trim()) {
        const response = await searchFacilities(searchText.trim());
        workingData = response.data;
      }

      if (availabilityFilter !== "all") {
        const isAvailable = availabilityFilter === "true";
        workingData = workingData.filter(
          (facility) => facility.available === isAvailable
        );
      }

      if (typeFilter.trim()) {
        workingData = workingData.filter(
          (facility) =>
            String(facility.type || "").toLowerCase() ===
            typeFilter.trim().toLowerCase()
        );
      }

      if (locationFilter.trim()) {
        workingData = workingData.filter((facility) =>
          String(facility.location || "")
            .toLowerCase()
            .includes(locationFilter.trim().toLowerCase())
        );
      }

      if (capacityFilter) {
        workingData = workingData.filter(
          (facility) => Number(facility.capacity) >= Number(capacityFilter)
        );
      }

      if (statusFilter.trim()) {
        workingData = workingData.filter(
          (facility) =>
            String(facility.status || "").toUpperCase() ===
            statusFilter.trim().toUpperCase()
        );
      }

      setFacilities(workingData);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error applying filters:", error);
      showMessage("Filter failed", "error");
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
    setFacilities(allFacilities);
    setCurrentPage(1);
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
      await loadFacilities();
    } catch (error) {
      console.error("Error deleting facility:", error);
      showMessage("Delete failed", "error");
      closeDeleteConfirm();
    }
  };

  const totalPages = Math.ceil(facilities.length / itemsPerPage);

  const currentFacilities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return facilities.slice(startIndex, startIndex + itemsPerPage);
  }, [facilities, currentPage]);

  const startItem = facilities.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, facilities.length);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Toast message={message} type={messageType} onClose={clearMessage} />

      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Facilities List</h2>
          <p style={styles.subText}>
            Manage lecture halls, labs, rooms, and campus resources.
          </p>
        </div>

        <Link to="/admin/facilities/add" style={styles.addButton}>
          + Add Facility
        </Link>
      </div>

      <div style={styles.filterPanel}>
        <div style={styles.filterHeader}>
          <h3 style={styles.filterTitle}>Search and Filter</h3>
          <p style={styles.filterSubText}>
            Use the fields below, then click Apply Filters.
          </p>
        </div>

        <div style={styles.filterGrid}>
          <div style={styles.fieldBlock}>
            <label style={styles.label}>Facility Name</label>
            <input
              type="text"
              placeholder="Search by facility name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldBlock}>
            <label style={styles.label}>Availability</label>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Availability</option>
              <option value="true">Available Only</option>
              <option value="false">Unavailable Only</option>
            </select>
          </div>

          <div style={styles.fieldBlock}>
            <label style={styles.label}>Type</label>
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
          </div>

          <div style={styles.fieldBlock}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              placeholder="Filter by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldBlock}>
            <label style={styles.label}>Minimum Capacity</label>
            <input
              type="number"
              placeholder="Enter minimum capacity"
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              style={styles.input}
              min="1"
            />
          </div>

          <div style={styles.fieldBlock}>
            <label style={styles.label}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.select}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
            </select>
          </div>
        </div>

        <div style={styles.filterActions}>
          <button onClick={handleApplyFilters} style={styles.applyButton}>
            Apply Filters
          </button>
          <button onClick={handleReset} style={styles.resetButton}>
            Reset
          </button>
        </div>
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
            Try adjusting your search or filters, or add a new facility.
          </p>
          <Link to="/admin/facilities/add" style={styles.emptyButton}>
            + Add First Facility
          </Link>
        </div>
      ) : (
        <>
          <div style={styles.resultsBar}>
            <span style={styles.resultsText}>
              Showing {startItem}-{endItem} of {facilities.length} facilities
            </span>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Facility Name</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Capacity</th>
                  <th style={styles.th}>Availability</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentFacilities.map((facility) => (
                  <tr key={facility.id} style={styles.tr}>
                    <td style={styles.td}>{facility.id}</td>
                    <td style={styles.tdStrong}>{facility.name}</td>
                    <td style={styles.td}>{facility.location || "N/A"}</td>
                    <td style={styles.td}>{facility.type || "N/A"}</td>
                    <td style={styles.td}>{facility.capacity}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: facility.available ? "#d1fae5" : "#fee2e2",
                          color: facility.available ? "#065f46" : "#991b1b",
                        }}
                      >
                        {facility.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor:
                            String(facility.status || "").toUpperCase() === "ACTIVE"
                              ? "#dbeafe"
                              : "#fef3c7",
                          color:
                            String(facility.status || "").toUpperCase() === "ACTIVE"
                              ? "#1d4ed8"
                              : "#92400e",
                        }}
                      >
                        {facility.status || "N/A"}
                      </span>
                    </td>
                    <td style={styles.td}>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {facilities.length > itemsPerPage && (
            <div style={styles.paginationWrapper}>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                style={{
                  ...styles.pageButton,
                  ...(currentPage === 1 ? styles.pageButtonDisabled : {}),
                }}
              >
                Previous
              </button>

              <div style={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      style={{
                        ...styles.pageNumberButton,
                        ...(currentPage === page
                          ? styles.activePageNumberButton
                          : {}),
                      }}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  ...styles.pageButton,
                  ...(currentPage === totalPages
                    ? styles.pageButtonDisabled
                    : {}),
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
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
    fontSize: "34px",
  },
  subText: {
    color: "#555",
    fontSize: "16px",
  },
  addButton: {
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "bold",
    textDecoration: "none",
  },

  filterPanel: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    marginBottom: "24px",
  },
  filterHeader: {
    marginBottom: "18px",
  },
  filterTitle: {
    margin: "0 0 6px 0",
    color: "#1f2f6b",
    fontSize: "22px",
  },
  filterSubText: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "18px",
  },
  fieldBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  filterActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  applyButton: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#475569",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  resultsBar: {
    marginBottom: "14px",
  },
  resultsText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: "14px",
  },

  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    overflowX: "auto",
    overflowY: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "980px",
  },
  th: {
    textAlign: "left",
    padding: "16px",
    backgroundColor: "#f8fafc",
    color: "#1f2f6b",
    fontSize: "14px",
    fontWeight: "800",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },
  tr: {
    borderBottom: "1px solid #eef2f7",
  },
  td: {
    padding: "16px",
    color: "#334155",
    fontSize: "14px",
    verticalAlign: "middle",
  },
  tdStrong: {
    padding: "16px",
    color: "#1f2f6b",
    fontSize: "15px",
    fontWeight: "700",
    verticalAlign: "middle",
  },
  badge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
    whiteSpace: "nowrap",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
    display: "inline-block",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  },
  actionRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  editButton: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
    fontSize: "14px",
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
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

  paginationWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginTop: "24px",
    flexWrap: "wrap",
  },
  pageNumbers: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  pageButton: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
  pageButtonDisabled: {
    backgroundColor: "#cbd5e1",
    color: "#64748b",
    cursor: "not-allowed",
  },
  pageNumberButton: {
    backgroundColor: "#ffffff",
    color: "#1f2f6b",
    border: "1px solid #cbd5e1",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    minWidth: "42px",
  },
  activePageNumberButton: {
    backgroundColor: "#1f2f6b",
    color: "#ffffff",
    border: "1px solid #1f2f6b",
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