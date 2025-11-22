// src/lib/ipfs-vault/biometrics.web.ts
import { Buffer } from 'buffer';
import { deriveUserKeyFromAddress, combineKeys, generateRandomKey } from './crypto';

let biometricKey: Buffer | null = null;

/**
 * Check if Web Crypto API is available
 */
export const initBiometrics = async (): Promise<boolean> => {
  return typeof window !== 'undefined' && 
         window.isSecureContext && 
         !!window.crypto?.subtle;
};

/**
 * Get or generate biometric key (stored in localStorage for web)
 */
export const getBiometricKey = (): Buffer => {
  if (!biometricKey) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bio_key');
      if (stored) {
        biometricKey = Buffer.from(stored, 'hex');
      } else {
        biometricKey = generateRandomKey();
        localStorage.setItem('bio_key', biometricKey.toString('hex'));
      }
    } else {
      biometricKey = Buffer.alloc(32);
    }
  }
  return biometricKey;
};

/**
 * Encrypt data using combined keys
 */
export const encryptWithBiometrics = async (
  data: string,
  walletAddress: string
): Promise<string> => {
  const walletKey = deriveUserKeyFromAddress(walletAddress);
  const bioKey = getBiometricKey();
  const finalKeyHex = combineKeys(walletKey, bioKey);
  
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    Buffer.from(finalKeyHex, 'hex'),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encodedData
  );
  
  return Buffer.concat([iv, new Uint8Array(encrypted)]).toString('base64');
};

/**
 * Decrypt data using combined keys
 */
export const decryptWithBiometrics = async (
  encryptedData: string,
  walletAddress: string
): Promise<string> => {
  const walletKey = deriveUserKeyFromAddress(walletAddress);
  const bioKey = getBiometricKey();
  const finalKeyHex = combineKeys(walletKey, bioKey);
  
  const dataBuffer = Buffer.from(encryptedData, 'base64');
  const iv = dataBuffer.subarray(0, 12);
  const encrypted = dataBuffer.subarray(12);
  
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    Buffer.from(finalKeyHex, 'hex'),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encrypted
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};
