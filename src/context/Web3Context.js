import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contracts/IBAC.json';
import CryptoJS from 'crypto-js';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

    // AES Encryption Functions
    const generateKey = () => {
        return CryptoJS.lib.WordArray.random(32).toString();
    };

    const encryptData = (data, key) => {
        try {
            // Generate a random IV
            const iv = CryptoJS.lib.WordArray.random(16);
            
            // Encrypt the data using AES-256-CBC
            const encrypted = CryptoJS.AES.encrypt(data, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return {
                encryptedContent: encrypted.toString(),
                iv: iv.toString()
            };
        } catch (error) {
            console.error("Encryption error:", error);
            throw new Error("Failed to encrypt data");
        }
    };

    const decryptData = (encryptedContent, iv, key) => {
        try {
            // Decrypt the data using AES-256-CBC
            const decrypted = CryptoJS.AES.decrypt(encryptedContent, key, {
                iv: CryptoJS.enc.Hex.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error("Decryption error:", error);
            throw new Error("Failed to decrypt data");
        }
    };

    // Secure key storage (in a real application, use a more secure method)
    const storeKey = (resource, key) => {
        const encryptedKey = CryptoJS.AES.encrypt(key, account).toString();
        localStorage.setItem(`key_${resource}`, encryptedKey);
    };

    const getKey = (resource) => {
        const encryptedKey = localStorage.getItem(`key_${resource}`);
        if (!encryptedKey) return null;
        return CryptoJS.AES.decrypt(encryptedKey, account).toString(CryptoJS.enc.Utf8);
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        setIsConnecting(true);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(
                contractAddress,
                contractABI.abi,
                signer
            );
            setContract(contract);

            const isUserAuthenticated = await contract.isAuthenticated(accounts[0]);
            setIsAuthenticated(isUserAuthenticated);

        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Failed to connect wallet. Please try again.");
        } finally {
            setIsConnecting(false);
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async (accounts) => {
                if (accounts.length === 0) {
                    setAccount(null);
                    setIsAuthenticated(false);
                } else {
                    setAccount(accounts[0]);
                    if (contract) {
                        const isUserAuthenticated = await contract.isAuthenticated(accounts[0]);
                        setIsAuthenticated(isUserAuthenticated);
                    }
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, [contract]);

    const verifyUser = async () => {
        if (!contract || !account) {
            alert("Please connect your wallet first!");
            return false;
        }

        try {
            const nonce = Math.floor(Math.random() * 1000000);
            const message = ethers.utils.solidityKeccak256(
                ['address', 'uint256', 'uint256'],
                [account, nonce, Math.floor(Date.now() / 1000)]
            );
            
            const signature = await provider.getSigner().signMessage(ethers.utils.arrayify(message));
            
            const tx = await contract.verifyCredentials(account, signature, nonce);
            await tx.wait();
            
            setIsAuthenticated(true);
            alert("Successfully authenticated!");
            return true;
        } catch (error) {
            console.error("Error verifying user:", error);
            alert("Authentication failed. Please try again.");
            return false;
        }
    };

    const encryptAndStoreData = async (resource, data) => {
        if (!contract || !isAuthenticated) return;

        try {
            // Generate a secure key for this resource
            const key = generateKey();
            
            // Encrypt the data using AES
            const { encryptedContent, iv } = encryptData(data, key);

            // Store the encrypted data on-chain
            const tx = await contract.encryptAndStoreData(
                resource,
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes(encryptedContent)),
                ethers.utils.keccak256(ethers.utils.toUtf8Bytes(iv))
            );
            await tx.wait();

            // Store the encryption key securely
            storeKey(resource, key);

            return true;
        } catch (error) {
            console.error("Error storing data:", error);
            return false;
        }
    };

    const grantAccess = async (userAddress, resource) => {
        if (!contract || !isAuthenticated) return;

        try {
            // Get the encryption key for this resource
            const key = getKey(resource);
            if (!key) {
                throw new Error("Resource key not found");
            }

            // Encrypt the key for the recipient
            const { encryptedContent: encryptedKey } = encryptData(key, userAddress);

            const tx = await contract.grantAccess(userAddress, resource, encryptedKey);
            await tx.wait();
            return true;
        } catch (error) {
            console.error("Error granting access:", error);
            return false;
        }
    };

    const endSession = async () => {
        if (!contract || !isAuthenticated) return;

        try {
            const tx = await contract.endSession();
            await tx.wait();
            setIsAuthenticated(false);
            return true;
        } catch (error) {
            console.error("Error ending session:", error);
            return false;
        }
    };

    const value = {
        account,
        contract,
        provider,
        isAuthenticated,
        isConnecting,
        connectWallet,
        verifyUser,
        encryptAndStoreData,
        grantAccess,
        endSession,
        encryptData,
        decryptData
    };

    return (
        <Web3Context.Provider value={value}>
            {children}
        </Web3Context.Provider>
    );
}; 