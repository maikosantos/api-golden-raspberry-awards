module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  testMatch: ["**/tests/**/*.test.js"],
  // Adicione isso para resolver os caminhos
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  // Importante: defina o rootDir
  rootDir: "./",
  // Adicione isso para resolver as extensões
  moduleDirectories: ["node_modules", "src"],
  // Defina o setupFilesAfterEnv se precisar de configuração adicional
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
