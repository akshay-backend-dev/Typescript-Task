import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";
import "./dashboard.css";

const Dashboard = () => {
    const { socket } = useSocket();
    const [booksCount, setBooksCount] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        api.get("/api/books").then((res) => {
            setBooksCount(res.data.length);
        });
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("book:added", (data) => {
            setBooksCount((prev) => prev + 1);
            setLogs((prev) => [`Book added: ${data.title}`, ...prev]);
        });

        socket.on("user:logged-in", (data) => {
            setLogs((prev) => [`User logged in: ${data.email}`, ...prev]);
        });

        socket.on("user:signed-up", (data) => {
            setLogs((prev) => [`New user signed up: ${data.email}`, ...prev]);
        });

        return () => {
            socket.off("book:added");
            socket.off("user:logged-in");
            socket.off("user:signed-up");
        };
    }, [socket]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        window.location.reload();
    };

    return (
        <div className="main-screen">
            <div className="card">

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>

                <p className="main-heading">
                    Admin Dashboard
                    <span className="bottom-line"></span>
                </p>
                <p className="count-heading">Total Books: {booksCount}</p>

                {logs.length > 0 && (
                    <>
                        <p className="activity-heading">Real-time Activity :</p>
                        <ul className="activity-list">
                            {logs.map((log, index) => (
                                <li key={index}>{log}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;