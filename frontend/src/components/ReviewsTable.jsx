import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/tables.css'

const ReviewsTable = ({ reviews }) => {
    const now = new Date();
    const revsLast24Hours = reviews.filter(user => {
        const agentCreatedAt = new Date(user.createdAt); // Assuming `createdAt` is the timestamp field
        return (now - agentCreatedAt) < 24 * 60 * 60 * 1000; // Difference in milliseconds
    });
    return (
        <div>
            <h2>Reviews List</h2>
            <div className='head2'>
                Reviews added in the last 24 hours: {revsLast24Hours.length}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>User</th>
                        <th>Package</th>
                        <th>Guide</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Reports</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review, index) => (
                        <tr key={review._id}>
                            <td>{index + 1}</td>
                            <td>{review.customerName}</td>
                            <td>{review.packageName || 'N/A'}</td>
                            <td>{review.guideName || 'N/A'}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                            <td>{new Date(review.date).toLocaleDateString()}</td>
                            <td>{review.status}</td>
                            <td>{review.reports}</td>
                            <td>
                                <div className='linksPacks'>
                                    <Link className='links' to={`/admin/reviews/edit/${review._id}`}>Edit</Link>
                                    <Link className='links' to={`/admin/reviews/delete/${review._id}`}>Delete</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewsTable;
