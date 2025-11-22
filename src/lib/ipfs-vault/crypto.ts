// src/lib/ipfs-vault/crypto.ts
import { Buffer } from 'buffer';
import { sha256 } from '@ethersproject/sha2';

/**
 * Derive consistent encryption key from wallet address
 */
export const deriveUserKeyFromAddress = (address: string): Buffer => {
  const normalized = address.toLowerCase().replace('0x', '');
  const salt = 'ipfs_secret_vault_v1';
  const material = normalized + salt;
  const hash = sha256(Buffer.from(material, 'utf-8'));
  return Buffer.from(hash.replace('0x', ''), 'hex');
};

/**
 * Generate random 256-bit key for biometric binding
 */
export const generateRandomKey = (): Buffer => {
  if (typeof window !== 'undefined' && window.crypto) {
    return Buffer.from(window.crypto.getRandomValues(new Uint8Array(32)));
  }
  // Fallback for server-side rendering
  return Buffer.alloc(32);
};

/**
 * Combine wallet-derived and biometric keys
 */
export const combineKeys = (walletKey: Buffer, bioKey: Buffer): string => {
  const combined = Buffer.concat([walletKey, bioKey]);
  return sha256(combined).replace('0x', '');
};
