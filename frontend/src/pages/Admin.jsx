import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UsersTable from '../components/UserTable'; // Import UsersTable
import PackagesTable from '../components/PackagesTable'; // Import PackagesTable
import ReviewsTable from '../components/ReviewsTable'
import GuidesTable from '../components/GuideTable';
import BookingsTable from '../components/BookingsTable';

const Admin = () => {
    const [entity, setEntity] = useState('customers'); // Default entity
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [entity]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/admin/${entity}`);
            setData(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEntityChange = (entity) => {
        setEntity(entity);
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div className="entity-selector">
                <button onClick={() => handleEntityChange('customers')}>Users</button>
                <button onClick={() => handleEntityChange('packages')}>Packages</button>
                <button onClick={() => handleEntityChange('reviews')}>Reviews</button>
                <button onClick={() => handleEntityChange('guides')}>Guides</button>
                <button onClick={() => handleEntityChange('bookings')}>Bookings</button>
            </div>
            {entity === 'customers' ? (
                <UsersTable users={data} />
            ) : entity === 'packages' ? (
                <PackagesTable packages={data} />
            ) : entity === 'reviews' ? (
                <ReviewsTable reviews={data} />
            ) : entity === 'guides' ? (
                <GuidesTable guides={data} />
            ) : entity === 'bookings' ? (
                <BookingsTable bookings={data}/>
            ) : (
                <div>No Data Available</div>
            )}
        </div>
    );
};

export default Admin;