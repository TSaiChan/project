import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const { user_id, plot_id, org_id } = user;

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`/api/user/notifications/${plot_id}/${org_id}/${user_id}`);
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to fetch notifications", "error");
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/user/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (plot_id && org_id && user_id) fetchNotifications();
    }, []);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent":
                return "#ff4d4d";
            case "high":
                return "#ffa500";
            case "normal":
                return "#4caf50";
            case "low":
                return "#2196f3";
            default:
                return "#ccc";
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h2 style={{ textAlign: "center", color: "#333" }}>📢 Notifications</h2>
            {notifications.length === 0 ? (
                <p style={{ textAlign: "center", color: "#666" }}>No notifications yet.</p>
            ) : (
                notifications.map((note) => (
                    <div
                        key={note.notification_id}
                        onClick={() => markAsRead(note.notification_id)}
                        style={{
                            backgroundColor: note.status === "unread" ? "#fff8e1" : "#f0f0f0",
                            padding: "16px",
                            margin: "12px 0",
                            borderLeft: `6px solid ${getPriorityColor(note.priority)}`,
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "background-color 0.3s"
                        }}
                    >
                        <h4 style={{ margin: "0 0 8px" }}>{note.title}</h4>
                        <p style={{ margin: "0 0 8px", color: "#555" }}>{note.message}</p>
                        <div style={{ fontSize: "13px", color: "#777" }}>
                            <span>Status: <strong>{note.status}</strong></span> |{" "}
                            <span>Priority: <strong style={{ color: getPriorityColor(note.priority) }}>{note.priority}</strong></span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Notifications;
