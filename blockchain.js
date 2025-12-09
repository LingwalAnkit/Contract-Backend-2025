import { ethers } from "ethers";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI_PATH = join(__dirname, "Abi", "abi.json");

if (!RPC_URL) {
  throw new Error("RPC_URL is not defined in .env file");
}

if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not defined in .env file");
}

if (!CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is not defined in .env file");
}

let contractABI;
try {
  const abiFile = readFileSync(ABI_PATH, "utf8");
  const abiJson = JSON.parse(abiFile);

  // The ABI file has the ABI nested under "abi" key
  contractABI = abiJson.abi || abiJson;

  console.log("✅ Contract ABI loaded successfully");
} catch (error) {
  console.error("❌ Error loading ABI file:", error.message);
  throw new Error(`Failed to load ABI from ${ABI_PATH}`);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

// 2. Create wallet from private key and connect to provider
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// 3. Create contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

const collegeAddress = wallet.address;

async function testConnection() {
  try {
    const network = await provider.getNetwork();
    console.log(
      "✅ Connected to network:",
      network.name,
      `(Chain ID: ${network.chainId})`
    );

    const balance = await provider.getBalance(collegeAddress);
    console.log("✅ College wallet address:", collegeAddress);
    console.log(
      "✅ College wallet balance:",
      ethers.formatEther(balance),
      "ETH"
    );

    // Test contract connection by calling a view function
    const totalCertificates = await contract.getTotalCertificates();
    console.log(
      "✅ Contract connected. Total certificates:",
      totalCertificates.toString()
    );

    return true;
  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
    return false;
  }
}

testConnection();

export { provider, wallet, contract, collegeAddress, testConnection };
