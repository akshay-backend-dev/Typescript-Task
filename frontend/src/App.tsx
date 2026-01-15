import { useState } from "react";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("adminToken")
  );

  return (
    <>
      {!token ? (
        <AdminLogin onLogin={() => setToken(localStorage.getItem("adminToken"))} />
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;