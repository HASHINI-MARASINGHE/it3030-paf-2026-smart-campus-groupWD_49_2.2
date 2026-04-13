import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import Toast from "../components/common/Toast";
import { getAllFacilities } from "../api/facilityApi";
import { createBooking, getMyBookings, cancelBooking } from "../api/bookingApi";

function BookingsPage() {
  const location = useLocation();

  const getStoredUser = () => {
    try {
      const rawUser =
        localStorage.getItem("user") ||
        localStorage.getItem("authUser") ||
        localStorage.getItem("loggedUser");

      if (!rawUser) {
        return { userName: "", userEmail: "" };
      }

      const parsed = JSON.parse(rawUser);

      return {
        userName:
          parsed?.name ||
          parsed?.fullName ||
          parsed?.username ||
          parsed?.userName ||
          "",
        userEmail: parsed?.email || parsed?.userEmail || "",
      };
    } catch {
      return { userName: "", userEmail: "" };
    }
  };

  const storedUser = getStoredUser();

  const [facilities, setFacilities] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [form, setForm] = useState({
    facilityId: "",
    userName: storedUser.userName,
    userEmail: storedUser.userEmail,
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: "",
  });

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("success");
  };

  const loadFacilities = async () => {
    try {
      setLoadingFacilities(true);
      const response = await getAllFacilities();

      const filteredFacilities = response.data.filter(
        (facility) =>
          facility.available === true &&
          String(facility.status || "").toUpperCase() === "ACTIVE"
      );

      setFacilities(filteredFacilities);
    } catch (error) {
      console.error("Error loading facilities:", error);
      showMessage("Failed to load facilities.", "error");
    } finally {
      setLoadingFacilities(false);
    }
  };

  const loadMyBookings = async (email) => {
    if (!email || !email.trim()) {
      setMyBookings([]);
      return;
    }

    try {
      setLoadingBookings(true);
      const response = await getMyBookings(email.trim());
      setMyBookings(response.data);
    } catch (error) {
      console.error("Error loading my bookings:", error);
      showMessage("Failed to load your bookings.", "error");
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const facilityIdFromQuery = query.get("facilityId");

    if (facilityIdFromQuery) {
      setForm((prev) => ({
        ...prev,
        facilityId: facilityIdFromQuery,
      }));
    }
  }, [location.search]);

  useEffect(() => {
    if (form.userEmail.trim()) {
      loadMyBookings(form.userEmail);
    }
  }, []);

  const selectedFacility = useMemo(
    () =>
      facilities.find(
        (facility) => String(facility.id) === String(form.facilityId)
      ) || null,
    [facilities, form.facilityId]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await createBooking({
        facilityId: Number(form.facilityId),
        userName: form.userName.trim(),
        userEmail: form.userEmail.trim(),
        bookingDate: form.bookingDate,
        startTime: `${form.startTime}:00`,
        endTime: `${form.endTime}:00`,
        purpose: form.purpose.trim(),
        expectedAttendees: Number(form.expectedAttendees),
      });

      showMessage("Booking request submitted successfully.", "success");

      setForm((prev) => ({
        ...prev,
        bookingDate: "",
        startTime: "",
        endTime: "",
        purpose: "",
        expectedAttendees: "",
      }));

      await loadMyBookings(form.userEmail);
    } catch (error) {
      console.error("Error creating booking:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.messages ||
        "Failed to create booking.";

      showMessage(
        typeof backendMessage === "string"
          ? backendMessage
          : "Failed to create booking.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefreshMyBookings = async () => {
    await loadMyBookings(form.userEmail);
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this approved booking?"
    );

    if (!confirmed) return;

    try {
      await cancelBooking(bookingId);
      showMessage("Booking cancelled successfully.", "success");
      await loadMyBookings(form.userEmail);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      const backendMessage =
        error?.response?.data?.message || "Failed to cancel booking.";
      showMessage(backendMessage, "error");
    }
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "APPROVED") {
      return {
        backgroundColor: "#dcfce7",
        color: "#166534",
      };
    }

    if (value === "REJECTED") {
      return {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
      };
    }

    if (value === "CANCELLED") {
      return {
        backgroundColor: "#e5e7eb",
        color: "#374151",
      };
    }

    return {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    };
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <HeroSection />

      <Toast message={message} type={messageType} onClose={clearMessage} />

      <main style={styles.content}>
        <section style={styles.topSection}>
          <div style={styles.sectionHeadingWrap}>
            <h1 style={styles.sectionTitle}>Booking Management</h1>
            <p style={styles.sectionSubText}>
              Request a booking for a facility and track all your booking
              requests in one place.
            </p>
          </div>

          <div style={styles.topStats}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{facilities.length}</div>
              <div style={styles.statLabel}>Bookable Facilities</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{myBookings.length}</div>
              <div style={styles.statLabel}>My Booking Records</div>
            </div>
          </div>
        </section>

        <section style={styles.formSection}>
          <div style={styles.formCard}>
            <h2 style={styles.cardTitle}>Request a New Booking</h2>
            <p style={styles.cardSubText}>
              Fill in the form below to submit your request. New requests will
              be saved with pending status.
            </p>

            <form onSubmit={handleCreateBooking} style={styles.formGrid}>
              <div style={styles.field}>
                <label style={styles.label}>Select Facility</label>
                <select
                  name="facilityId"
                  value={form.facilityId}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value="">Choose a facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>
                      {facility.name} - {facility.location}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text"
                  name="userName"
                  value={form.userName}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Your Email</label>
                <input
                  type="email"
                  name="userEmail"
                  value={form.userEmail}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Booking Date</label>
                <input
                  type="date"
                  name="bookingDate"
                  value={form.bookingDate}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Expected Attendees</label>
                <input
                  type="number"
                  name="expectedAttendees"
                  value={form.expectedAttendees}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter expected attendees"
                  min="1"
                  required
                />
              </div>

              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Purpose</label>
                <textarea
                  name="purpose"
                  value={form.purpose}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Enter the purpose of the booking"
                  rows="4"
                  required
                />
              </div>

              <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
                <button
                  type="submit"
                  style={styles.primaryButton}
                  disabled={submitting || loadingFacilities}
                >
                  {submitting ? "Submitting..." : "Submit Booking Request"}
                </button>
              </div>
            </form>
          </div>

          <div style={styles.sideInfoCard}>
            <h3 style={styles.cardTitle}>Selected Facility Details</h3>

            {loadingFacilities ? (
              <p style={styles.infoText}>Loading facility details...</p>
            ) : selectedFacility ? (
              <div style={styles.detailsBox}>
                <div style={styles.detailRow}>
                  <strong>Name:</strong> {selectedFacility.name}
                </div>
                <div style={styles.detailRow}>
                  <strong>Location:</strong> {selectedFacility.location || "N/A"}
                </div>
                <div style={styles.detailRow}>
                  <strong>Type:</strong> {selectedFacility.type || "N/A"}
                </div>
                <div style={styles.detailRow}>
                  <strong>Capacity:</strong> {selectedFacility.capacity}
                </div>
                <div style={styles.detailRow}>
                  <strong>Status:</strong> {selectedFacility.status || "N/A"}
                </div>
                <div style={styles.detailRow}>
                  <strong>Available:</strong>{" "}
                  {selectedFacility.available ? "Yes" : "No"}
                </div>
              </div>
            ) : (
              <p style={styles.infoText}>
                Select a facility to see its details here.
              </p>
            )}
          </div>
        </section>

        <section style={styles.listSection}>
          <div style={styles.listHeader}>
            <div>
              <h2 style={styles.cardTitle}>My Bookings</h2>
              <p style={styles.cardSubText}>
                View all booking requests created with your email address.
              </p>
            </div>

            <div style={styles.emailFilterBox}>
              <input
                type="email"
                name="userEmail"
                value={form.userEmail}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your email to load bookings"
              />
              <button
                type="button"
                onClick={handleRefreshMyBookings}
                style={styles.secondaryButton}
              >
                Load My Bookings
              </button>
            </div>
          </div>

          {loadingBookings ? (
            <div style={styles.loaderWrapper}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Loading your bookings...</p>
            </div>
          ) : myBookings.length === 0 ? (
            <div style={styles.emptyBox}>
              <div style={styles.emptyIcon}>📅</div>
              <h3 style={styles.emptyTitle}>No bookings found</h3>
              <p style={styles.emptyText}>
                Submit a booking request or enter your email and refresh.
              </p>
            </div>
          ) : (
            <div style={styles.bookingGrid}>
              {myBookings.map((booking) => (
                <div key={booking.id} style={styles.bookingCard}>
                  <div style={styles.bookingCardTop}>
                    <h3 style={styles.bookingCardTitle}>
                      {booking.facility?.name || "Facility"}
                    </h3>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...getStatusStyle(booking.status),
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div style={styles.infoRow}>
                    <strong>Location:</strong>{" "}
                    {booking.facility?.location || "N/A"}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Type:</strong> {booking.facility?.type || "N/A"}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Date:</strong> {booking.bookingDate}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Time:</strong> {booking.startTime} -{" "}
                    {booking.endTime}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Purpose:</strong> {booking.purpose}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Expected Attendees:</strong>{" "}
                    {booking.expectedAttendees}
                  </div>

                  {booking.adminReason && (
                    <div style={styles.reasonBox}>
                      <strong>Admin Note:</strong> {booking.adminReason}
                    </div>
                  )}

                  {String(booking.status).toUpperCase() === "APPROVED" && (
                    <div style={styles.actionRow}>
                      <button
                        type="button"
                        style={styles.cancelButton}
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
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
    padding: "35px 50px 50px",
  },
  topSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "24px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  sectionHeadingWrap: {
    flex: 1,
    minWidth: "280px",
  },
  sectionTitle: {
    color: "#1f2f6b",
    fontSize: "32px",
    marginBottom: "8px",
  },
  sectionSubText: {
    color: "#555",
    lineHeight: "1.7",
    maxWidth: "780px",
  },
  topStats: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  statCard: {
    minWidth: "180px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    borderLeft: "5px solid #f4b400",
  },
  statNumber: {
    color: "#1f2f6b",
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "6px",
  },
  statLabel: {
    color: "#555",
    fontWeight: "600",
  },
  formSection: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(280px, 1fr)",
    gap: "24px",
    marginBottom: "30px",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  sideInfoCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    height: "fit-content",
  },
  cardTitle: {
    color: "#1f2f6b",
    fontSize: "24px",
    marginBottom: "8px",
  },
  cardSubText: {
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "18px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "#37424a",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "15px",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "#fff",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  primaryButton: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },
  secondaryButton: {
    backgroundColor: "#475569",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  infoText: {
    color: "#555",
    lineHeight: "1.7",
  },
  detailsBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  detailRow: {
    color: "#37424a",
    lineHeight: "1.6",
    backgroundColor: "#f8fafc",
    padding: "12px 14px",
    borderRadius: "10px",
  },
  listSection: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  emailFilterBox: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    minWidth: "320px",
    maxWidth: "520px",
    width: "100%",
  },
  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: "50px 20px",
    borderRadius: "14px",
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
    backgroundColor: "#f8fafc",
    padding: "40px 30px",
    borderRadius: "14px",
    textAlign: "center",
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
  bookingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
    borderLeft: "5px solid #f4b400",
  },
  bookingCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  bookingCardTitle: {
    color: "#1f2f6b",
    fontSize: "22px",
    margin: 0,
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  infoRow: {
    marginBottom: "10px",
    color: "#333",
    fontSize: "15px",
    lineHeight: "1.6",
  },
  reasonBox: {
    marginTop: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#334155",
    lineHeight: "1.6",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "18px",
  },
  cancelButton: {
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default BookingsPage;