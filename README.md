

# BioVault Backend Development Guide

## 1. Introduction

Welcome to the backend development guide for **BioVault**.

BioVault is a secure, decentralized platform for managing medical records. It empowers users by giving them full control over their health data. The frontend is built with React and Tailwind CSS, and it interacts with a backend API that you will be building.

The core principles of BioVault are:
- **User Sovereignty**: Users own and control their data.
- **Security**: Data is end-to-end encrypted on the client side. The backend never handles unencrypted sensitive information.
- **Transparency**: All access and modifications are logged immutably on a blockchain.

This document outlines the architecture, data models, and API endpoints required to support the BioVault frontend.

---

## 2. Core Concepts

Understanding these concepts is crucial for building the backend correctly.

### Decentralized Storage (IPFS)
Medical health records are **not** stored on our servers. They are encrypted on the client-side and then uploaded to the [InterPlanetary File System (IPFS)](https://ipfs.tech/). The backend's role is to store the metadata associated with these records, including the IPFS hash (CID) which acts as a pointer to the file.

### Blockchain for Access Control & Auditing
The logic for granting, revoking, and auditing access to medical records is managed by a **smart contract** on a blockchain (e.g., Ethereum, Polygon). The backend's responsibility is to interact with this smart contract to trigger state changes (e.g., approving a request) and to query the blockchain for audit trail data.

### End-to-End Encryption (E2EE)
1.  When a user uploads a health record, the frontend generates a random symmetric key (e.g., AES-256).
2.  The health record is encrypted with this symmetric key.
3.  The encrypted health record is uploaded to IPFS.
4.  The symmetric key is then encrypted with the user's public key (derived from their wallet).
5.  The backend stores the IPFS hash and the **encrypted** symmetric key.

This ensures that only the user, using their private key, can decrypt the symmetric key and subsequently the health record. The backend cannot read the record's contents.

### Wallet-Based Identity
User accounts are tied directly to their blockchain wallet address (e.g., `0x742d...`). Authentication is performed by asking the user to sign a unique, server-generated message with their wallet. This proves ownership of the address without needing traditional passwords.

---

## 3. Backend Architecture

The backend consists of three main components that your server will interact with:

1.  **API Server (Node.js/Express)**: The core of the backend. It handles all client requests, manages user data, and orchestrates interactions with the database, IPFS, and the blockchain.
2.  **Database (PostgreSQL / MongoDB)**: Stores non-sensitive data that requires fast querying:
    - User profiles
    - Encrypted health record metadata
    - Access requests and active grants (can be cached from the blockchain for performance)
3.  **Service Integrations**:
    - **IPFS Gateway**: A service like [Pinata](https://www.pinata.cloud/) or a self-hosted IPFS node to pin (persist) user files.
    - **Blockchain Gateway**: A service like [Infura](https://www.infura.io/) or [Alchemy](https://www.alchemy.com/) to send transactions to and read data from the blockchain.

---

## 4. Database Schema

The following collections/tables are required.

#### `users`
Stores user profile information.

| Field              | Type      | Description                               |
| ------------------ | --------- | ----------------------------------------- |
| `walletId`         | `String`  | **Primary Key**. User's wallet address.   |
| `name`             | `String`  | User's full name.                         |
| `email`            | `String`  | User's email address.                     |
| `dateOfBirth`      | `Date`    | User's date of birth.                     |
| `bloodType`        | `String`  | e.g., "B+"                                |
| `allergies`        | `Array`   | `[String]` of known allergies.            |
| `chronicConditions`| `Array`   | `[String]` of chronic conditions.         |
| `medications`      | `Array`   | `[{ name, dosage, frequency }]`           |
| `tier`             | `String`  | User's subscription tier, e.g., "Plus".   |

#### `health_records`
Stores metadata for user-uploaded health records.

| Field                 | Type     | Description                                                          |
| --------------------- | -------- | -------------------------------------------------------------------- |
| `id`                  | `UUID`   | **Primary Key**. Unique record identifier.                         |
| `ownerWalletId`       | `String` | **Foreign Key** to `users.walletId`.                                 |
| `name`                | `String` | The original filename.                                               |
| `category`            | `String` | e.g., "Lab Results", "Imaging".                                      |
| `uploadedAt`          | `Date`   | Timestamp of upload.                                                 |
| `size`                | `String` | File size, e.g., "2.3 MB".                                           |
| `ipfsHash`            | `String` | The IPFS Content Identifier (CID) for the encrypted file.            |
| `encryptedSymmetricKey` | `String` | The symmetric key (used to encrypt the file), encrypted with the user's public key. |

#### `accessRequests`
Stores pending requests from providers to access a user's data.

| Field               | Type     | Description                                      |
| ------------------- | -------- | ------------------------------------------------ |
| `id`                | `UUID`   | **Primary Key**.                                 |
| `providerWalletId`  | `String` | Wallet ID of the requesting healthcare provider. |
| `patientWalletId`   | `String` | Wallet ID of the patient.                        |
| `reason`            | `String` | Reason for the access request.                   |
| `requestedDuration` | `String` | e.g., "48 hours".                                |
| `dataCategories`    | `Array`  | `[String]` of record categories requested.     |
| `timestamp`         | `Date`   | When the request was made.                       |
| `status`            | `String` | `pending`, `approved`, `denied`.                 |

---

## 5. API Endpoints

All endpoints should be prefixed with `/api`. Secure endpoints must be protected by a middleware that verifies a JWT.

### Authentication

**1. `POST /auth/request-message`**
   - Generates a unique, random message for a user to sign to prove wallet ownership.
   - **Body**: `{ walletId: "0x..." }`
   - **Response**: `{ message: "Please sign this message to log in: 1a2b3c..." }`

**2. `POST /auth/verify-signature`**
   - Verifies the signed message and returns a JWT if valid.
   - **Body**: `{ walletId: "0x...", signature: "0x..." }`
   - **Response**: `{ token: "jwt_token_string", user: { ...userObject } }` or `401 Unauthorized`.

### User

**1. `GET /user`**
   - **Protected**: Yes
   - Fetches the profile for the authenticated user.
   - **Response**: `{ user: { ...userObject } }`

**2. `PUT /user`**
   - **Protected**: Yes
   - Updates the profile for the authenticated user.
   - **Body**: `{ name: "...", email: "..." }` (and other user fields)
   - **Response**: `{ user: { ...updatedUserObject } }`

### Health Records

**1. `GET /health-records`**
   - **Protected**: Yes
   - Returns a list of all health record metadata for the authenticated user.
   - **Response**: `{ healthRecords: [ ...recordMetadataObjects ] }`

**2. `POST /health-records`**
   - **Protected**: Yes
   - Saves the metadata of a new, successfully uploaded health record. The file is uploaded client-side to IPFS first.
   - **Body**: `{ name, category, size, ipfsHash, encryptedSymmetricKey }`
   - **Response**: `201 Created` with `{ healthRecord: { ...newRecordMetadata } }`

### Access Management

**1. `GET /access/requests`**
   - **Protected**: Yes
   - Gets a list of all pending access requests for the authenticated user.
   - **Response**: `{ accessRequests: [ ...requestObjects ] }`

**2. `GET /access/active`**
   - **Protected**: Yes
   - Gets a list of all providers with currently active access grants. This data should be sourced from the blockchain.
   - **Response**: `{ activeAccess: [ ...grantObjects ] }`

**3. `POST /access/requests/:id/approve`**
   - **Protected**: Yes
   - Approves a pending access request.
   - This endpoint must trigger a transaction to the `grantAccess` function on the smart contract.
   - **Body**: `{}`
   - **Response**: `200 OK` with `{ message: "Access approved successfully." }`

**4. `POST /access/requests/:id/deny`**
   - **Protected**: Yes
   - Denies a pending access request. Updates the request status in the DB.
   - **Body**: `{}`
   - **Response**: `200 OK` with `{ message: "Access denied." }`

**5. `POST /access/grants/:id/revoke`**
   - **Protected**: Yes
   - Revokes an active access grant.
   - This endpoint must trigger a transaction to the `revokeAccess` function on the smart contract.
   - **Body**: `{}`
   - **Response**: `200 OK` with `{ message: "Access revoked." }`

### Audit Trail

**1. `GET /audit`**
   - **Protected**: Yes
   - Fetches the complete, human-readable audit trail for the user.
   - The backend should query all `AuditEventLogged` events from the smart contract, format them, and return them. Caching is recommended for performance.
   - **Response**: `{ auditLog: [ ...auditLogEntryObjects ] }`

---

## 6. Smart Contract Interaction

The backend needs to communicate with a smart contract deployed on the blockchain.

**Required Smart Contract Functions (to call):**
- `grantAccess(providerAddress, patientAddress, expiresAtTimestamp, categories)`: Called when a user approves an access request.
- `revokeAccess(grantId)`: Called when a user revokes access.

**Required Smart Contract Events (to listen for):**
- `AccessGranted(grantId, providerAddress, patientAddress)`: Listen for this to update the local DB/cache.
- `AccessRevoked(grantId)`: Listen for this to update the local DB/cache.
- `AuditEventLogged(logId, patientAddress, actorAddress, eventType, resource)`: This is the source of truth for the audit trail. Your backend should have a listener service that ingests these events and stores them in a queryable format.

---

## 7. Setup & Environment

The server will require the following environment variables in a `.env` file:

```
# Server Configuration
PORT=8080

# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT
JWT_SECRET="a_very_strong_and_secret_key"

# Blockchain
BLOCKCHAIN_RPC_URL="https://polygon-mumbai.g.alchemy.com/v2/your-api-key"
SMART_CONTRACT_ADDRESS="0x..."
BACKEND_WALLET_PRIVATE_KEY="your_server_wallet_private_key_for_writing_to_contract"

# IPFS
IPFS_PINATA_API_KEY="your_pinata_api_key"
IPFS_PINATA_SECRET_KEY="your_pinata_secret"
```

This guide provides a comprehensive overview of the backend requirements for BioVault. Please reach out with any questions.
