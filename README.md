# 🎓 Smart Campus Operations Hub

Smart Campus Operations Hub is a modern smart campus management platform developed to improve how university resources, bookings, maintenance requests, and notifications are handled in one centralized system.

This project was developed for the **Programming Applications and Frameworks (IT3030)** module.

---

## 📌 **Project Overview**

Smart Campus Operations Hub is a **full-stack web application** that helps universities manage day-to-day campus operations efficiently.

The system allows users to:

- Manage campus resources (labs, halls, equipment)
- Request and manage bookings
- Create and track support tickets
- Receive real-time notifications
- Access system using secure authentication

---

## 🚀 **Main Features**

### 🏫 **Resource Management**
- Add, update, delete resources  
- Upload images  
- Manage type, location, capacity, availability  
- Search and filter resources  

---

### 📅 **Booking Management**
- Request bookings  
- Approve / reject bookings  
- Prevent booking conflicts  
- Cancel or update bookings  
- Track booking status  

---

### 🎫 **Ticket Management**
- Create maintenance tickets  
- Assign tickets to staff  
- Update ticket status  
- Manage issue tracking  

---

### 🔔 **Notification System**
- Real-time notifications  
- Booking updates  
- Ticket updates  
- Notification preferences  

---

### 🔐 **Authentication & Authorization**
- Secure login (Google OAuth2)  
- Role-based access control  
- Protected routes  

---

## 🧰 **Tech Stack**

### 🔹 Backend
- Java  
- Spring Boot  
- Spring Data JPA  
- Spring Security  
- Maven  

### 🔹 Frontend
- React  
- Vite  
- Axios  

### 🔹 Database
- MySQL  

---

## 👥 **User Roles**

### 👤 USER
- Browse resources  
- Create bookings  
- Manage own tickets  

### 🧑‍💼 ADMIN
- Manage resources  
- Manage bookings  
- Manage users  

### 🛠️ STAFF
- Handle assigned tickets  
- Update ticket status  

---

## 📦 **Project Modules**

1. **Facilities & Assets Management**  
2. **Booking Management**  
3. **Ticket Management**  
4. **Notification Management**  
5. **Authentication & Authorization**  

---

## 👨‍💻 **Team Members**

| Name | Registration No | Responsibility |
|------|---------------|---------------|
| **Hashini Marasinghe** | IT23809642 | Facilities Module + Admin Dashboard |
| Member 2 | XXXXXXXX | Booking System |
| Member 3 | XXXXXXXX | Ticket System |
| Member 4 | XXXXXXXX | Authentication & Notifications |

---

## 🏗️ **System Architecture**

- **Frontend** → User Interface (React)  
- **Backend** → REST APIs (Spring Boot)  
- **Database** → MySQL  
- **WebSocket** → Real-time notifications  

---

## 🔗 **Sample API Endpoints**

### 📌 Resources
```bash
GET    /api/resources
POST   /api/resources
PUT    /api/resources/{id}
DELETE /api/resources/{id}