import { Navigate } from "react-router-dom";

export default function CustomerProtected({ children }) {
  const role = document.cookie
    .split("; ")
    .find(row => row.startsWith("role="))
    ?.split("=")[1];

  if (role !== "Customer") {
    return <Navigate to="/login" />;
  }

  return children;
}
