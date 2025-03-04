// This JavaScript file contains key functions for interacting with the DigitalAssetRegistry smart contract

// Import libraries (if using npm/webpack)
// const Web3 = require('web3');
// const CryptoJS = require('crypto-js');

class DigitalAssetClient {
    constructor(contractAddress, contractABI) {
        this.contractAddress = contractAddress;
        this.contractABI = contractABI;
        this.web3 = null;
        this.contract = null;
        this.account = null;
    }

    /**
     * Initialize Web3 connection and contract
     */
    async initialize() {
        // Check if MetaMask is installed
        if (window.ethereum) {
            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                // Initialize Web3
                this.web3 = new Web3(window.ethereum);
                
                // Get current account
                const accounts = await this.web3.eth.getAccounts();
                this.account = accounts[0];
                
                // Initialize contract
                this.contract = new this.web3.eth.Contract(
                    this.contractABI,
                    this.contractAddress
                );
                
                // Setup event listeners for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    this.account = accounts[0];
                    this.onAccountChange(this.account);
                });
                
                return {
                    success: true,
                    account: this.account
                };
            } catch (error) {
                console.error('Error initializing Web3:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        } else {
            console.error('MetaMask not installed');
            return {
                success: false,
                error: 'Please install MetaMask to use this application'
            };
        }
    }
    
    /**
     * Calculate SHA-256 hash of a file
     * @param {File} file - File object to hash
     * @returns {Promise<string>} - Hash of the file
     */
    calculateFileHash(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function() {
                try {
                    const wordArray = CryptoJS.lib.WordArray.create(reader.result);
                    const hash = CryptoJS.SHA256(wordArray).toString();
                    resolve(hash);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = function(error) {
                reject(error);
            };
        });
    }
    
    /**
     * Register a new digital asset
     * @param {string} name - Name of the asset
     * @param {string} description - Description of the asset
     * @param {string} hash - Cryptographic hash of the asset
     * @returns {Promise<Object>} - Transaction result
     */
    async registerAsset(name, description, hash) {
        if (!this.contract || !this.account) {
            throw new Error('Contract not initialized');
        }
        
        try {
            const result = await this.contract.methods
                .registerAsset(name, description, hash)
                .send({ from: this.account });
            
            return {
                success: true,
                assetId: result.events.AssetRegistered.returnValues.assetId,
                transactionHash: result.transactionHash
            };
        } catch (error) {
            console.error('Error registering asset:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Get asset details by ID
     * @param {number} assetId - ID of the asset to retrieve
     * @returns {Promise<Object>} - Asset details
     */
    async getAsset(assetId) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }
        
        try {
            const asset = await this.contract.methods.getAsset(assetId).call();
            
            return {
                success: true,
                asset: {
                    name: asset.name,
                    description: asset.description,
                    hash: asset.hash,
                    owner: asset.owner,
                    registeredAt: new Date(asset.registeredAt * 1000),
                    isActive: asset.isActive
                }
            };
        } catch (error) {
            console.error('Error getting asset:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Get all assets owned by the current account
     * @returns {Promise<Object>} - List of asset IDs
     */
    async getMyAssets() {
        if (!this.contract || !this.account) {
            throw new Error('Contract not initialized');
        }
        
        try {
            const assetIds = await this.contract.methods
                .getAssetsByOwner(this.account)
                .call();
            
            return {
                success: true,
                assetIds: assetIds
            };
        } catch (error) {
            console.error('Error getting assets:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Transfer asset ownership to another address
     * @param {number} assetId - ID of the asset to transfer
     * @param {string} newOwner - Ethereum address of the new owner
     * @returns {Promise<Object>} - Transaction result
     */
    async transferAsset(assetId, newOwner) {
        if (!this.contract || !this.account) {
            throw new Error('Contract not initialized');
        }
        
        try {
            const result = await this.contract.methods
                .transferAsset(assetId, newOwner)
                .send({ from: this.account });
            
            return {
                success: true,
                transactionHash: result.transactionHash
            };
        } catch (error) {
            console.error('Error transferring asset:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Update the hash of an asset
     * @param {number} assetId - ID of the asset to update
     * @param {string} newHash - New cryptographic hash
     * @returns {Promise<Object>} - Transaction result
     */
    async updateAssetHash(assetId, newHash) {
        if (!this.contract || !this.account) {
            throw new Error('Contract not initialized');
        }
        
        try {
            const result = await this.contract.methods
                .updateAssetHash(assetId, newHash)
                .send({ from: this.account });
            
            return {
                success: true,
                transactionHash: result.transactionHash
            };
        } catch (error) {
            console.error('Error updating asset hash:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Delete/deactivate an asset
     * @param {number} assetId - ID of the asset to delete
     * @returns {Promise<Object>} - Transaction result
     */
    async deleteAsset(assetId) {
        if (!this.contract || !this.account) {
            throw new Error('Contract not initialized');
        }
        
        try {
            const result = await this.contract.methods
                .deleteAsset(assetId)
                .send({ from: this.account });
            
            return {
                success: true,
                transactionHash: result.transactionHash
            };
        } catch (error) {
            console.error('Error deleting asset:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Verify if a file's hash matches the stored hash of an asset
     * @param {number} assetId - ID of the asset to verify
     * @param {string} hash - Hash to compare
     * @returns {Promise<Object>} - Verification result
     */
    async verifyAssetIntegrity(assetId, hash) {
        if (!this.contract) {
            throw new Error('Contract not initialized');
        }
        
        try {
            const isValid = await this.contract.methods
                .verifyAssetIntegrity(assetId, hash)
                .call();
            
            return {
                success: true,
                isValid: isValid
            };
        } catch (error) {
            console.error('Error verifying asset:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Event handler for account changes
     * This method should be overridden by the application
     * @param {string} account - New account address
     */
    onAccountChange(account) {
        console.log('Account changed to:', account);
        // Override this method to handle account changes
    }
}

// Usage example:
/*
const client = new DigitalAssetClient(
    '0x1234567890123456789012345678901234567890', // Contract address
    [...] // Contract ABI
);

async function init() {
    const initResult = await client.initialize();
    if (initResult.success) {
        console.log('Connected with account:', initResult.account);
    } else {
        console.error('Failed to initialize:', initResult.error);
    }
}

init();
*/