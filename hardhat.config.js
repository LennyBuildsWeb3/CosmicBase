import "@nomicfoundation/hardhat-toolbox";

export default {
  solidity: "0.8.19",
  networks: {
    very: {
      url: "https://rpc.verylabs.io",
      chainId: 4613,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
