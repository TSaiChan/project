import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    user_type: "",
    user_name: "",
    password: "",
    org_id: "",
    plot_id: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Convert string IDs to numbers
    const submitData = {
      ...formData,
      org_id: parseInt(formData.org_id) || null,
      plot_id: formData.user_type === 'admin' ? null : parseInt(formData.plot_id) || null,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Please try again.");
    }
    setIsLoading(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Register for GCMS</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user_type">User Type:</label>
            <select
              id="user_type"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="">Select User Type</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
              <option value="tenant">Tenant</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="user_name">Username:</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="org_id">Organization ID:</label>
            <input
              type="number"
              id="org_id"
              name="org_id"
              value={formData.org_id}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {formData.user_type !== 'admin' && (
            <div className="form-group">
              <label htmlFor="plot_id">Plot ID:</label>
              <input
                type="number"
                id="plot_id"
                name="plot_id"
                value={formData.plot_id}
                onChange={handleChange}
                required={formData.user_type !== 'admin'}
                disabled={isLoading}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {message && (
          <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        <div className="login-link">
          <p>Already have an account?</p>
          <button 
            type="button" 
            onClick={handleLoginRedirect}
            className="login-btn"
            disabled={isLoading}
          >
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;