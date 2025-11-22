// src/lib/ipfs-vault/ipfs.ts
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

// Configure with Infura credentials or use default gateway
const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || '';
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET || '';

let ipfsClient: any = null;

const getIPFSClient = () => {
  if (!ipfsClient) {
    if (projectId && projectSecret) {
      const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');
      ipfsClient = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
          authorization: auth,
        }
      });
    } else {
      // Use public gateway for demo
      ipfsClient = create({
        host: 'ipfs.io',
        port: 443,
        protocol: 'https'
      });
    }
  }
  return ipfsClient;
};

/**
 * Store encrypted data on IPFS with automatic pinning
 */
export const storeOnIPFS = async (data: string): Promise<string> => {
  try {
    const client = getIPFSClient();
    const { cid } = await client.add(data);
    
    // Try to pin if using Infura
    try {
      await client.pin.add(cid);
    } catch (e) {
      console.warn('Pinning not available:', e);
    }
    
    console.log(`Stored on IPFS: ${cid.toString()}`);
    return cid.toString();
  } catch (error: any) {
    console.error('IPFS upload failed:', error);
    throw new Error(`IPFS upload failed: ${error.message}`);
  }
};

/**
 * Retrieve data from IPFS
 */
export const retrieveFromIPFS = async (hash: string): Promise<string> => {
  try {
    const client = getIPFSClient();
    const chunks: Uint8Array[] = [];
    for await (const chunk of client.cat(hash)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString();
  } catch (error: any) {
    console.error('IPFS retrieval failed:', error);
    throw new Error(`IPFS retrieval failed: ${error.message}`);
  }
};

/**
 * Verify IPFS content integrity
 */
export const verifyIPFSContent = async (hash: string, expectedData: string): Promise<boolean> => {
  try {
    const actualData = await retrieveFromIPFS(hash);
    return actualData === expectedData;
  } catch {
    return false;
  }
};
