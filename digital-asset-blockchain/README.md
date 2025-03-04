# Digital Asset Registry

A blockchain-based system for registering and protecting digital assets using Ethereum smart contracts.

## Project Overview

This project implements a secure system for registering, managing, and verifying digital assets on the Ethereum blockchain. The system provides immutable proof of ownership and allows users to easily verify the authenticity and integrity of digital assets.

### Key Features

- **Secure Asset Registration**: Register digital assets on the Ethereum blockchain with cryptographic proof
- **Ownership Management**: Transfer ownership of assets securely through blockchain transactions
- **Asset Verification**: Verify the integrity and authenticity of digital assets using cryptographic hash verification
- **Transparent History**: All transactions and asset transfers are recorded on the blockchain, creating a transparent, immutable history
- **User-Friendly Interface**: Web-based interface for interacting with the blockchain

## Technical Architecture

The system consists of three main components:

1. **Smart Contract**: Solidity contract deployed on the Ethereum blockchain
2. **Web Interface**: HTML/CSS/JavaScript front-end for user interaction
3. **Client Library**: JavaScript library for interacting with the smart contract

### Smart Contract

The `DigitalAssetRegistry` smart contract provides the following functionality:

- Register new digital assets with name, description, and cryptographic hash
- Transfer ownership of assets to other Ethereum addresses
- Update asset metadata (hash) as needed
- Delete/deactivate assets
- Verify asset integrity by comparing hashes
- Retrieve asset details and ownership information

### Web Interface

The web interface provides a user-friendly way to interact with the blockchain:

- Connect to MetaMask or other Ethereum wallets
- Register new digital assets by uploading files and automatically generating hashes
- View and manage owned assets
- Transfer ownership to other users
- Verify the integrity of digital assets

### Client Library

The JavaScript client library simplifies interactions with the smart contract:

- Initialize Web3 and contract connections
- Calculate file hashes
- Register assets
- Transfer ownership
- Verify asset integrity
- Handle account changes and other events

## Setup and Installation

### Prerequisites

- Node.js and npm
- MetaMask browser extension
- Ethereum testnet (Ropsten, Rinkeby, etc.) account with some test Ether

### Smart Contract Deployment

1. Install Truffle (if not using Remix IDE): `npm install -g truffle`
2. Compile the smart contract:
   ```
   truffle compile
   ```
3. Deploy to a testnet:
   ```
   truffle migrate --network ropsten
   ```
   Or use Remix IDE to deploy directly to your preferred testnet.

4. Note the deployed contract address and ABI for front-end configuration.

### Web Interface Setup

1. Update the `contractAddress` and `contractABI` variables in the HTML file with your deployed contract details.
2. Host the HTML file on a web server or use a local development server.

## Usage

### Registering a Digital Asset

1. Connect your MetaMask wallet to the application.
2. Navigate to the "Register Asset" tab.
3. Enter the asset name and description.
4. Upload the file you want to register.
5. The application will automatically calculate the file's cryptographic hash.
6. Click "Register Asset" to record the asset on the blockchain.

### Managing Assets

1. Navigate to the "Manage Assets" tab.
2. View all assets owned by your connected wallet address.
3. Transfer ownership by clicking the "Transfer" button and entering a new owner's Ethereum address.
4. Update the asset hash if the content changes.
5. Delete/deactivate assets that are no longer needed.

### Verifying Asset Integrity

1. Navigate to the "Verify Asset" tab.
2. Enter the asset ID of the asset you want to verify.
3. Upload the file you want to verify.
4. The application will compare the file's hash with the hash stored on the blockchain.
5. View the verification result to determine if the file matches the registered asset.

## Security Considerations

- **Private Key Security**: Never share your private keys or wallet seed phrases.
- **Transaction Confirmation**: Always verify transaction details in MetaMask before confirming.
- **File Handling**: The application calculates file hashes locally in your browser; files are not uploaded to any server.
- **Smart Contract Security**: The contract implements access controls to ensure only owners can modify their assets.

## Future Enhancements

- Integration with IPFS for decentralized storage of the digital assets themselves
- Implementation of ERC-721 standard for non-fungible token (NFT) compatibility
- Advanced search and filtering capabilities
- Batch operations for managing multiple assets
- Support for royalty payments and licensing management

## License

MIT License

## Authors

Chukwuma Pascal Onuoha

## Acknowledgements

- Ethereum and Solidity documentation
- Web3.js library
- CryptoJS for client-side hashing
