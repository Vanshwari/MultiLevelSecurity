# IBAC - Identity-Based Access Control System

A secure, blockchain-based access control system that implements identity-based authentication and encryption for data protection.

## Features

- Wallet Integration with MetaMask
- Identity-Based Authentication
- AES-256-CBC Data Encryption
- Role-Based Access Control
- Session Management
- Secure Data Transmission

## Architecture

### Smart Contract (IBAC.sol)
The core of the system is the IBAC smart contract, which handles:
- User registration and authentication
- Session management
- Data encryption and storage
- Access control mechanisms
- Resource management

### Frontend Components
- React-based user interface
- Web3 integration
- AES encryption implementation
- Session management
- Access control interface

## Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- Sepolia testnet ETH for gas fees

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lbac-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Connect MetaMask**
   - Install MetaMask browser extension
   - Connect to Sepolia testnet
   - Ensure you have test ETH for gas fees

## How It Works

### 1. Authentication Flow
1. User connects their MetaMask wallet
2. System generates a nonce and timestamp
3. User signs a message containing their address, nonce, and timestamp
4. Smart contract verifies the signature and authenticates the user
5. Session is created with a configurable duration

### 2. Data Storage
1. User provides data and resource name
2. Frontend encrypts data using AES encryption
3. Encrypted data and initialization vector (IV) are stored on-chain
4. Access control is managed through the smart contract

### 3. Access Control
1. Resource owner grants access to other users
2. Access rights are stored on-chain
3. Users can only access resources they have permission for
4. Access can be revoked at any time

### 4. Session Management
1. Sessions have a configurable duration
2. Users can extend their session
3. Sessions automatically expire after the duration
4. Users must re-authenticate after session expiration

## Security Features

### Data at Rest
- AES encryption for stored data
- Secure key management
- Access control lists

### Data in Transit
- TLS/HTTPS for all communications
- Secure WebSocket connections
- Encrypted API calls

### Authentication
- ECDSA signatures for user verification
- Nonce-based authentication
- Session management
- Automatic session expiration

## Smart Contract Functions

### Authentication
- `registerUser()`: Register a new user
- `verifyCredentials()`: Authenticate user with ECDSA signature
- `isAuthenticated()`: Check user authentication status
- `endSession()`: End user session

### Data Management
- `encryptAndStoreData()`: Store encrypted data
- `getResourceData()`: Retrieve encrypted data
- `grantAccess()`: Grant access to another user
- `revokeAccess()`: Revoke user access
- `getUserKey()`: Get encrypted key for resource

## Frontend Components

### Web3Context
- Manages wallet connection
- Handles contract interactions
- Manages authentication state
- Provides encryption utilities

### Components
- `Navbar`: Wallet connection and navigation
- `Home`: Authentication and welcome screen
- `Dashboard`: Data management and access control

## Best Practices

1. **Security**
   - Never store private keys in the frontend
   - Always use HTTPS
   - Implement proper error handling
   - Validate all user inputs

2. **Performance**
   - Optimize gas usage
   - Implement proper caching
   - Use efficient data structures

3. **User Experience**
   - Provide clear error messages
   - Implement loading states
   - Add transaction confirmations

## Troubleshooting

### Common Issues
1. **MetaMask Connection**
   - Ensure MetaMask is installed
   - Check if you're on the correct network
   - Verify you have sufficient ETH for gas

2. **Authentication**
   - Check if your session has expired
   - Verify your signature
   - Ensure you have the correct permissions

3. **Transaction Failures**
   - Check gas limits
   - Verify contract address
   - Ensure sufficient ETH balance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please open an issue in the repository.

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

## Smart Contract Security Features

### 1. Access Control and Authentication
- **ECDSA Signature Verification**
  - Users must sign messages with their private key
  - Prevents unauthorized access and impersonation
  - Nonce-based authentication to prevent replay attacks
  ```solidity
  function verifyCredentials(address user, bytes memory signature, uint256 nonce) public {
      bytes32 message = keccak256(abi.encodePacked(user, nonce, block.timestamp));
      require(ECDSA.recover(message, signature) == user, "Invalid signature");
      // ... authentication logic
  }
  ```

- **Role-Based Access Control**
  - Granular permissions for different user roles
  - Resource-level access control
  - Owner-only administrative functions
  ```solidity
  mapping(address => mapping(string => bool)) private accessControl;
  mapping(address => bool) private isAdmin;
  ```

### 2. Session Management
- **Time-Based Session Expiration**
  - Configurable session duration
  - Automatic session termination
  - Session extension mechanism
  ```solidity
  uint256 public constant SESSION_DURATION = 1 hours;
  mapping(address => uint256) private sessionExpiry;
  ```

- **Session Validation**
  - Checks for active sessions
  - Prevents expired session access
  - Automatic session cleanup
  ```solidity
  modifier validSession() {
      require(sessionExpiry[msg.sender] > block.timestamp, "Session expired");
      _;
  }
  ```

### 3. Data Protection
- **Encrypted Data Storage**
  - On-chain storage of encrypted data
  - Secure key management
  - Initialization vector (IV) for encryption
  ```solidity
  struct EncryptedData {
      bytes32 encryptedContent;
      bytes32 iv;
      uint256 timestamp;
      address encryptedBy;
  }
  mapping(string => EncryptedData) private resources;
  ```

- **Access Control Lists**
  - Resource-level permissions
  - Granular access management
  - Access revocation capability
  ```