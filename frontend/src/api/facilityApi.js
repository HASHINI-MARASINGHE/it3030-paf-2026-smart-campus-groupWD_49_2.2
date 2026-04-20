import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/facilities",
});

export const getAllFacilities = () => API.get("");
export const getFacilityById = (id) => API.get(`/${id}`);
export const addFacility = (facilityData) => API.post("", facilityData);
export const updateFacility = (id, facilityData) => API.put(`/${id}`, facilityData);
export const deleteFacility = (id) => API.delete(`/${id}`);

export const searchFacilities = (name) =>
  API.get(`/search?name=${encodeURIComponent(name)}`);

export const filterFacilities = (available) =>
  API.get(`/filter?available=${available}`);

export const filterFacilitiesByType = (type) =>
  API.get(`/filter/type?type=${encodeURIComponent(type)}`);

export const filterFacilitiesByLocation = (location) =>
  API.get(`/filter/location?location=${encodeURIComponent(location)}`);

export const filterFacilitiesByCapacity = (capacity) =>
  API.get(`/filter/capacity?capacity=${capacity}`);

export const filterFacilitiesByStatus = (status) =>
  API.get(`/filter/status?status=${encodeURIComponent(status)}`);