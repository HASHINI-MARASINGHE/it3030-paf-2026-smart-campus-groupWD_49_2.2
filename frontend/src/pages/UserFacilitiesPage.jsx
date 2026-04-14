import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFacilities, searchFacilities } from "../api/facilityApi";
import Navbar from "../components/Navbar";
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

      let result = await getAllFacilities();
      let filteredData = result.data;

      if (searchText.trim()) {
        const response = await searchFacilities(searchText.trim());
        filteredData = response.data;
      }

      if (availabilityFilter !== "all") {
        filteredData = filteredData.filter(
          (facility) => facility.available === (availabilityFilter === "true")
        );
      }

      if (typeFilter.trim()) {
        filteredData = filteredData.filter(
          (facility) =>
            String(facility.type || "").toLowerCase() ===
            typeFilter.trim().toLowerCase()
        );
      }

      if (locationFilter.trim()) {
        filteredData = filteredData.filter((facility) =>
          String(facility.location || "")
            .toLowerCase()
            .includes(locationFilter.trim().toLowerCase())
        );
      }

      if (capacityFilter) {
        filteredData = filteredData.filter(
          (facility) => Number(facility.capacity) >= Number(capacityFilter)
        );
      }

      if (statusFilter.trim()) {
        filteredData = filteredData.filter(
          (facility) =>
            String(facility.status || "").toUpperCase() ===
            statusFilter.trim().toUpperCase()
        );
      }

      setFacilities(filteredData);
    } catch (error) {
      console.error("Error searching facilities:", error);
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

      <section style={styles.pageBanner}>
        <div style={styles.pageBannerOverlay}>
          <div style={styles.pageBannerContent}>
            <p style={styles.bannerMiniTitle}>Smart Campus Resources</p>
            <h1 style={styles.pageTitle}>Facilities Catalogue</h1>
            <p style={styles.pageSubtitle}>
              Browse, search, and filter available university facilities in one
              modern workspace.
            </p>
          </div>
        </div>
      </section>

      <main style={styles.content}>
        <section style={styles.filterSection}>
          <div style={styles.filterHeader}>
            <p style={styles.sectionLabel}>Facility Search</p>
            <h2 style={styles.filterTitle}>Find the Right Space Faster</h2>
            <p style={styles.filterSubText}>
              Search and filter facilities by name, location, type, capacity,
              status, and availability.
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
                placeholder="Enter location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldBlock}>
              <label style={styles.label}>Capacity</label>
              <input
                type="number"
                placeholder="Enter capacity"
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
            <button onClick={handleSearch} style={styles.searchButton}>
              Search
            </button>
            <button onClick={handleReset} style={styles.resetButton}>
              Reset All
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
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 35px rgba(15, 23, 42, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(15, 23, 42, 0.08)";
                  }}
                >
                  <div style={styles.cardAccent}></div>

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

                  <div style={styles.infoList}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Location</span>
                      <span style={styles.infoValue}>
                        {facility.location || "N/A"}
                      </span>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Type</span>
                      <span style={styles.infoValue}>{facility.type || "N/A"}</span>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Capacity</span>
                      <span style={styles.infoValue}>{facility.capacity}</span>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Status</span>
                      <span style={styles.infoValue}>{facility.status || "N/A"}</span>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Facility ID</span>
                      <span style={styles.infoValue}>{facility.id}</span>
                    </div>
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
    background:
      "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 45%, #eef2f7 100%)",
  },

  pageBanner: {
    height: "190px",
    backgroundImage:
      "linear-gradient(135deg, rgba(15, 23, 42, 0.68), rgba(30, 58, 138, 0.52)), url('/src/assets/SLIIT.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  pageBannerOverlay: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  pageBannerContent: {
    maxWidth: "1400px",
    padding: "0 50px",
  },
  bannerMiniTitle: {
    color: "#f4b400",
    fontSize: "13px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1.4px",
    marginBottom: "10px",
  },
  pageTitle: {
    color: "#ffffff",
    fontSize: "42px",
    fontWeight: "800",
    margin: "0 0 8px 0",
    letterSpacing: "-0.8px",
    lineHeight: 1.1,
  },
  pageSubtitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: "16px",
    maxWidth: "700px",
    lineHeight: "1.6",
    margin: 0,
  },

  content: {
    padding: "24px 50px 30px",
    marginTop: "0",
    position: "relative",
    zIndex: 2,
  },

  filterSection: {
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
    marginBottom: "28px",
    border: "1px solid rgba(255,255,255,0.6)",
  },
  filterHeader: {
    marginBottom: "22px",
  },
  sectionLabel: {
    margin: "0 0 8px 0",
    color: "#f59e0b",
    fontWeight: "800",
    fontSize: "13px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  filterTitle: {
    color: "#1e3a8a",
    fontSize: "32px",
    margin: "0 0 10px 0",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },
  filterSubText: {
    color: "#64748b",
    lineHeight: "1.7",
    fontSize: "16px",
    margin: 0,
    maxWidth: "850px",
  },

  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },
  fieldBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#334155",
    fontWeight: "700",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #dbe3ee",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #dbe3ee",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    boxSizing: "border-box",
  },

  filterActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  searchButton: {
    background: "linear-gradient(135deg, #1e3a8a, #1f2f6b)",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
    boxShadow: "0 10px 22px rgba(31, 47, 107, 0.20)",
  },
  resetButton: {
    backgroundColor: "#e2e8f0",
    color: "#334155",
    border: "none",
    padding: "14px 24px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
  },

  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: "60px 20px",
    borderRadius: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.07)",
  },
  spinner: {
    width: "44px",
    height: "44px",
    border: "5px solid #e5e7eb",
    borderTop: "5px solid #1f2f6b",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "14px",
    color: "#37424a",
    fontWeight: "700",
  },

  emptyBox: {
    backgroundColor: "#fff",
    padding: "50px 30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.07)",
  },
  emptyIcon: {
    fontSize: "44px",
    marginBottom: "10px",
  },
  emptyTitle: {
    color: "#1e3a8a",
    marginBottom: "8px",
    fontSize: "26px",
  },
  emptyText: {
    color: "#64748b",
    fontSize: "16px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  card: {
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "26px",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
    transition: "all 0.25s ease",
    overflow: "hidden",
    border: "1px solid #eef2f7",
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "5px",
    background: "linear-gradient(90deg, #f4b400, #f59e0b)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "20px",
  },
  cardTitle: {
    color: "#1e3a8a",
    fontSize: "26px",
    lineHeight: "1.15",
    margin: 0,
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },
  badge: {
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    paddingBottom: "10px",
    borderBottom: "1px solid #f1f5f9",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "700",
    minWidth: "90px",
  },
  infoValue: {
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: "700",
    textAlign: "right",
    wordBreak: "break-word",
  },

  actionRow: {
    marginTop: "22px",
  },
  bookButton: {
    display: "block",
    width: "100%",
    background: "linear-gradient(135deg, #1e3a8a, #1f2f6b)",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: "14px",
    fontWeight: "800",
    textDecoration: "none",
    textAlign: "center",
    boxSizing: "border-box",
    boxShadow: "0 10px 20px rgba(31, 47, 107, 0.18)",
  },
  bookButtonDisabled: {
    display: "block",
    width: "100%",
    backgroundColor: "#e2e8f0",
    color: "#64748b",
    padding: "14px 16px",
    borderRadius: "14px",
    fontWeight: "800",
    textDecoration: "none",
    textAlign: "center",
    cursor: "not-allowed",
    pointerEvents: "auto",
    boxSizing: "border-box",
  },
};

export default UserFacilitiesPage;