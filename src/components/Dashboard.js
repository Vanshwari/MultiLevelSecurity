import React, { useState } from 'react';
import { useWeb3, Role, SecurityLevel } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { 
        account, 
        isAuthenticated, 
        userRole, 
        userSecurityLevel,
        registerUser,
        addPatient,
        addNurse,
        encryptAndStoreData,
        grantAccess,
        endSession 
    } = useWeb3();
    const navigate = useNavigate();
    const [resource, setResource] = useState('');
    const [data, setData] = useState('');
    const [securityLevel, setSecurityLevel] = useState(SecurityLevel.Confidential);
    const [newUserAddress, setNewUserAddress] = useState('');
    const [selectedRole, setSelectedRole] = useState(Role.Patient);

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleRegister = async () => {
        await registerUser();
    };

    const handleAddUser = async () => {
        if (selectedRole === Role.Patient) {
            await addPatient(newUserAddress);
        } else if (selectedRole === Role.Nurse) {
            await addNurse(newUserAddress);
        }
        setNewUserAddress('');
    };

    const handleStoreData = async () => {
        if (!resource || !data) return;
        await encryptAndStoreData(resource, data, securityLevel);
        setResource('');
        setData('');
    };

    const getRoleName = (role) => {
        switch (role) {
            case Role.Patient: return 'Patient';
            case Role.Doctor: return 'Doctor';
            case Role.Nurse: return 'Nurse';
            default: return 'Unknown';
        }
    };

    const getSecurityLevelName = (level) => {
        switch (level) {
            case SecurityLevel.Confidential: return 'Confidential';
            case SecurityLevel.Secret: return 'Secret';
            case SecurityLevel.TopSecret: return 'Top Secret';
            default: return 'Unknown';
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="dashboard">
                <h2>Please authenticate to access the dashboard</h2>
                <button onClick={handleRegister}>Register as Patient</button>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="user-info">
                <p>Account: {account}</p>
                <p>Role: {getRoleName(userRole)}</p>
                <p>Security Level: {getSecurityLevelName(userSecurityLevel)}</p>
            </div>

            {userRole === Role.Doctor && (
                <div className="admin-section">
                    <h3>Add New User</h3>
                    <select 
                        value={selectedRole} 
                        onChange={(e) => setSelectedRole(Number(e.target.value))}
                    >
                        <option value={Role.Patient}>Patient</option>
                        <option value={Role.Nurse}>Nurse</option>
                    </select>
                    <input
                        type="text"
                        placeholder="User Address"
                        value={newUserAddress}
                        onChange={(e) => setNewUserAddress(e.target.value)}
                    />
                    <button onClick={handleAddUser}>Add User</button>
                </div>
            )}

            <div className="data-section">
                <h3>Store Data</h3>
                <input
                    type="text"
                    placeholder="Resource Name"
                    value={resource}
                    onChange={(e) => setResource(e.target.value)}
                />
                <textarea
                    placeholder="Data to encrypt"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />
                <select 
                    value={securityLevel} 
                    onChange={(e) => setSecurityLevel(Number(e.target.value))}
                >
                    <option value={SecurityLevel.Confidential}>Confidential</option>
                    <option value={SecurityLevel.Secret}>Secret</option>
                    <option value={SecurityLevel.TopSecret}>Top Secret</option>
                </select>
                <button onClick={handleStoreData}>Store Data</button>
            </div>

            <button onClick={endSession} className="logout-button">
                End Session
            </button>
        </div>
    );
};

export default Dashboard; 