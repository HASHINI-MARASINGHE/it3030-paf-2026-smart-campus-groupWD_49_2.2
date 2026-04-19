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
| **M A H M Marasinghe** | IT23809642 | Facilities Module + Admin Dashboard |
| **R M R M Rajapaksha** | IT23663886 | Booking System |
| **D S G GOMIS**        | IT23844988 | Ticket System |
| **K N B Kaluarachchi** | IT23830400 | Authentication & Notifications |

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

### 📌 Bookings
```bash
POST   /api/bookings/resource/{resourceId}
GET    /api/bookings/my
GET    /api/bookings
PUT    /api/bookings/{id}/resource/{resourceId}
PATCH  /api/bookings/{id}/cancel
PATCH  /api/bookings/{id}/approve
PATCH  /api/bookings/{id}/reject
DELETE /api/bookings/{id}

### 📌 Tickets
```bash
POST   /api/tickets
GET    /api/tickets/my
GET    /api/tickets/assigned
GET    /api/tickets
PUT    /api/tickets/{id}
PATCH  /api/tickets/{id}/assign
PATCH  /api/tickets/{id}/status
DELETE /api/tickets/{id}
```
### 📌 Authentication
```bash
GET    /api/auth/test
GET    /api/auth/me
GET    /api/auth/debug-role
POST   /api/auth/logout
GET    /api/admin/users
POST   /api/admin/users
PUT    /api/admin/users/{id}
DELETE /api/admin/users/{id}
```

### 📌 Notifications
```bash
GET    /api/notifications
PATCH  /api/notifications/{id}/read
DELETE /api/notifications/{id}
GET    /api/notifications/preferences
PUT    /api/notifications/preferences
```
---

## ⚙️ **Setup Instructions**

### 🔹 1. Clone Repository
```bash
git clone YOUR_REPO_LINK
cd smart-campus-groupWD_46_2.2
```

### 🔹 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Runs on: http://localhost:8080  

### 🔹 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Runs on: http://localhost:5173  

---

## 🗄️ **Environment Configuration**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartcampus
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 🔄 **Git Workflow**

- main → stable version  
- develop → integration branch  
- member branches → feature development  

---

## 🧪 **Testing**

- API testing using Postman  
- UI testing  
- CRUD testing  
- booking conflict testing  
- role-based testing  

---

## 🔐 **Authentication Flow**

- User logs in  
- Backend validates  
- Role assigned  
- Redirect based on role  

---

## 🔔 **Notification Flow**

- Event occurs  
- Notification created  
- Stored in DB  
- Sent to user  

---

## 🎓 **Academic Context**

- Module: IT3030 – PAF  
- Group: WD_46_2.2  
- University: SLIIT  

---
## 📜 **License**

Academic purposes only
