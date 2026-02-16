import { jwtDecode } from "jwt-decode";

export const getCurrentUserData = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token)
        return {
            _id: decoded._id,
            role: decoded.role
        }
    } catch (error) {
        console.error("Invalid token");
        return null;
    }
}