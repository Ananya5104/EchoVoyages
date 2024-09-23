import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import '../assets/css/updateEntity.css'; // Importing the CSS file

const CustomerInfo = () => {
    const [editing, setEditing] = useState(false);
    const [customer, setCustomer] = useState({});
    const id = jwtDecode(localStorage.getItem('token')).id;
    const navigate = useNavigate();
    const fieldLabels = {
        username: 'Username',
        Name: 'Name',
        phno: 'Phone Number',
        gmail: 'Email',
        gender: 'Gender',
        state: 'State',
        address: 'Address',
    };

    useEffect(() => {
        // Fetch the customer details based on ID
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/customers/${id}`);
                setCustomer(response.data);
            } catch (error) {
                alert('Error fetching customer details');
                console.log(error);
            }
        };

        fetchCustomer();
    }, [id]);

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    // Handle changes in form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleUpdateCustomer = async () => {
        try {
            await axios.put(`http://localhost:5000/customers/${id}`, customer);
            alert('Customer details updated successfully');
            navigate('/custProfilePage'); // Redirect to the customer profile page
        } catch (error) {
            alert('Error occurred while updating customer details');
            console.log(error);
        }
    };

    return (
        <div className="update-container">
            <h1 className="title">Edit Customer Details</h1>
            <div className='customer-profile'>
                <div className="customer-image-logout">
                    <div className='image-edit-div'>
                        <img 
                            src={'./images/empty-profile-pic.png'} 
                            alt="Profile" 
                            style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
                        />
                    </div>
                    <p className="logout-btn">Logout</p>
                </div>
                <div className="customer-info">
                    <div className="heading-profile">
                        <h2>Customer Profile</h2>
                        <button className="edit-profile-btn" onClick={handleEditToggle}>
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                    {editing ? (
                        <div className="update-card">
                            <label>Name</label>
                            <input
                                type="text"
                                name="Name"
                                value={customer.Name || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={customer.username || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phno"
                                value={customer.phno || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            <label>Email</label>
                            <input
                                type="text"
                                name="gmail"
                                value={customer.gmail || ''}
                                onChange={handleChange}
                                className="input-field"
                            />
                            {/* <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={customer.password || ''}
                                onChange={handleChange}
                                className="input-field"
                            /> */}
                            <button onClick={handleUpdateCustomer} className="save-button">
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div>
                        {['Name', 'username', 'phno', 'gmail'].map((field) => (
                            <div className="profile-item" key={field}>
                                <span className="label">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                                <span>{customer[field] || 'N/A'}</span>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerInfo;
