import React, { useState, useEffect } from 'react';
// import './MyPayout.css';

const MyPayout = () => {
    const [payouts, setPayouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPayouts = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/executive/my-payout`;
                const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
                if (!response.ok) throw new Error('Failed to fetch payout history.');
                const data = await response.json();
                setPayouts(data.data.payouts || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPayouts();
    }, []);

    if (isLoading) return <div>Loading payout history...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="page">
            <h1 className="section-title">My Payout History</h1>
            {payouts.length > 0 ? (
                <div className="salary-table-container">
                     <table className="salary-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Amount</th>
                                <th>Date Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payouts.map(p => (
                                <tr key={p._id}>
                                    <td>{p.month}</td>
                                    <td className="amount-text">₹{p.amount.toLocaleString()}</td>
                                    <td>{new Date(p.datePaid).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No payout history found.</p>
            )}
        </div>
    );
};

export default MyPayout;