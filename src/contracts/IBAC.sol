// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract IBAC is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    // Enum to define roles and their associated access levels
    enum Role { Patient, Doctor, Nurse }
    enum SecurityLevel { Confidential, Secret, TopSecret }

    struct User {
        bool isRegistered;
        Role role;
        SecurityLevel securityLevel;
        uint256 nonce;
        uint256 lastSessionTime;
        bool isActive;
        bytes32 encryptedPrivateKey;
    }

    struct Resource {
        bytes32 encryptedData;
        bytes32 iv;
        SecurityLevel securityLevel;
        mapping(address => bool) accessList;
    }

    mapping(address => User) public users;
    mapping(string => Resource) public resources;
    mapping(address => mapping(string => bytes)) public userKeys;

    event UserRegistered(address indexed user, Role role);
    event SessionStarted(address indexed user);
    event SessionEnded(address indexed user);
    event DataStored(string indexed resource);
    event AccessGranted(address indexed user, string indexed resource);
    event AccessRevoked(address indexed user, string indexed resource);
    event RoleAssigned(address indexed user, Role role);

    constructor() {
        _transferOwnership(msg.sender);
        // Initialize admin (doctor) with highest security level
        users[msg.sender] = User({
            isRegistered: true,
            role: Role.Doctor,
            securityLevel: SecurityLevel.TopSecret,
            nonce: 0,
            lastSessionTime: 0,
            isActive: false,
            encryptedPrivateKey: keccak256(abi.encodePacked("initial-key", block.timestamp))
        });
    }

    function registerUser() external {
        require(!users[msg.sender].isRegistered, "User already registered");
        users[msg.sender] = User({
            isRegistered: true,
            role: Role.Patient, // Default role
            securityLevel: SecurityLevel.Confidential, // Default security level
            nonce: 0,
            lastSessionTime: 0,
            isActive: false,
            encryptedPrivateKey: keccak256(abi.encodePacked("user-key", block.timestamp))
        });
        emit UserRegistered(msg.sender, Role.Patient);
    }

    function addPatient(address patientAddress) public {
        require(users[msg.sender].role == Role.Doctor, "Only a Doctor can add a Patient");
        require(!users[patientAddress].isRegistered, "User already registered");
        
        users[patientAddress] = User({
            isRegistered: true,
            role: Role.Patient,
            securityLevel: SecurityLevel.Confidential,
            nonce: 0,
            lastSessionTime: 0,
            isActive: false,
            encryptedPrivateKey: keccak256(abi.encodePacked("patient-key", block.timestamp))
        });
        emit UserRegistered(patientAddress, Role.Patient);
    }

    function addNurse(address nurseAddress) public {
        require(users[msg.sender].role == Role.Doctor, "Only a Doctor can add a Nurse");
        require(!users[nurseAddress].isRegistered, "User already registered");
        
        users[nurseAddress] = User({
            isRegistered: true,
            role: Role.Nurse,
            securityLevel: SecurityLevel.Secret,
            nonce: 0,
            lastSessionTime: 0,
            isActive: false,
            encryptedPrivateKey: keccak256(abi.encodePacked("nurse-key", block.timestamp))
        });
        emit UserRegistered(nurseAddress, Role.Nurse);
    }

    function verifyCredentials(
        address user,
        bytes memory signature,
        uint256 nonce
    ) external nonReentrant {
        require(users[user].isRegistered, "User not registered");
        require(!users[user].isActive, "User already has an active session");
        require(nonce > users[user].nonce, "Invalid nonce");

        bytes32 messageHash = keccak256(
            abi.encodePacked(user, nonce, block.timestamp)
        );
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        address signer = ethSignedMessageHash.recover(signature);
        require(signer == user, "Invalid signature");

        users[user].nonce = nonce;
        users[user].lastSessionTime = block.timestamp;
        users[user].isActive = true;

        emit SessionStarted(user);
    }

    function isAuthenticated(address user) external view returns (bool) {
        return users[user].isActive;
    }

    function encryptAndStoreData(
        string memory resource,
        bytes32 encryptedData,
        bytes32 iv,
        SecurityLevel securityLevel
    ) external nonReentrant {
        require(users[msg.sender].isActive, "User not authenticated");
        require(users[msg.sender].securityLevel >= securityLevel, "Insufficient security level");
        
        Resource storage res = resources[resource];
        res.encryptedData = encryptedData;
        res.iv = iv;
        res.securityLevel = securityLevel;
        res.accessList[msg.sender] = true;

        emit DataStored(resource);
    }

    function grantAccess(
        address user,
        string memory resource,
        bytes memory encryptedKey
    ) external nonReentrant {
        require(users[msg.sender].isActive, "User not authenticated");
        require(resources[resource].accessList[msg.sender], "No access to resource");
        require(users[user].securityLevel >= resources[resource].securityLevel, "Insufficient security level");

        resources[resource].accessList[user] = true;
        userKeys[user][resource] = encryptedKey;

        emit AccessGranted(user, resource);
    }

    function revokeAccess(
        address user,
        string memory resource
    ) external nonReentrant {
        require(users[msg.sender].isActive, "User not authenticated");
        require(resources[resource].accessList[msg.sender], "No access to resource");

        resources[resource].accessList[user] = false;
        delete userKeys[user][resource];

        emit AccessRevoked(user, resource);
    }

    function endSession() external nonReentrant {
        require(users[msg.sender].isActive, "No active session");
        users[msg.sender].isActive = false;
        emit SessionEnded(msg.sender);
    }

    function getResourceData(string memory resource)
        external
        view
        returns (bytes32 encryptedData, bytes32 iv)
    {
        require(users[msg.sender].isActive, "User not authenticated");
        require(resources[resource].accessList[msg.sender], "No access to resource");
        require(users[msg.sender].securityLevel >= resources[resource].securityLevel, "Insufficient security level");

        return (resources[resource].encryptedData, resources[resource].iv);
    }

    function getUserKey(string memory resource)
        external
        view
        returns (bytes memory)
    {
        require(users[msg.sender].isActive, "User not authenticated");
        require(resources[resource].accessList[msg.sender], "No access to resource");
        require(users[msg.sender].securityLevel >= resources[resource].securityLevel, "Insufficient security level");

        return userKeys[msg.sender][resource];
    }

    function checkAccess(address user, string memory resource) public view returns (bool) {
        return resources[resource].accessList[user] && 
               users[user].securityLevel >= resources[resource].securityLevel;
    }
} 