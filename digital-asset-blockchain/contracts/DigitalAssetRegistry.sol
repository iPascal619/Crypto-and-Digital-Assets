// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DigitalAssetRegistry
 * @dev Smart contract for registering and managing digital assets on Ethereum blockchain
 */
contract DigitalAssetRegistry {
    // Structure to represent a digital asset
    struct DigitalAsset {
        string assetName;
        string assetDescription;
        string assetHash;       // Cryptographic hash of the asset
        address owner;          // Current owner of the asset
        uint256 registeredAt;   // Timestamp when asset was registered
        bool isActive;          // To check if asset is active or deleted
    }
    
    // Mapping from asset ID to DigitalAsset
    mapping(uint256 => DigitalAsset) private assets;
    
    // Mapping to track assets owned by an address
    mapping(address => uint256[]) private ownerAssets;
    
    // Counter for generating unique asset IDs
    uint256 private assetIdCounter;
    
    // Events
    event AssetRegistered(uint256 indexed assetId, string assetName, address indexed owner, string assetHash);
    event AssetTransferred(uint256 indexed assetId, address indexed previousOwner, address indexed newOwner);
    event AssetUpdated(uint256 indexed assetId, string newAssetHash);
    event AssetDeleted(uint256 indexed assetId);
    
    /**
     * @dev Constructor initializes the asset counter
     */
    constructor() {
        assetIdCounter = 1; // Start IDs from 1
    }
    
    /**
     * @dev Register a new digital asset
     * @param _name Name of the asset
     * @param _description Description of the asset
     * @param _hash Cryptographic hash of the asset content
     * @return assetId Unique ID of the registered asset
     */
    function registerAsset(string memory _name, string memory _description, string memory _hash) 
        public 
        returns (uint256) 
    {
        require(bytes(_hash).length > 0, "Asset hash cannot be empty");
        
        uint256 assetId = assetIdCounter;
        
        assets[assetId] = DigitalAsset({
            assetName: _name,
            assetDescription: _description,
            assetHash: _hash,
            owner: msg.sender,
            registeredAt: block.timestamp,
            isActive: true
        });
        
        // Add asset to owner's collection
        ownerAssets[msg.sender].push(assetId);
        
        // Increment counter for next asset
        assetIdCounter++;
        
        emit AssetRegistered(assetId, _name, msg.sender, _hash);
        
        return assetId;
    }
    
    /*
     * @dev Get details of a specific asset
     * @param _assetId ID of the asset to retrieve
     * @return Asset details
     */
    function getAsset(uint256 _assetId) 
        public 
        view 
        returns (
            string memory name,
            string memory description,
            string memory hash,
            address owner,
            uint256 registeredAt,
            bool isActive
        ) 
    {
        require(_assetId > 0 && _assetId < assetIdCounter, "Invalid asset ID");
        DigitalAsset storage asset = assets[_assetId];
        
        return (
            asset.assetName,
            asset.assetDescription,
            asset.assetHash,
            asset.owner,
            asset.registeredAt,
            asset.isActive
        );
    }
    
    /**
     * @dev Transfer ownership of an asset to another address
     * @param _assetId ID of the asset to transfer
     * @param _newOwner Address of the new owner
     */
    function transferAsset(uint256 _assetId, address _newOwner) 
        public 
    {
        require(_assetId > 0 && _assetId < assetIdCounter, "Invalid asset ID");
        require(assets[_assetId].owner == msg.sender, "Only the owner can transfer the asset");
        require(_newOwner != address(0), "Cannot transfer to the zero address");
        require(assets[_assetId].isActive, "Asset is not active");
        
        address previousOwner = assets[_assetId].owner;
        
        // Update the asset owner
        assets[_assetId].owner = _newOwner;
        
        // Remove asset from previous owner's collection
        removeAssetFromOwner(previousOwner, _assetId);
        
        // Add asset to new owner's collection
        ownerAssets[_newOwner].push(_assetId);
        
        emit AssetTransferred(_assetId, previousOwner, _newOwner);
    }
    
    /**
     * @dev Update the hash of an asset (e.g., if the asset content changes)
     * @param _assetId ID of the asset to update
     * @param _newHash New cryptographic hash of the asset
     */
    function updateAssetHash(uint256 _assetId, string memory _newHash) 
        public 
    {
        require(_assetId > 0 && _assetId < assetIdCounter, "Invalid asset ID");
        require(assets[_assetId].owner == msg.sender, "Only the owner can update the asset");
        require(bytes(_newHash).length > 0, "New asset hash cannot be empty");
        require(assets[_assetId].isActive, "Asset is not active");
        
        assets[_assetId].assetHash = _newHash;
        
        emit AssetUpdated(_assetId, _newHash);
    }
    
    /**
     * @dev Delete/deactivate an asset
     * @param _assetId ID of the asset to delete
     */
    function deleteAsset(uint256 _assetId) 
        public 
    {
        require(_assetId > 0 && _assetId < assetIdCounter, "Invalid asset ID");
        require(assets[_assetId].owner == msg.sender, "Only the owner can delete the asset");
        require(assets[_assetId].isActive, "Asset already deleted");
        
        assets[_assetId].isActive = false;
        
        emit AssetDeleted(_assetId);
    }
    
    /**
     * @dev Verify if a hash matches the stored hash of an asset
     * @param _assetId ID of the asset to verify
     * @param _hash Hash to compare against the stored hash
     * @return True if hashes match, false otherwise
     */
    function verifyAssetIntegrity(uint256 _assetId, string memory _hash) 
        public 
        view 
        returns (bool) 
    {
        require(_assetId > 0 && _assetId < assetIdCounter, "Invalid asset ID");
        require(assets[_assetId].isActive, "Asset is not active");
        
        return keccak256(abi.encodePacked(assets[_assetId].assetHash)) == 
               keccak256(abi.encodePacked(_hash));
    }
    
    /**
     * @dev Get all assets owned by an address
     * @param _owner Address to get assets for
     * @return Array of asset IDs owned by the address
     */
    function getAssetsByOwner(address _owner) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return ownerAssets[_owner];
    }
    
    /**
     * @dev Helper function to remove an asset from an owner's collection
     * @param _owner Address of the owner
     * @param _assetId ID of the asset to remove
     */
    function removeAssetFromOwner(address _owner, uint256 _assetId) 
        private 
    {
        uint256[] storage ownerAssetList = ownerAssets[_owner];
        for (uint256 i = 0; i < ownerAssetList.length; i++) {
            if (ownerAssetList[i] == _assetId) {
                // Move the last element to the place of the removed element
                ownerAssetList[i] = ownerAssetList[ownerAssetList.length - 1];
                // Remove the last element
                ownerAssetList.pop();
                break;
            }
        }
    }
}