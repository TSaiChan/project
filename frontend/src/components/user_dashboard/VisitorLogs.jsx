import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const VisitorLogs = () => {
    const [logs, setLogs] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const plotId = user?.plot_id;

    const fetchLogs = async () => {
        try {
            const res = await axios.get(`/api/user/visitors/${plotId}`);
            setLogs(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to fetch visitor logs", "error");
        }
    };

    useEffect(() => {
        if (plotId) fetchLogs();
    }, [plotId]);

    return (
        <div>
            <h2>Visitor Logs</h2>
            {logs.length === 0 ? (
                <p>No visitors found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Visitor</th>
                            <th>Phone</th>
                            <th>Purpose</th>
                            <th>Entry</th>
                            <th>Exit</th>
                            <th>Approved By</th>
                            <th>Security Guard</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.log_id}>
                                <td>{log.visitor_name}</td>
                                <td>{log.visitor_phone}</td>
                                <td>{log.purpose}</td>
                                <td>{log.entry_time?.substring(0, 19).replace("T", " ")}</td>
                                <td>{log.exit_time ? log.exit_time.substring(0, 19).replace("T", " ") : "—"}</td>
                                <td>{log.approved_by || "—"}</td>
                                <td>{log.security_guard}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VisitorLogs;
