import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // corrected import

const GuideProfilePage = () => {
    const guideId = jwtDecode(localStorage.getItem('token')).id; // Get guideId from the token
    const [guide, setGuide] = useState(null);
    const [reviews, setReviews] = useState([]); // Holds reviews for the guide
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false); // Track whether we are in "edit" mode
    const [updatedGuide, setUpdatedGuide] = useState(null); // Holds updated guide info
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch guide details based on the guideId
        const fetchGuideDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/guides/${guideId}`);
                setGuide(response.data);
                setUpdatedGuide(response.data); // Initialize updatedGuide with fetched data
                setLoading(false);
            } catch (error) {
                console.error("Error fetching guide details:", error);
                setLoading(false);
            }
        };

        // Fetch reviews and calculate average rating
        const fetchReviewsAndCalculateRating = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/reviews/guides/${guideId}`);
                const reviewsData = response.data.review;
                setReviews(reviewsData);

                if (reviewsData.length > 0) {
                    // Calculate average rating
                    const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
                    const averageRating = totalRating / reviewsData.length;

                    // Update guide with the new ratings
                    await axios.put(`http://localhost:5000/guides/${guideId}`, {
                        ...updatedGuide,
                        ratings: {
                            averageRating: averageRating.toFixed(1),
                            numberOfReviews: reviewsData.length,
                        },
                    });

                    // Update guide state with new ratings
                    setGuide((prevGuide) => ({
                        ...prevGuide,
                        ratings: {
                            averageRating: averageRating.toFixed(1),
                            numberOfReviews: reviewsData.length,
                        },
                    }));
                }
            } catch (error) {
                console.error("Error fetching reviews and calculating rating:", error);
            }
        };

        fetchGuideDetails();
        fetchReviewsAndCalculateRating();
    }, [guideId]);

    const handleEditToggle = () => {
        setEditing(!editing); // Toggle between edit and view mode
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "languages") {
            // Handle languages input as a comma-separated string and convert to array
            const languagesArray = value.split(',').map(lang => lang.trim());
            setUpdatedGuide({
                ...updatedGuide,
                languages: languagesArray,
            });
        } else {
            setUpdatedGuide({
                ...updatedGuide,
                [name]: value,
            });
        }
    };

    const handleNestedChange = (e, parentKey) => {
        const { name, value } = e.target;
        setUpdatedGuide({
            ...updatedGuide,
            [parentKey]: {
                ...updatedGuide[parentKey],
                [name]: value,
            },
        });
    };

    const handleAvailabilityDateChange = (index, field, value) => {
        const updatedDates = [...updatedGuide.availableDates];
        updatedDates[index] = { ...updatedDates[index], [field]: value };
        setUpdatedGuide({
            ...updatedGuide,
            availableDates: updatedDates,
        });
    };

    const handleAddDateRange = () => {
        setUpdatedGuide({
            ...updatedGuide,
            availableDates: [...updatedGuide.availableDates, { startDate: '', endDate: '' }],
        });
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`http://localhost:5000/guides/${guideId}`, updatedGuide);
            alert('Guide details updated successfully');
            setGuide(updatedGuide); // Save changes to guide data
            setEditing(false); // Exit edit mode
            navigate('/GuideProfilePage'); // Optional: Redirect to another page after saving
        } catch (error) {
            console.error('Error updating guide details:', error);
            alert('Error occurred while saving guide details');
        }
    };

    const handleCancel = () => {
        setUpdatedGuide(guide); // Revert changes to original guide data
        setEditing(false); // Exit edit mode
    };

    if (loading) {
        return <p>Loading guide details...</p>;
    }

    if (!guide) {
        return <p>Guide not found!</p>;
    }

    return (
        <div className="guide-profile-container">
            <div>
                <Link to={'/guideHome'}>Home Page</Link>
                <Link to={`/GuideProfilePage`}>Profile Page</Link>
            </div>
            <h1>Guide Profile</h1>

            {/* Guide Bio Section */}
            <div className="guide-bio">
                <h2>{editing ? (
                    <input
                        type="text"
                        name="name"
                        value={updatedGuide.name}
                        onChange={handleChange}
                    />
                ) : (
                    guide.name
                )}</h2>
                <p>
                    <strong>Username:</strong> {guide.username}
                </p>
                <p>
                    <strong>Experience:</strong> {editing ? (
                        <input
                            type="number"
                            name="experience"
                            value={updatedGuide.experience}
                            onChange={handleChange}
                        />
                    ) : (
                        `${guide.experience} years`
                    )}
                </p>
                <p>
                    <strong>Languages Spoken:</strong> {editing ? (
                        <input
                            type="text"
                            name="languages"
                            value={updatedGuide.languages.join(', ')} // Display as comma-separated string
                            onChange={handleChange}
                        />
                    ) : (
                        guide.languages.join(', ') // Show languages as comma-separated string
                    )}
                </p>
                <p>
                    <strong>Location:</strong> {editing ? (
                        <input
                            type="text"
                            name="location"
                            value={updatedGuide.location}
                            onChange={handleChange}
                        />
                    ) : (
                        guide.location || 'N/A'
                    )}
                </p>
            </div>

            {/* Guide Availability Section */}
            <div className="guide-availability">
                <h3>Availability & Packages</h3>
                {editing ? (
                    <>
                        {updatedGuide.availableDates.map((dateRange, index) => (
                            <div key={index} className="date-range">
                                <label>Start Date:</label>
                                <input
                                    type="date"
                                    value={dateRange.startDate}
                                    onChange={(e) =>
                                        handleAvailabilityDateChange(index, 'startDate', e.target.value)
                                    }
                                />
                                <label>End Date:</label>
                                <input
                                    type="date"
                                    value={dateRange.endDate}
                                    onChange={(e) =>
                                        handleAvailabilityDateChange(index, 'endDate', e.target.value)
                                    }
                                />
                            </div>
                        ))}
                        <button onClick={handleAddDateRange}>Add Date Range</button>
                    </>
                ) : (
                    guide.availableDates && guide.availableDates.length > 0 ? (
                        <ul>
                            {guide.availableDates.map((dateRange, index) => (
                                <li key={index}>
                                    <strong>From:</strong> {new Date(dateRange.startDate).toLocaleDateString()}
                                    <strong> To:</strong> {new Date(dateRange.endDate).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No available dates provided</p>
                    )
                )}
            </div>

            {/* Ratings Section */}
            <div className="guide-ratings">
                <h3>Ratings</h3>
                <p><strong>Average Rating:</strong> {guide.ratings.averageRating} / 5</p>
                <p><strong>Number of Reviews:</strong> {guide.ratings.numberOfReviews}</p>
            </div>

            {/* Contact Section */}
            <div className="guide-contact">
                <h3>Contact Information</h3>
                <p><strong>Phone:</strong> {editing ? (
                    <input
                        type="text"
                        name="phone"
                        value={updatedGuide.contact.phone}
                        onChange={(e) => handleNestedChange(e, 'contact')}
                    />
                ) : (
                    guide.contact.phone
                )}</p>
                <p><strong>Email:</strong> {editing ? (
                    <input
                        type="email"
                        name="email"
                        value={updatedGuide.contact.email}
                        onChange={(e) => handleNestedChange(e, 'contact')}
                    />
                ) : (
                    guide.contact.email
                )}</p>
            </div>

            {/* Edit and Save/Cancel Buttons */}
            <div className="edit-save-buttons">
                {editing ? (
                    <>
                        <button className="save-button" onClick={handleSaveChanges}>
                            Save Changes
                        </button>
                        <button className="cancel-button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button className="edit-button" onClick={handleEditToggle}>
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default GuideProfilePage;
