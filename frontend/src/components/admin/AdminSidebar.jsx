import { NavLink, useLocation } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();

  const isFacilitiesActive =
    location.pathname === "/admin/facilities" ||
    location.pathname === "/admin/facilities/add" ||
    location.pathname.startsWith("/admin/facilities/edit/");

  const isBookingsActive = location.pathname === "/admin/bookings";
  const isTicketsActive = location.pathname === "/admin/tickets";

  return (
    <aside style={styles.sidebar}>
      <div>
        <h2 style={styles.brand}>SLIIT Admin</h2>
        <p style={styles.subBrand}>Smart Campus</p>
      </div>

      <nav style={styles.nav}>
        <NavLink
          to="/admin"
          end
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/facilities"
          style={() => ({
            ...styles.link,
            ...(isFacilitiesActive ? styles.activeLink : {}),
          })}
        >
          Facilities
        </NavLink>

        <NavLink
          to="/admin/facilities/add"
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          Add Facility
        </NavLink>

        <NavLink
          to="/admin/bookings"
          style={() => ({
            ...styles.link,
            ...(isBookingsActive ? styles.activeLink : {}),
          })}
        >
          Bookings
        </NavLink>

        <NavLink
          to="/admin/tickets"
          style={() => ({
            ...styles.link,
            ...(isTicketsActive ? styles.activeLink : {}),
          })}
        >
          Tickets
        </NavLink>
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    backgroundColor: "#37424a",
    color: "#fff",
    padding: "25px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    minHeight: "100vh",
  },
  brand: {
    color: "#f4b400",
    marginBottom: "4px",
  },
  subBrand: {
    color: "#ddd",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    padding: "12px 14px",
    borderRadius: "8px",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  activeLink: {
    backgroundColor: "#1f2f6b",
  },
};

export default AdminSidebar;