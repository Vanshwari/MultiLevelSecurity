import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { isAuthenticated, encryptAndStoreData, grantAccess, endSession } = useWeb3();
    const navigate = useNavigate();
    const [resource, setResource] = useState('');
    const [data, setData] = useState('');
    const [userAddress, setUserAddress] = useState('');

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleStoreData = async () => {
        if (!resource || !data) {
            alert('Please fill in all fields');
            return;
        }
        const success = await encryptAndStoreData(resource, data);
        if (success) {
            alert('Data stored successfully!');
            setResource('');
            setData('');
        } else {
            alert('Failed to store data!');
        }
    };

    const handleGrantAccess = async () => {
        if (!userAddress || !resource) {
            alert('Please fill in all fields');
            return;
        }
        const success = await grantAccess(userAddress, resource);
        if (success) {
            alert('Access granted successfully!');
            setUserAddress('');
        } else {
            alert('Failed to grant access!');
        }
    };

    const handleEndSession = async () => {
        const success = await endSession();
        if (success) {
            alert('Session ended successfully!');
            navigate('/');
        } else {
            alert('Failed to end session!');
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            
            <div className="dashboard-section">
                <h2>Store Encrypted Data</h2>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Resource Name"
                        value={resource}
                        onChange={(e) => setResource(e.target.value)}
                    />
                    <textarea
                        placeholder="Data to Encrypt"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                    />
                    <button onClick={handleStoreData}>Store Data</button>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>Grant Access</h2>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="User Address"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Resource Name"
                        value={resource}
                        onChange={(e) => setResource(e.target.value)}
                    />
                    <button onClick={handleGrantAccess}>Grant Access</button>
                </div>
            </div>

            <div className="dashboard-section">
                <h2>Session Management</h2>
                <button onClick={handleEndSession} className="end-session-button">
                    End Session
                </button>
            </div>
        </div>
    );
}

export default Dashboard; 