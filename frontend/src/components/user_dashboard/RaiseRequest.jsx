import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./RaiseRequest.css";

const RaiseRequest = ({ plot_id, user_id, onClose = () => { } }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "General",
        priority: "normal",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Get user data from session storage
    const user = JSON.parse(sessionStorage.getItem("user"));
    const resident_id = user?.resident_id; // Use resident_id from session

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose && typeof onClose === 'function') {
                onClose();
            }
        }, 300);
    }, [onClose]);

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 100);

        // Debug: Log user data for troubleshooting
        console.log("🔍 RaiseRequest Debug Info:");
        console.log("User data from session:", user);
        console.log("Plot ID:", plot_id);
        console.log("Resident ID:", resident_id);

        // Add escape key listener
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleClose]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate required data
            if (!plot_id) {
                throw new Error("Plot ID is missing");
            }

            if (!resident_id) {
                throw new Error("Resident ID is missing. Please contact admin.");
            }

            const requestData = {
                plot_id: plot_id,
                resident_id: resident_id, // Use the correct resident_id from session
                title: formData.title,
                description: formData.description,
                category: formData.category,
                priority: formData.priority
            };

            console.log("Submitting request data:", requestData);

            const response = await axios.post("/api/user/maintenance", requestData);

            console.log("Response:", response.data);

            Swal.fire({
                title: "Success!",
                text: "Maintenance request submitted successfully",
                icon: "success",
                background: 'var(--card-bg)',
                color: 'var(--text-color)',
                confirmButtonColor: 'var(--success-color)',
            });

            handleClose();
        } catch (err) {
            console.error("Error submitting request:", err);
            console.error("Error response:", err.response?.data);

            let errorMessage = "Failed to submit request";

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            Swal.fire({
                title: "Error!",
                text: errorMessage,
                icon: "error",
                background: 'var(--card-bg)',
                color: 'var(--text-color)',
                confirmButtonColor: 'var(--error-color)',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const priorityColors = {
        "low": "var(--info-color)",
        "normal": "var(--success-color)",
        "high": "var(--warning-color)",
        "urgent": "var(--error-color)"
    };

    return (
        <div className={`raise-request-overlay ${isVisible ? 'visible' : ''}`}>
            <div className={`raise-request-container ${isVisible ? 'visible' : ''}`}>
                <div className="form-header">
                    <div className="header-content">
                        <div className="header-icon">🔧</div>
                        <div>
                            <h2 className="form-title">Raise New Request</h2>
                            <p className="form-subtitle">Submit your maintenance request</p>
                        </div>
                    </div>
                    <button
                        className="close-btn"
                        onClick={handleClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form className="raise-request-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            📝 Request Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="e.g., Leaking faucet in kitchen"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            📄 Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Provide detailed information about the issue..."
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-textarea"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category" className="form-label">
                                🏷️ Category
                            </label>
                            <div className="select-wrapper">
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="General">🔧 General</option>
                                    <option value="Electrical">⚡ Electrical</option>
                                    <option value="Plumbing">🚰 Plumbing</option>
                                    <option value="Security">🔒 Security</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority" className="form-label">
                                🚨 Priority
                            </label>
                            <div className="select-wrapper">
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="form-select"
                                    style={{ '--priority-color': priorityColors[formData.priority] }}
                                >
                                    <option value="low">🟢 Low</option>
                                    <option value="normal">🟡 Normal</option>
                                    <option value="high">🟠 High</option>
                                    <option value="urgent">🔴 Urgent</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            <span className="btn-icon">❌</span>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`submit-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="btn-icon loading-spinner">⟳</span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">✨</span>
                                    Submit Request
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RaiseRequest;