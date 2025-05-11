import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';

function Home() {
    const { account, isAuthenticated, verifyUser } = useWeb3();
    const navigate = useNavigate();

    const handleVerify = async () => {
        const success = await verifyUser();
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="home-container">
            <div className="auth-section">
                <h1>Multi-Level Security System</h1>
                <div className="status-section">
                    <p>Connected Account: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not Connected'}</p>
                    <p>Authentication Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
                </div>
                
                {account && !isAuthenticated && (
                    <div className="verify-section">
                        <h2>Authentication Required</h2>
                        <p>Please verify your credentials to access the system.</p>
                        <button 
                            className="verify-button"
                            onClick={handleVerify}
                        >
                            Verify Credentials
                        </button>
                    </div>
                )}

                {isAuthenticated && (
                    <div className="welcome-section">
                        <h2>Welcome to the System</h2>
                        <p>You are now authenticated and can access the dashboard.</p>
                        <button 
                            className="dashboard-button"
                            onClick={() => navigate('/dashboard')}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home; 