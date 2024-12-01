import React, { useState } from "react";
import "./styles.css"; // Import CSS file with styling from the second code

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    Name: "",
    phno: "",
    gmail: "",
    password: "",
    role: "customer", // Default role
  });
  if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters long";
  }
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = async () => {
    const newErrors = {};

    // Check if email contains '@'
    if (!formData.gmail.includes("@")) {
      newErrors.gmail = 'Email must contain "@"';
    }

    // Check if password is at least 6 characters long
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = await validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/customers/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          username: "",
          Name: "",
          phno: "",
          gmail: "",
          password: "",
          role: "customer",
        });
        setErrors({});
        console.log("Signup successful!");
      } else {
        const data = await response.json();
        console.log(data.error);
        console.log("Signup failed.");
      }
    } catch (err) {
      console.error("Error signing up:", err);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label className="block font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="input input-bordered w-full max-w-md mb-4"
            required
          />
          {errors.username && (
            <p className="error-message">{errors.username}</p>
          )}
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            className="input input-bordered w-full max-w-md mb-4"
            required
          />
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="text"
            name="phno"
            value={formData.phno}
            onChange={handleInputChange}
            className="input input-bordered w-full max-w-md mb-4"
            required
          />
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="gmail"
            value={formData.gmail}
            onChange={handleInputChange}
            className="input input-bordered w-full max-w-md mb-4"
            required
          />
          {errors.gmail && <p className="error-message">{errors.gmail}</p>}
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="input input-bordered w-full max-w-md mb-4"
            required
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>
        <div className="form-group">
          <label className="block font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="select select-bordered w-full max-w-md mb-4"
            required
          >
            <option value="customer">Customer</option>
            <option value="travel agency">Travel Agency</option>
            <option value="guide">Guide</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
