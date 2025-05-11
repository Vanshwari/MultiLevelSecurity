# Identity-Based Access Control (IBAC) System

A secure, blockchain-based access control system that implements role-based access control (RBAC) and identity-based access control (IBAC) using smart contracts and AES encryption.

## Features

### Smart Contract Features
- **Role-Based Access Control**
  - Patient: Basic access to personal data
  - Doctor: Full access to patient data, can add new users
  - Nurse: Limited access to patient data
- **Security Levels**
  - Confidential: Basic security level
  - Secret: Medium security level
  - TopSecret: Highest security level
- **Session Management**
  - Time-based session expiration
  - Secure session validation
  - Automatic session termination
- **Access Control Lists**
  - Resource-level access control
  - Role-based permissions
  - Security level restrictions

### Frontend Features
- **Wallet Integration**
  - MetaMask support
  - Automatic network detection
  - Account change handling
- **Data Encryption**
  - AES-256-CBC encryption
  - Secure key management
  - IV generation for each encryption
- **User Interface**
  - Role-based dashboard
  - Security level indicators
  - Access control management
  - Session management

## Technical Architecture

### Smart Contract (IBAC.sol)
```solidity
// Core Data Structures
struct User {
    bool isRegistered;
    bool isActive;
    Role role;
    SecurityLevel securityLevel;
    string encryptedPrivateKey;
}

struct Resource {
    string encryptedContent;
    string encryptedIV;
    SecurityLevel securityLevel;
    mapping(address => bool) accessList;
}
```

### Frontend Components
- **Web3Context.js**: Manages blockchain interactions and encryption
- **Dashboard.js**: Role-based user interface
- **App.css**: Styled components and security indicators

## Security Features

### Data Protection
1. **Encryption**
   - AES-256-CBC for data encryption
   - Unique IV for each encryption
   - Secure key storage
2. **Access Control**
   - Role-based permissions
   - Security level restrictions
   - Resource-level access lists

### Authentication
1. **Wallet Authentication**
   - ECDSA signature verification
   - Nonce-based authentication
   - Session management
2. **Role Management**
   - Doctor: Can add patients and nurses
   - Nurse: Limited access to patient data
   - Patient: Access to personal data only

## Setup Instructions

1. **Prerequisites**
   ```bash
   Node.js >= 14.0.0
   MetaMask browser extension
   Testnet ETH (Sepolia)
   ```

2. **Installation**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd lbac-frontend

   # Install dependencies
   npm install

   # Create environment file
   cp .env.example .env
   ```

3. **Environment Configuration**
   ```env
   REACT_APP_CONTRACT_ADDRESS=your_contract_address
   REACT_APP_NETWORK_ID=11155111 # Sepolia
   ```

4. **Start Development Server**
   ```bash
   npm start
   ```

## Contract Deployment and Frontend Connection

### 1. Deploy Smart Contract

1. **Setup Remix IDE**
   - Go to [Remix IDE](https://remix.ethereum.org/)
   - Create a new file named `IBAC.sol`
   - Copy the contract code into the file

2. **Compile Contract**
   - Select Solidity compiler version 0.8.0 or higher
   - Click "Compile IBAC.sol"
   - Ensure there are no compilation errors

3. **Deploy to Sepolia**
   - Connect MetaMask to Remix
   - Select "Injected Provider - MetaMask" as the environment
   - Switch MetaMask to Sepolia network
   - Click "Deploy" button
   - Confirm the transaction in MetaMask
   - Save the deployed contract address

4. **Verify Contract**
   - Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
   - Search for your contract address
   - Click "Contract" tab
   - Click "Verify & Publish"
   - Fill in the verification details:
     - Compiler version
     - Optimization settings
     - Contract address
     - Constructor arguments (if any)
   - Submit for verification

### 2. Connect Contract to Frontend

1. **Get Contract ABI**
   - In Remix, go to the "Compile" tab
   - Click "ABI" button to copy the contract ABI
   - Create a new file `src/contracts/IBAC.json`
   - Paste the ABI into the file

2. **Update Contract Address**
   - Open `src/context/Web3Context.js`
   - Update the `contractAddress` constant with your deployed contract address:
   ```javascript
   const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
   ```

3. **Test Connection**
   - Start the frontend application: `npm start`
   - Connect your MetaMask wallet
   - Try to verify credentials
   - Check the browser console for any errors

### 3. Environment Configuration

1. **Create Environment File**
   - Create `.env` file in the root directory
   - Add the following variables:
   ```
   REACT_APP_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS
   REACT_APP_NETWORK_ID=11155111  # Sepolia network ID
   ```

2. **Update Web3Context**
   - Modify `Web3Context.js` to use environment variables:
   ```javascript
   const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
   ```

### 4. Testing the Integration

1. **Basic Functionality Test**
   - Connect wallet
   - Verify credentials
   - Store encrypted data
   - Grant access to another address
   - Check access permissions

2. **Error Handling Test**
   - Test with wrong network
   - Test with insufficient gas
   - Test with invalid signatures
   - Test with expired sessions

3. **Security Test**
   - Verify encryption
   - Check access control
   - Test session management
   - Verify data integrity

### 5. Common Deployment Issues

1. **Contract Deployment Failures**
   - Insufficient gas
   - Wrong network
   - Compilation errors
   - Constructor arguments mismatch

2. **Frontend Connection Issues**
   - Wrong contract address
   - ABI mismatch
   - Network configuration
   - MetaMask connection

3. **Verification Issues**
   - Compiler version mismatch
   - Constructor arguments
   - Optimization settings
   - Contract source code

### 6. Maintenance

1. **Contract Updates**
   - Deploy new version
   - Update contract address
   - Migrate data if needed
   - Update frontend references

2. **Frontend Updates**
   - Update contract ABI
   - Update environment variables
   - Test all functionality
   - Deploy new version

## Usage Guide

### For Doctors
1. Connect wallet
2. Register as doctor
3. Add patients and nurses
4. Manage access control
5. Store encrypted data

### For Nurses
1. Connect wallet
2. Wait for doctor to add you
3. Access authorized patient data
4. Update patient records

### For Patients
1. Connect wallet
2. Register as patient
3. Access personal data
4. View access history

## Security Best Practices

1. **Key Management**
   - Never store private keys in plain text
   - Use secure key storage methods
   - Implement key rotation

2. **Access Control**
   - Follow principle of least privilege
   - Regular access review
   - Immediate revocation of access

3. **Data Protection**
   - Encrypt all sensitive data
   - Use unique IVs
   - Implement proper key management

## Troubleshooting

### Common Issues
1. **Wallet Connection**
   - Ensure MetaMask is installed
   - Check network configuration
   - Verify account permissions

2. **Transaction Failures**
   - Check gas limits
   - Verify account balance
   - Ensure proper permissions

3. **Access Denied**
   - Verify role permissions
   - Check security level
   - Confirm access list membership

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## License

MIT License - See LICENSE file for details

## Support

For support, please open an issue in the repository or contact the development team.