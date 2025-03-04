require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
    solidity: "0.8.0",
    networks: {
        sepolia: {
            url: `https://eth-sepolia.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
            chainId: 11155111, // Adding the Sepolia chain ID
            gasPrice: 20000000000, // Optional: Set a gas price
            timeout: 200000, // Optional: Set a timeout for deployment
        },
    },
};
