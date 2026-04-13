import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllFacilities,
  searchFacilities,
  filterFacilities,
  filterFacilitiesByType,
  filterFacilitiesByLocation,
  filterFacilitiesByCapacity,
  filterFacilitiesByStatus,
} from "../api/facilityApi";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

function UserFacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const response = await getAllFacilities();
      setFacilities(response.data);
    } catch (error) {
      console.error("Error loading facilities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

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

  return (
    <div style={styles.page}>
      <Navbar />
      <HeroSection />

      <main style={styles.content}>
        <section style={styles.filterSection}>
          <div style={styles.filterHeader}>
            <h2 style={styles.filterTitle}>Facilities Catalogue</h2>
            <p style={styles.filterSubText}>
              Search and filter facilities by type, location, capacity, status,
              and availability.
            </p>
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
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={styles.inputSmall}
            />

            <button
              onClick={handleLocationFilter}
              style={styles.secondaryButton}
            >
              Location
            </button>

            <input
              type="number"
              placeholder="Capacity"
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              style={styles.inputSmall}
              min="1"
            />

            <button
              onClick={handleCapacityFilter}
              style={styles.secondaryButton}
            >
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
        </section>

        {loading ? (
          <div style={styles.loaderWrapper}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading facilities...</p>
          </div>
        ) : facilities.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>🏫</div>
            <h3 style={styles.emptyTitle}>No facilities available</h3>
            <p style={styles.emptyText}>
              No matching facilities were found at the moment.
            </p>
          </div>
        ) : (
          <div style={styles.cardGrid}>
            {facilities.map((facility) => {
              const canBook =
                facility.available === true &&
                String(facility.status || "").toUpperCase() === "ACTIVE";

              return (
                <div
                  key={facility.id}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 22px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 3px 12px rgba(0,0,0,0.08)";
                  }}
                >
                  <div style={styles.cardTop}>
                    <h3 style={styles.cardTitle}>{facility.name}</h3>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: facility.available
                          ? "#dcfce7"
                          : "#fee2e2",
                        color: facility.available ? "#166534" : "#991b1b",
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
                    <strong>Facility ID:</strong> {facility.id}
                  </div>

                  <div style={styles.actionRow}>
                    <Link
                      to={`/bookings?facilityId=${facility.id}`}
                      style={
                        canBook ? styles.bookButton : styles.bookButtonDisabled
                      }
                      onClick={(e) => {
                        if (!canBook) {
                          e.preventDefault();
                        }
                      }}
                    >
                      {canBook ? "Book Now" : "Not Bookable"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f6f8",
  },
  content: {
    padding: "35px 50px",
  },
  filterSection: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    marginBottom: "28px",
  },
  filterHeader: {
    marginBottom: "18px",
  },
  filterTitle: {
    color: "#1f2f6b",
    fontSize: "28px",
    marginBottom: "8px",
  },
  filterSubText: {
    color: "#555",
    lineHeight: "1.6",
  },
  filterBar: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  input: {
    flex: "1",
    minWidth: "220px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "15px",
  },
  inputSmall: {
    minWidth: "160px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "15px",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    minWidth: "170px",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "#fff",
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
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
    margin: 0,
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
    lineHeight: "1.6",
  },
  actionRow: {
    marginTop: "18px",
  },
  bookButton: {
    display: "inline-block",
    backgroundColor: "#1f2f6b",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  bookButtonDisabled: {
    display: "inline-block",
    backgroundColor: "#cbd5e1",
    color: "#475569",
    padding: "10px 14px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
    cursor: "not-allowed",
    pointerEvents: "auto",
  },
};

export default UserFacilitiesPage;