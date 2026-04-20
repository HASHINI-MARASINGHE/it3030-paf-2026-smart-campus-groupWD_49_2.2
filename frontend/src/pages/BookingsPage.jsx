import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import Toast from "../components/common/Toast";
import { getAllFacilities } from "../api/facilityApi";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookingAvailability,
} from "../api/bookingApi";

function BookingsPage() {
  const location = useLocation();

  const CAMPUS_OPEN_TIME = "06:00";
  const CAMPUS_CLOSE_TIME = "22:00";

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

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const timeToMinutes = (time) => {
    if (!time || !time.includes(":")) return null;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (time) => {
    if (!time) return "";
    return String(time).slice(0, 5);
  };

  const storedUser = getStoredUser();
  const todayString = getTodayString();

  const [facilities, setFacilities] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [availabilityData, setAvailabilityData] = useState(null);

  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [formError, setFormError] = useState("");
  const [summaryBox, setSummaryBox] = useState(null);

  const [form, setForm] = useState({
    facilityId: "",
    userName: storedUser.userName,
    userEmail: storedUser.userEmail,
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: "",
    repeatType: "NONE",
    repeatCount: "",
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

  const loadAvailability = async (facilityId, bookingDate) => {
    if (!facilityId || !bookingDate || bookingDate < todayString) {
      setAvailabilityData(null);
      return;
    }

    try {
      setLoadingAvailability(true);
      const response = await getBookingAvailability(facilityId, bookingDate);
      setAvailabilityData(response.data);
    } catch (error) {
      console.error("Error loading availability:", error);
      setAvailabilityData(null);
    } finally {
      setLoadingAvailability(false);
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

  useEffect(() => {
    loadAvailability(form.facilityId, form.bookingDate);
  }, [form.facilityId, form.bookingDate]);

  const selectedFacility = useMemo(
    () =>
      facilities.find(
        (facility) => String(facility.id) === String(form.facilityId)
      ) || null,
    [facilities, form.facilityId]
  );

  const bookingPreviewDates = useMemo(() => {
    if (!form.bookingDate) return [];

    const count =
      form.repeatType === "NONE" ? 1 : Number(form.repeatCount || 0);

    if (form.repeatType !== "NONE" && (count < 2 || count > 12)) {
      return [];
    }

    const baseDate = new Date(form.bookingDate);
    const list = [];

    for (let i = 0; i < count; i++) {
      const date = new Date(baseDate);

      if (form.repeatType === "WEEKLY") {
        date.setDate(baseDate.getDate() + i * 7);
      } else if (form.repeatType === "MONTHLY") {
        date.setMonth(baseDate.getMonth() + i);
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      list.push(`${year}-${month}-${day}`);
    }

    return list;
  }, [form.bookingDate, form.repeatType, form.repeatCount]);

  const validateForm = () => {
    if (!form.facilityId) {
      return "Please select a facility.";
    }

    if (!form.userName.trim()) {
      return "Please enter your name.";
    }

    if (!form.userEmail.trim()) {
      return "Please enter your email.";
    }

    if (!form.bookingDate) {
      return "Please select a booking date.";
    }

    if (form.bookingDate < todayString) {
      return "Past dates cannot be booked.";
    }

    if (!form.startTime || !form.endTime) {
      return "Please select both start time and end time.";
    }

    const startMinutes = timeToMinutes(form.startTime);
    const endMinutes = timeToMinutes(form.endTime);
    const openMinutes = timeToMinutes(CAMPUS_OPEN_TIME);
    const closeMinutes = timeToMinutes(CAMPUS_CLOSE_TIME);

    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      return "Bookings are allowed only between 6:00 AM and 10:00 PM.";
    }

    if (startMinutes >= endMinutes) {
      return "Start time must be earlier than end time.";
    }

    if (!form.expectedAttendees || Number(form.expectedAttendees) < 1) {
      return "Expected attendees must be at least 1.";
    }

    if (
      selectedFacility &&
      Number(form.expectedAttendees) > selectedFacility.capacity
    ) {
      return `Expected attendees cannot exceed facility capacity (${selectedFacility.capacity}).`;
    }

    if (!form.purpose.trim()) {
      return "Please enter the purpose of the booking.";
    }

    if (selectedFacility) {
      if (!selectedFacility.available) {
        return "This facility is currently unavailable.";
      }

      if (String(selectedFacility.status || "").toUpperCase() !== "ACTIVE") {
        return "Only ACTIVE facilities can be booked.";
      }
    }

    if (form.repeatType !== "NONE") {
      if (!form.repeatCount || Number(form.repeatCount) < 2) {
        return "Number of bookings must be at least 2.";
      }

      if (Number(form.repeatCount) > 12) {
        return "Number of bookings cannot exceed 12.";
      }
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormError("");
    setSummaryBox(null);

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUseTimeSlot = (slot) => {
    setForm((prev) => ({
      ...prev,
      startTime: formatTime(slot.startTime),
      endTime: formatTime(slot.endTime),
    }));
    setFormError("");
    showMessage("Suggested time slot applied.", "success");
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    const validationMessage = validateForm();

    if (validationMessage) {
      setFormError(validationMessage);
      showMessage(validationMessage, "error");
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");
      setSummaryBox(null);

      const response = await createBooking({
        facilityId: Number(form.facilityId),
        userName: form.userName.trim(),
        userEmail: form.userEmail.trim(),
        bookingDate: form.bookingDate,
        startTime: `${form.startTime}:00`,
        endTime: `${form.endTime}:00`,
        purpose: form.purpose.trim(),
        expectedAttendees: Number(form.expectedAttendees),
        recurrenceType: form.repeatType,
        repeatCount: form.repeatType === "NONE" ? null : Number(form.repeatCount),
      });

      const result = response.data;
      setSummaryBox(result);

      showMessage(result?.message || "Booking request submitted successfully.", "success");

      setForm((prev) => ({
        ...prev,
        bookingDate: "",
        startTime: "",
        endTime: "",
        purpose: "",
        expectedAttendees: "",
        repeatType: "NONE",
        repeatCount: "",
      }));

      setAvailabilityData(null);
      await loadMyBookings(form.userEmail);
    } catch (error) {
      console.error("Error creating booking:", error);

      const responseData = error?.response?.data;
      const backendMessage =
        responseData?.message || "Failed to create booking.";

      if (responseData) {
        setSummaryBox(responseData);
      }

      setFormError(backendMessage);
      showMessage(backendMessage, "error");
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
      await loadAvailability(form.facilityId, form.bookingDate);
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
        backgroundColor: "#e2e8f0",
        color: "#334155",
      };
    }

    return {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    };
  };

  const getRepeatText = (booking) => {
    const type = String(booking?.recurrenceType || "NONE").toUpperCase();

    if (type === "NONE" || Number(booking?.totalOccurrences || 1) <= 1) {
      return "One-time booking";
    }

    return `${type === "WEEKLY" ? "Repeats weekly" : "Repeats monthly"} • Booking ${
      booking.occurrenceNumber
    } of ${booking.totalOccurrences}`;
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <HeroSection />
      <Toast message={message} type={messageType} onClose={clearMessage} />

      <main style={styles.content}>
        <section style={styles.headerCard}>
          <div>
            <div style={styles.smallTag}>Smart Campus Operations Hub</div>
            <h1 style={styles.pageTitle}>Booking Management</h1>
            <p style={styles.pageSubtitle}>
              Create one-time or repeat bookings, check available time slots,
              and manage your requests in one place.
            </p>
          </div>

          <div style={styles.topStats}>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Bookable Facilities</span>
              <span style={styles.statNumber}>{facilities.length}</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>My Bookings</span>
              <span style={styles.statNumber}>{myBookings.length}</span>
            </div>
          </div>
        </section>

        <section style={styles.mainGrid}>
          <div style={styles.formCard}>
            <div style={styles.cardTop}>
              <div>
                <h2 style={styles.cardTitle}>Request a New Booking</h2>
                <p style={styles.cardDesc}>
                  For repeat bookings, choose weekly or monthly and enter how
                  many bookings you need.
                </p>
              </div>
              <div style={styles.cardBadge}>Booking Form</div>
            </div>

            {formError && <div style={styles.errorBox}>{formError}</div>}

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
                  min={todayString}
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
                  min={CAMPUS_OPEN_TIME}
                  max={CAMPUS_CLOSE_TIME}
                  required
                />
                <small style={styles.helpText}>Allowed from 06:00 to 22:00</small>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  style={styles.input}
                  min={CAMPUS_OPEN_TIME}
                  max={CAMPUS_CLOSE_TIME}
                  required
                />
                <small style={styles.helpText}>Must be after start time</small>
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
                  max={selectedFacility?.capacity || undefined}
                  required
                />
                {selectedFacility && (
                  <small style={styles.helpText}>
                    Max capacity: {selectedFacility.capacity}
                  </small>
                )}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Repeat Booking</label>
                <select
                  name="repeatType"
                  value={form.repeatType}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="NONE">No</option>
                  <option value="WEEKLY">Yes - Weekly</option>
                  <option value="MONTHLY">Yes - Monthly</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Number of Bookings</label>
                <input
                  type="number"
                  name="repeatCount"
                  value={form.repeatCount}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Example: 4"
                  min="2"
                  max="12"
                  disabled={form.repeatType === "NONE"}
                />
                <small style={styles.helpText}>
                  Use 2 to 12 when repeat booking is enabled
                </small>
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
                  style={styles.submitBtn}
                  disabled={submitting || loadingFacilities}
                >
                  {submitting ? "Submitting..." : "Submit Booking Request"}
                </button>
              </div>
            </form>

            {form.repeatType !== "NONE" && bookingPreviewDates.length > 0 && (
              <div style={styles.previewBox}>
                <h4 style={styles.previewTitle}>Booking Preview</h4>
                <div style={styles.previewWrap}>
                  {bookingPreviewDates.map((date, index) => (
                    <div key={date} style={styles.previewItem}>
                      Booking {index + 1}: {date}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {summaryBox && (
              <div style={styles.summaryBox}>
                <h4 style={styles.summaryTitle}>Result</h4>
                <div style={styles.summaryGrid}>
                  <div style={styles.summaryItem}>
                    <span>Requested</span>
                    <strong>{summaryBox.totalRequested || 0}</strong>
                  </div>
                  <div style={styles.summaryItem}>
                    <span>Created</span>
                    <strong>{summaryBox.createdCount || 0}</strong>
                  </div>
                  <div style={styles.summaryItem}>
                    <span>Skipped</span>
                    <strong>{summaryBox.skippedCount || 0}</strong>
                  </div>
                </div>

                {summaryBox.skippedOccurrences?.length > 0 && (
                  <div style={styles.skippedList}>
                    {summaryBox.skippedOccurrences.map((item, index) => (
                      <div key={index} style={styles.skippedItem}>
                        <strong>{item.bookingDate}</strong> ({formatTime(item.startTime)} - {formatTime(item.endTime)}) - {item.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={styles.sideColumn}>
            <div style={styles.infoCard}>
              <div style={styles.cardTopCompact}>
                <h3 style={styles.infoCardTitle}>Selected Facility</h3>
                {selectedFacility && <span style={styles.readyTag}>Selected</span>}
              </div>

              {loadingFacilities ? (
                <p style={styles.emptyInfo}>Loading facility details...</p>
              ) : selectedFacility ? (
                <div style={styles.infoList}>
                  <div style={styles.infoItem}>
                    <span>Name</span>
                    <strong>{selectedFacility.name}</strong>
                  </div>
                  <div style={styles.infoItem}>
                    <span>Location</span>
                    <strong>{selectedFacility.location || "N/A"}</strong>
                  </div>
                  <div style={styles.infoItem}>
                    <span>Type</span>
                    <strong>{selectedFacility.type || "N/A"}</strong>
                  </div>
                  <div style={styles.infoItem}>
                    <span>Capacity</span>
                    <strong>{selectedFacility.capacity}</strong>
                  </div>
                  <div style={styles.infoItem}>
                    <span>Status</span>
                    <strong>{selectedFacility.status || "N/A"}</strong>
                  </div>
                  <div style={styles.infoItem}>
                    <span>Available</span>
                    <strong>{selectedFacility.available ? "Yes" : "No"}</strong>
                  </div>
                </div>
              ) : (
                <p style={styles.emptyInfo}>
                  Select a facility to see its details here.
                </p>
              )}
            </div>

            <div style={styles.ruleCard}>
              <h3 style={styles.infoCardTitle}>Examples</h3>
              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  Monthly: choose <strong>2026-05-08</strong> and select{" "}
                  <strong>Yes - Monthly</strong>.
                </div>
                <div style={styles.ruleItem}>
                  Weekly: choose a <strong>Wednesday</strong> and select{" "}
                  <strong>Yes - Weekly</strong>.
                </div>
                <div style={styles.ruleItem}>
                  Each booking is checked for conflicts and booking rules.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.availabilityCard}>
          <div style={styles.cardTop}>
            <div>
              <h2 style={styles.cardTitle}>Available Time Slots</h2>
              <p style={styles.cardDesc}>
                Choose a facility and date to see booked and free time slots.
              </p>
            </div>
          </div>

          {!form.facilityId || !form.bookingDate ? (
            <div style={styles.placeholder}>
              Select a facility and booking date to load availability.
            </div>
          ) : loadingAvailability ? (
            <div style={styles.placeholder}>Loading time slot suggestions...</div>
          ) : availabilityData ? (
            <div style={styles.slotGrid}>
              <div style={styles.slotCard}>
                <h4 style={styles.slotTitle}>Booked Slots</h4>
                {availabilityData.bookedSlots?.length > 0 ? (
                  <div style={styles.slotWrap}>
                    {availabilityData.bookedSlots.map((slot, index) => (
                      <div key={index} style={styles.bookedSlot}>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.slotEmpty}>No booked slots for this date.</div>
                )}
              </div>

              <div style={styles.slotCard}>
                <h4 style={styles.slotTitle}>Free Slots</h4>
                {availabilityData.availableSlots?.length > 0 ? (
                  <div style={styles.slotWrap}>
                    {availabilityData.availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        style={styles.availableSlot}
                        onClick={() => handleUseTimeSlot(slot)}
                      >
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={styles.slotEmpty}>No free slots available.</div>
                )}
              </div>
            </div>
          ) : (
            <div style={styles.placeholder}>No availability data found.</div>
          )}
        </section>

        <section style={styles.myBookingsSection}>
          <div style={styles.listHeader}>
            <div>
              <h2 style={styles.cardTitle}>My Bookings</h2>
              <p style={styles.cardDesc}>
                View all booking requests created with your email address.
              </p>
            </div>

            <div style={styles.filterBox}>
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
                style={styles.secondaryBtn}
              >
                Load My Bookings
              </button>
            </div>
          </div>

          {loadingBookings ? (
            <div style={styles.placeholder}>Loading your bookings...</div>
          ) : myBookings.length === 0 ? (
            <div style={styles.emptyState}>
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
                    <div>
                      <h3 style={styles.bookingTitle}>
                        {booking.facility?.name || "Facility"}
                      </h3>
                      <p style={styles.bookingSubTitle}>
                        {booking.facility?.location || "N/A"}
                      </p>
                    </div>
                    <span
                      style={{
                        ...styles.statusBadge,
                        ...getStatusStyle(booking.status),
                      }}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div style={styles.repeatTag}>{getRepeatText(booking)}</div>

                  <div style={styles.bookingInfoGrid}>
                    <div style={styles.bookingInfoItem}>
                      <span>Date</span>
                      <strong>{booking.bookingDate}</strong>
                    </div>
                    <div style={styles.bookingInfoItem}>
                      <span>Time</span>
                      <strong>
                        {booking.startTime} - {booking.endTime}
                      </strong>
                    </div>
                    <div style={styles.bookingInfoItem}>
                      <span>Type</span>
                      <strong>{booking.facility?.type || "N/A"}</strong>
                    </div>
                    <div style={styles.bookingInfoItem}>
                      <span>Attendees</span>
                      <strong>{booking.expectedAttendees}</strong>
                    </div>
                  </div>

                  <div style={styles.purposeCard}>
                    <span style={styles.purposeLabel}>Purpose</span>
                    <p style={styles.purposeValue}>{booking.purpose}</p>
                  </div>

                  {booking.adminReason && (
                    <div style={styles.noteCard}>
                      <strong>Admin Note:</strong> {booking.adminReason}
                    </div>
                  )}

                  {String(booking.status).toUpperCase() === "APPROVED" && (
                    <div style={styles.cardActions}>
                      <button
                        type="button"
                        style={styles.cancelBtn}
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
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: "34px 48px 56px",
  },
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "26px 28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    flexWrap: "wrap",
    marginBottom: "26px",
  },
  smallTag: {
    display: "inline-block",
    backgroundColor: "#f8fafc",
    color: "#1e3a8a",
    border: "1px solid #dbeafe",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "12px",
  },
  pageTitle: {
    margin: "0 0 8px",
    fontSize: "32px",
    color: "#1e293b",
  },
  pageSubtitle: {
    margin: 0,
    color: "#64748b",
    lineHeight: "1.8",
    maxWidth: "760px",
  },
  topStats: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    alignItems: "stretch",
  },
  statCard: {
    minWidth: "170px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "700",
  },
  statNumber: {
    color: "#1e3a8a",
    fontSize: "30px",
    fontWeight: "800",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(300px, 1fr)",
    gap: "24px",
    marginBottom: "24px",
  },
  sideColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },
  ruleCard: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "22px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  cardTopCompact: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#1e293b",
  },
  cardDesc: {
    margin: "6px 0 0",
    color: "#64748b",
    lineHeight: "1.7",
  },
  cardBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor: "#fefce8",
    color: "#a16207",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid #fde68a",
  },
  infoCardTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#1e293b",
  },
  readyTag: {
    padding: "7px 11px",
    borderRadius: "999px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: "12px",
    fontWeight: "700",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    padding: "12px 14px",
    borderRadius: "14px",
    marginBottom: "18px",
    fontWeight: "600",
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
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    outline: "none",
    fontSize: "15px",
  },
  select: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    outline: "none",
    fontSize: "15px",
  },
  textarea: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    outline: "none",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  helpText: {
    fontSize: "12px",
    color: "#64748b",
  },
  submitBtn: {
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
  summaryBox: {
    marginTop: "20px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "16px",
  },
  summaryTitle: {
    margin: "0 0 14px",
    color: "#1e293b",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
  },
  summaryItem: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    color: "#475569",
  },
  previewBox: {
    marginTop: "20px",
    backgroundColor: "#fffdf5",
    border: "1px solid #fef3c7",
    borderRadius: "16px",
    padding: "16px",
  },
  previewTitle: {
    margin: "0 0 12px",
    color: "#1e293b",
  },
  previewWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  previewItem: {
    backgroundColor: "#ffffff",
    border: "1px solid #fde68a",
    borderRadius: "999px",
    padding: "9px 12px",
    color: "#92400e",
    fontSize: "13px",
    fontWeight: "700",
  },
  skippedList: {
    marginTop: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  skippedItem: {
    backgroundColor: "#fff7ed",
    border: "1px solid #fdba74",
    color: "#9a3412",
    borderRadius: "12px",
    padding: "10px 12px",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  emptyInfo: {
    color: "#64748b",
    margin: 0,
    lineHeight: "1.7",
  },
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px 14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    color: "#334155",
  },
  ruleList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "14px",
  },
  ruleItem: {
    backgroundColor: "#fffdf5",
    border: "1px solid #fef3c7",
    color: "#475569",
    borderRadius: "14px",
    padding: "12px 14px",
    fontWeight: "600",
    lineHeight: "1.7",
  },
  availabilityCard: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
    marginBottom: "24px",
  },
  placeholder: {
    backgroundColor: "#f8fafc",
    border: "1px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "18px",
    color: "#64748b",
  },
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },
  slotCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "18px",
  },
  slotTitle: {
    margin: "0 0 14px",
    fontSize: "18px",
    color: "#1e293b",
  },
  slotWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  bookedSlot: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    borderRadius: "999px",
    padding: "10px 13px",
    fontWeight: "700",
    fontSize: "13px",
  },
  availableSlot: {
    backgroundColor: "#ecfccb",
    color: "#166534",
    border: "1px solid #bbf7d0",
    borderRadius: "999px",
    padding: "10px 13px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
  },
  slotEmpty: {
    backgroundColor: "#ffffff",
    border: "1px dashed #d1d5db",
    borderRadius: "14px",
    padding: "14px",
    color: "#64748b",
  },
  myBookingsSection: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  filterBox: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    minWidth: "320px",
    maxWidth: "520px",
    width: "100%",
  },
  secondaryBtn: {
    backgroundColor: "#334155",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    padding: "13px 18px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  emptyState: {
    backgroundColor: "#f8fafc",
    border: "1px dashed #cbd5e1",
    borderRadius: "18px",
    padding: "42px 24px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  emptyTitle: {
    margin: "0 0 8px",
    color: "#1e293b",
  },
  emptyText: {
    margin: 0,
    color: "#64748b",
  },
  bookingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
    gap: "18px",
  },
  bookingCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)",
  },
  bookingCardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  bookingTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#1e293b",
  },
  bookingSubTitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },
  repeatTag: {
    display: "inline-block",
    marginBottom: "14px",
    backgroundColor: "#eff6ff",
    color: "#1e3a8a",
    border: "1px solid #bfdbfe",
    borderRadius: "999px",
    padding: "7px 12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  statusBadge: {
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  bookingInfoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },
  bookingInfoItem: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  purposeCard: {
    backgroundColor: "#fffdf5",
    border: "1px solid #fef3c7",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "14px",
  },
  purposeLabel: {
    display: "block",
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: "6px",
  },
  purposeValue: {
    margin: 0,
    color: "#475569",
    lineHeight: "1.7",
  },
  noteCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    padding: "13px 14px",
    color: "#334155",
    lineHeight: "1.7",
  },
  cardActions: {
    marginTop: "16px",
    display: "flex",
    gap: "10px",
  },
  cancelBtn: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "11px 15px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default BookingsPage;