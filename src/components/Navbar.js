import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Link } from 'react-router-dom';

function Navbar() {
    const { account, isAuthenticated, connectWallet, isConnecting } = useWeb3();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Multi-Level Security System</Link>
            </div>
            <div className="navbar-menu">
                {isAuthenticated && (
                    <Link to="/dashboard" className="navbar-item">
                        Dashboard
                    </Link>
                )}
                <div className="navbar-item">
                    {!account ? (
                        <button 
                            className="connect-button"
                            onClick={connectWallet}
                            disabled={isConnecting}
                        >
                            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                        </button>
                    ) : (
                        <span className="account-info">
                            {`${account.slice(0, 6)}...${account.slice(-4)}`}
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar; 