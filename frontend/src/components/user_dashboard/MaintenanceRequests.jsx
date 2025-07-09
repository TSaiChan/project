import React, { useEffect, useState } from "react";
import axios from "axios";
import RaiseRequest from "./RaiseRequest";
import Swal from "sweetalert2";

const MaintenanceRequests = () => {
    const [requests, setRequests] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const { plot_id, user_id } = user;

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`/api/user/maintenance/${plot_id}`);
            setRequests(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to load requests", "error");
        }
    };

    useEffect(() => {
        if (plot_id) fetchRequests();
    }, [plot_id]);

    const handleCloseForm = () => {
        setOpenForm(false);
        fetchRequests();
    };

    return (
        <div>
            <h2>Maintenance Requests</h2>
            <button onClick={() => setOpenForm(true)}>Raise New Request</button>

            {requests.length === 0 ? (
                <p>No maintenance requests yet.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Resolved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.request_id}>
                                <td>{req.title}</td>
                                <td>{req.category}</td>
                                <td>{req.priority}</td>
                                <td>{req.status}</td>
                                <td>{req.created_at?.substring(0, 10)}</td>
                                <td>{req.resolved_at ? req.resolved_at.substring(0, 10) : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {openForm && (
                <RaiseRequest
                    plot_id={plot_id}
                    user_id={user_id}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default MaintenanceRequests;
