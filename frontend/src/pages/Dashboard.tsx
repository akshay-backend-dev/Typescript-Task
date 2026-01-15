import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSocket } from "../context/SocketContext";

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
            setLogs((prev) => [
                `Book added: ${data.title}`,
                ...prev,
            ]);
        });

        socket.on("user:logged-in", (data) => {
            setLogs((prev) => [
                `User logged in: ${data.email}`,
                ...prev,
            ]);
        });

        socket.on("user:signed-up", (data) => {
            setLogs((prev) => [
                `New user signed up: ${data.email}`,
                ...prev,
            ]);
        });

        return () => {
            socket.off("book:added");
            socket.off("user:logged-in");
            socket.off("user:signed-up");
        };
    }, [socket]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>

            <h2>Total Books: {booksCount}</h2>

            <hr />

            <h3>Real-time Activity</h3>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>{log}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;