# Certificate Backend API

A Node.js backend server using Express and ethers.js to interact with a deployed Solidity smart contract for certificate issuance and verification on the blockchain.

## 🎯 Features

- **Issue Certificates**: POST endpoint to issue certificates on the blockchain (signed by college wallet)
- **Verify Certificates**: GET endpoint to verify certificates by ID or hash
- **Revoke Certificates**: POST endpoint to revoke certificates (bonus feature)
- **Health Check**: Monitor server and contract status
- **Auto-signed Transactions**: All write operations automatically signed by the college wallet

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A deployed Certificate smart contract
- RPC URL for the blockchain network
- College wallet private key (with sufficient ETH for gas)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `ethers` - Ethereum library for blockchain interaction
- `dotenv` - Environment variable management
- `cors` - Enable CORS for API access

### 2. Configure Environment Variables

The `.env` file is already configured with your values:

```env
# Blockchain Configuration
RPC_URL=
PRIVATE_KEY=
CONTRACT_ADDRESS=

# Server Configuration
PORT=3000
```

**⚠️ IMPORTANT**: 
- Never commit the `.env` file to version control
- Keep your `PRIVATE_KEY` secure
- Make sure the wallet has enough ETH for gas fees

### 3. Verify ABI File

The contract ABI should be located at:
```
backend/Abi/abi.json
```

The ABI file is already in place and will be automatically loaded by the blockchain module.

### 4. Start the Server

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### 1. Issue Certificate

**Endpoint**: `POST /issue-certificate`

**Description**: Issues a new certificate on the blockchain. The transaction is signed by the college wallet.

**Request Body**:
```json
{
  "studentIdentifier": "ROLL123456",
  "certificateHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "metadataURI": "ipfs://QmXxxx... or https://example.com/cert.pdf"
}
```

**Response** (Success):
```json
{
  "success": true,
  "txHash": "0xabc...",
  "blockNumber": 12345,
  "certificateId": "1",
  "eventData": {
    "certificateId": "1",
    "studentIdentifier": "ROLL123456",
    "certificateHash": "0x1234...",
    "metadataURI": "ipfs://...",
    "issuedAt": "1234567890"
  },
  "gasUsed": "123456",
  "issuer": "0x..."
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "Error message here"
}
```

**Example using curl**:
```bash
curl -X POST http://localhost:3000/issue-certificate \
  -H "Content-Type: application/json" \
  -d '{
    "studentIdentifier": "ROLL123456",
    "certificateHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "metadataURI": "ipfs://QmExample"
  }'
```

### 2. Verify Certificate

**Endpoint**: `GET /verify-certificate`

**Description**: Verifies a certificate by ID or checks if a hash exists.

**Query Parameters**:
- `certificateId` (optional): The certificate ID to verify
- `certificateHash` (optional): The certificate hash to check

**Option A - Verify by ID**:
```
GET /verify-certificate?certificateId=1
```

**Response**:
```json
{
  "exists": true,
  "isValid": true,
  "revoked": false,
  "reason": null,
  "certificateId": "1",
  "studentIdentifier": "ROLL123456",
  "certificateHash": "0x1234...",
  "metadataURI": "ipfs://...",
  "issuedAt": "1234567890",
  "issuedAtDate": "2024-01-01T00:00:00.000Z",
  "issuerAddress": "0x..."
}
```

**Option B - Check by Hash**:
```
GET /verify-certificate?certificateHash=0x1234...
```

**Response**:
```json
{
  "exists": true,
  "message": "Certificate hash exists in the system",
  "note": "To get full certificate details, please use the certificateId parameter",
  "certificateHash": "0x1234..."
}
```

**Example using curl**:
```bash
# Verify by ID
curl http://localhost:3000/verify-certificate?certificateId=1

# Check by hash
curl http://localhost:3000/verify-certificate?certificateHash=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### 3. Revoke Certificate (Bonus)

**Endpoint**: `POST /revoke-certificate`

**Description**: Revokes an existing certificate. Only the college wallet can revoke certificates.

**Request Body**:
```json
{
  "certificateId": 1
}
```

**Response**:
```json
{
  "success": true,
  "txHash": "0xabc...",
  "blockNumber": 12346,
  "certificateId": 1,
  "message": "Certificate successfully revoked"
}
```

**Example using curl**:
```bash
curl -X POST http://localhost:3000/revoke-certificate \
  -H "Content-Type: application/json" \
  -d '{"certificateId": 1}'
```

### 4. Health Check

**Endpoint**: `GET /health`

**Description**: Check server and contract status.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "contractAddress": "0x856b4eaf7f0e3a00a1b378b7a833f68bf49cae7c",
  "collegeAddress": "0x...",
  "totalCertificates": "42"
}
```

### 5. API Documentation

**Endpoint**: `GET /`

**Description**: Returns API documentation and available endpoints.

## 🏗️ Project Structure

```
backend/
├── Abi/
│   └── abi.json              # Contract ABI (auto-generated by Foundry)
├── .env                      # Environment variables (DO NOT COMMIT)
├── blockchain.js             # Blockchain connection setup
├── server.js                 # Main Express server
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🔧 Code Architecture

### blockchain.js
- Sets up the blockchain connection
- Creates provider (JsonRpcProvider)
- Creates wallet from private key
- Creates contract instance
- Exports provider, wallet, contract, and collegeAddress
- Includes connection test on startup

### server.js
- Express server with REST API endpoints
- `/issue-certificate` - Issues certificates (POST)
- `/verify-certificate` - Verifies certificates (GET)
- `/revoke-certificate` - Revokes certificates (POST)
- `/health` - Health check (GET)
- Includes error handling and validation
- All transactions signed by college wallet

## 🔐 Security Notes

1. **Private Key**: The `PRIVATE_KEY` in `.env` is the college wallet that pays for all gas fees. Keep it secure!
2. **Access Control**: The smart contract enforces that only the college address can issue/revoke certificates
3. **CORS**: Currently enabled for all origins. In production, restrict to your frontend domain
4. **Environment**: Set `NODE_ENV=production` in production to hide error details

## 🧪 Testing the API

### Using curl

```bash
# Issue a certificate
curl -X POST http://localhost:3000/issue-certificate \
  -H "Content-Type: application/json" \
  -d '{
    "studentIdentifier": "TEST001",
    "certificateHash": "0x0000000000000000000000000000000000000000000000000000000000000001",
    "metadataURI": "https://example.com/cert1.pdf"
  }'

# Verify the certificate
curl http://localhost:3000/verify-certificate?certificateId=1

# Check health
curl http://localhost:3000/health
```

### Using Postman or Thunder Client

1. Import the endpoints from the root `/` documentation
2. Set `Content-Type: application/json` header
3. Send requests with the appropriate body/query parameters

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `RPC_URL` | Blockchain RPC endpoint | `https://eth-sepolia.g.alchemy.com/v2/...` |
| `PRIVATE_KEY` | College wallet private key | `0x...` |
| `CONTRACT_ADDRESS` | Deployed contract address | `0x856b4eaf...` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## 🐛 Troubleshooting

### Connection Issues

If you see connection errors on startup:
1. Check that `RPC_URL` is correct and accessible
2. Verify the wallet has ETH for gas fees
3. Ensure `CONTRACT_ADDRESS` is correct

### Transaction Failures

If transactions fail:
1. Check wallet balance (needs ETH for gas)
2. Verify the contract is deployed at the specified address
3. Check that the private key corresponds to the college address set in the contract

### ABI Loading Errors

If the ABI fails to load:
1. Verify `Abi/abi.json` exists
2. Check that the JSON is valid
3. Ensure the file path is correct

## 📚 Additional Resources

- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [Express.js Documentation](https://expressjs.com/)
- [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)

## 📄 License

MIT
