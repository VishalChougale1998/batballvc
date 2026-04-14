import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const isLoggedIn = localStorage.getItem("adminLoggedIn");

    if (isLoggedIn !== "true") {
        return <Navigate to="/admin-login" />;
    }

    return children;
}

export default ProtectedRoute;