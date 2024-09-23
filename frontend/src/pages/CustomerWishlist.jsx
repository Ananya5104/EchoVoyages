import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const CustomerWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const token = localStorage.getItem('token');
    const customerId = token ? jwtDecode(token).id : null;

    useEffect(() => {
        const fetchWishlist = async () => {
            if (customerId) {
                try {
                    const response = await fetch(`http://localhost:5000/wishlist/${customerId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    setWishlist(data);
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                }
            } else {
                console.error('Customer ID is null');
            }
        };
    
        fetchWishlist();
    }, [customerId]);
    

    return (
        <div>
            <h1>Your Wishlist</h1>
            {wishlist.length > 0 ? (
                <ul>
                    {wishlist.map(item => (
                        <li key={item._id}>
                            <h2>{item.packageId.name}</h2>
                            <p>{item.packageId.description}</p>
                            <p>Price: {item.packageId.price}</p>
                            <p>Duration: {item.packageId.duration} days</p>
                            <img
                                src={`http://localhost:5000${item.packageId.image[0]}`} // Assuming there's at least one image
                                alt={`Image of ${item.packageId.name}`}
                                style={{ width: '200px', height: '150px', marginRight: '10px' }}
                            />
                            {/* You can add a button to remove from wishlist here */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No packages in your wishlist.</p>
            )}
        </div>
    );
};

export default CustomerWishlist;
