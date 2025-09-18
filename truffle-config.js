module.exports = {
  // Where compiled contracts will be stored for your React frontend
  contracts_build_directory: './client/src/artifacts/',

  networks: {
    development: {
      host: "127.0.0.1",    // Ganache host
      port: 7545,           // Ganache port
      network_id: "*",      // Match any network id
    },
  },

  mocha: {
    // You can set mocha options here
    timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.20",     // Match your contract compiler
      settings: {
        optimizer: {
          enabled: true,     // Enable optimization
          runs: 1000
        },
        evmVersion: "homestead"
      }
    }
  }
};
