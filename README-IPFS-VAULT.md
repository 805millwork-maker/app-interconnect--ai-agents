# IPFS Secret Vault

Secure, encrypted storage for sensitive data using Web3 authentication and IPFS.

## 🔐 Security Architecture

### Double-Key Encryption System

1. **Wallet-Derived Key**: Generated from your Ethereum wallet address
   - Consistent across devices for same wallet
   - Enables recovery via wallet backup

2. **Device-Specific Key**: Generated and stored locally
   - Binds secrets to specific device
   - Uses browser's secure storage (localStorage for web, secure enclave for mobile)

3. **Combined Encryption**: Both keys are combined for final AES-256-GCM encryption
   - Military-grade encryption standard
   - Authenticated encryption with integrity verification

### Authentication Flow

```
User → Web3Auth (Google/Apple/MetaMask) → Wallet Address
                                              ↓
                                    Derive Encryption Key
                                              ↓
                                    Combine with Device Key
                                              ↓
                                    Encrypt Data (AES-256-GCM)
                                              ↓
                                    Upload to IPFS
```

## 🚀 Getting Started

### 1. Access the Vault

Navigate to `/apps/ipfs-vault` or click the "Vault" link in the navigation.

### 2. Connect Wallet

Click "Connect Wallet" and choose your authentication method:
- **Google/Apple** - OAuth sign-in with Web3Auth
- **MetaMask** - Browser extension wallet
- **WalletConnect** - Mobile wallet connection

### 3. Store a Secret

1. Enter your sensitive data (API keys, passwords, etc.)
2. Click "Encrypt & Store on IPFS"
3. Your data is encrypted with your combined keys
4. The encrypted data is uploaded to IPFS
5. Save the returned IPFS hash (e.g., `QmXXXXXX...`)

### 4. Retrieve a Secret

1. Enter the IPFS hash
2. Click "Retrieve & Decrypt"
3. The encrypted data is fetched from IPFS
4. Your device key + wallet key decrypt the data
5. The original secret is displayed

## 📦 Features

### ✅ Currently Implemented

- **Web3Auth Integration**: Multiple sign-in options
- **AES-256-GCM Encryption**: Industry-standard encryption
- **IPFS Storage**: Decentralized, immutable storage
- **Device Binding**: Secrets tied to specific device + wallet
- **Local Secret History**: Track your stored secrets
- **Copy to Clipboard**: Easy secret management

### 🔄 Production Enhancements

For production deployment, consider:

1. **Infura IPFS Credentials**:
   ```bash
   NEXT_PUBLIC_INFURA_PROJECT_ID=your_project_id
   NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_project_secret
   ```

2. **Web3Auth Configuration**:
   ```bash
   NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_client_id
   ```
   Get credentials from: https://dashboard.web3auth.io

3. **Biometric Authentication** (Mobile):
   ```bash
   npm install react-native-biometrics react-native-keychain
   ```

4. **Private IPFS Network**: For highly sensitive data, use a private IPFS network

## 🔧 Technical Details

### File Structure

```
src/lib/ipfs-vault/
├── crypto.ts           # Key derivation and combination
├── biometrics.web.ts   # Web crypto implementation
├── ipfs.ts            # IPFS upload/download
└── wallet.ts          # Web3Auth integration

src/app/apps/ipfs-vault/
└── page.tsx           # Main vault interface
```

### Encryption Process

```typescript
// 1. Derive wallet key from address
const walletKey = sha256(walletAddress + salt);

// 2. Get/generate device key
const deviceKey = localStorage.getItem('bio_key') || generateRandom();

// 3. Combine keys
const finalKey = sha256(walletKey + deviceKey);

// 4. Encrypt with AES-256-GCM
const iv = crypto.getRandomValues(12 bytes);
const encrypted = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  finalKey,
  data
);

// 5. Store on IPFS
const cid = await ipfs.add(iv + encrypted);
```

### Security Considerations

**✅ Strengths**:
- End-to-end encryption (data never leaves device unencrypted)
- Double-key system (wallet + device binding)
- Decentralized storage (no single point of failure)
- Content addressing (data integrity verification)

**⚠️ Limitations**:
- Device loss = secret loss (unless wallet + device key backed up separately)
- IPFS data is public (but encrypted)
- Browser storage can be cleared (device key would be lost)

**🔐 Best Practices**:
- Backup your wallet seed phrase
- Use strong Web3Auth authentication
- Don't store device key in plaintext
- Consider hardware wallet for high-value secrets
- Use private IPFS for sensitive data

## 🌐 Integration with AppConnect

The IPFS Vault is pre-installed as a featured app in the marketplace:

1. **Featured Slot**: Cannot be removed from marketplace
2. **Direct Access**: Available at `/apps/ipfs-vault`
3. **Navigation**: Quick access from homepage navbar
4. **Inter-App Communication**: Can broadcast encrypted secrets to other apps

## 📱 Platform Support

### Web
- ✅ Chrome/Edge/Brave (WebAuthn support)
- ✅ Safari (FaceID/TouchID on macOS)
- ✅ Firefox (with secure context)

### Mobile (React Native)
- 🔄 iOS: FaceID/TouchID via `react-native-biometrics`
- 🔄 Android: Fingerprint/Face unlock via native APIs

### Desktop
- ✅ Electron apps with WebCrypto API
- ✅ Node.js with `node-webcrypto-ossl`

## 🤝 Contributing

To enhance the IPFS Vault:

1. **Add Social Providers**: Extend Web3Auth with Twitter, Discord, etc.
2. **Backup System**: Implement secret recovery mechanisms
3. **Sharing**: Add encrypted sharing with other wallet addresses
4. **Versioning**: Track secret versions on IPFS
5. **Expiry**: Implement time-based secret expiration

## 📚 References

- [Web3Auth Documentation](https://web3auth.io/docs)
- [IPFS HTTP Client](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [AES-GCM Encryption](https://en.wikipedia.org/wiki/Galois/Counter_Mode)

---

**Security Notice**: This is a demo implementation. For production use with sensitive data, conduct a professional security audit and implement additional safeguards.
