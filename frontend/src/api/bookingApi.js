import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/bookings",
});

export const createBooking = (bookingData) => API.post("", bookingData);

export const getAllBookings = (params = {}) =>
  API.get("", {
    params,
  });

export const getMyBookings = (email) =>
  API.get("/my-bookings", {
    params: { email },
  });

export const getBookingById = (id) => API.get(`/${id}`);

export const reviewBooking = (id, reviewData) =>
  API.patch(`/${id}/review`, reviewData);

export const cancelBooking = (id) => API.patch(`/${id}/cancel`);