"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Unlock, Upload, Download, Shield, Wallet, Key, Database } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { initWeb3Auth, getUserAddress } from "@/lib/ipfs-vault/wallet";
import { encryptWithBiometrics, decryptWithBiometrics, initBiometrics } from "@/lib/ipfs-vault/biometrics.web";
import { storeOnIPFS, retrieveFromIPFS } from "@/lib/ipfs-vault/ipfs";
import { Web3Auth } from "@web3auth/modal";
import { SafeEventEmitterProvider } from "@web3auth/base";

export default function IPFSVaultPage() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  // Store secret state
  const [secret, setSecret] = useState("");
  const [isStoring, setIsStoring] = useState(false);
  const [ipfsHash, setIpfsHash] = useState("");

  // Retrieve secret state
  const [retrieveHash, setRetrieveHash] = useState("");
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [retrievedSecret, setRetrievedSecret] = useState("");

  // Stored secrets list
  const [storedSecrets, setStoredSecrets] = useState<Array<{ hash: string; name: string; date: string }>>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = await initWeb3Auth();
        setWeb3auth(web3authInstance);
        
        const bioAvailable = await initBiometrics();
        setBiometricsAvailable(bioAvailable);

        if (web3authInstance.status === 'connected' && web3authInstance.provider) {
          await handleConnected(web3authInstance.provider);
        }

        // Load stored secrets from localStorage
        const stored = localStorage.getItem('ipfs_secrets');
        if (stored) {
          setStoredSecrets(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Failed to initialize vault');
      }
    };

    init();
  }, []);

  const handleConnected = async (providerInstance: SafeEventEmitterProvider) => {
    try {
      const address = await getUserAddress(providerInstance);
      setUserAddress(address);
      setProvider(providerInstance);
      setIsAuthenticated(true);
      toast.success(`Connected: ${address.substring(0, 6)}...${address.substring(38)}`);
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to get user address');
    }
  };

  const handleLogin = async () => {
    if (!web3auth) {
      toast.error('Web3Auth not initialized');
      return;
    }

    try {
      const web3authProvider = await web3auth.connect();
      if (web3authProvider) {
        await handleConnected(web3authProvider);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    }
  };

  const handleLogout = async () => {
    if (!web3auth) return;

    try {
      await web3auth.logout();
      setIsAuthenticated(false);
      setUserAddress("");
      setProvider(null);
      setSecret("");
      setRetrievedSecret("");
      toast.success('Logged out');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleStoreSecret = async () => {
    if (!secret || !userAddress) {
      toast.error('Please enter a secret and connect wallet');
      return;
    }

    setIsStoring(true);
    try {
      // Encrypt with biometrics + wallet key
      toast.info('Encrypting with device key...');
      const encrypted = await encryptWithBiometrics(secret, userAddress);
      
      // Store on IPFS
      toast.info('Uploading to IPFS...');
      const hash = await storeOnIPFS(encrypted);
      
      setIpfsHash(hash);
      
      // Save to local list
      const newSecret = {
        hash,
        name: `Secret ${storedSecrets.length + 1}`,
        date: new Date().toISOString()
      };
      const updated = [...storedSecrets, newSecret];
      setStoredSecrets(updated);
      localStorage.setItem('ipfs_secrets', JSON.stringify(updated));
      
      toast.success(`Stored! Hash: ${hash.substring(0, 12)}...`);
      setSecret("");
    } catch (error: any) {
      console.error('Store error:', error);
      toast.error(`Store failed: ${error.message}`);
    } finally {
      setIsStoring(false);
    }
  };

  const handleRetrieveSecret = async (hash?: string) => {
    const hashToUse = hash || retrieveHash;
    if (!hashToUse || !userAddress) {
      toast.error('Please enter IPFS hash and connect wallet');
      return;
    }

    setIsRetrieving(true);
    try {
      // Fetch from IPFS
      toast.info('Fetching from IPFS...');
      const encryptedData = await retrieveFromIPFS(hashToUse);
      
      // Decrypt with biometrics + wallet key
      toast.info('Decrypting with device key...');
      const decrypted = await decryptWithBiometrics(encryptedData, userAddress);
      
      setRetrievedSecret(decrypted);
      toast.success('Secret retrieved successfully!');
    } catch (error: any) {
      console.error('Retrieve error:', error);
      toast.error(`Retrieve failed: ${error.message}`);
    } finally {
      setIsRetrieving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">IPFS Secret Vault</h1>
            <p className="text-muted-foreground mb-6">
              Store encrypted secrets on IPFS with wallet authentication + device binding
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-medium">AES-256-GCM</div>
                <div className="text-xs text-muted-foreground">Encryption</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Database className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-medium">IPFS Storage</div>
                <div className="text-xs text-muted-foreground">Decentralized</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Wallet className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-medium">Wallet Key</div>
                <div className="text-xs text-muted-foreground">Web3Auth</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Key className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="font-medium">Device Key</div>
                <div className="text-xs text-muted-foreground">Biometric</div>
              </div>
            </div>

            {biometricsAvailable && (
              <Badge variant="outline" className="mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Biometric Security Available
              </Badge>
            )}

            <Button onClick={handleLogin} size="lg" className="w-full mb-4">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>

            <div className="text-xs text-muted-foreground">
              Supports: Google • Apple • MetaMask • WalletConnect
            </div>

            <Button variant="ghost" size="sm" className="mt-6" asChild>
              <Link href="/apps">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Apps
              </Link>
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/apps">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Lock className="w-6 h-6" />
                  IPFS Secret Vault
                </h1>
                <p className="text-sm text-muted-foreground">
                  Connected: {userAddress.substring(0, 6)}...{userAddress.substring(38)}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Store Secret Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Store Secret</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="secret">Secret Data</Label>
                  <Textarea
                    id="secret"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Enter API keys, passwords, or sensitive data..."
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>
                <Button 
                  onClick={handleStoreSecret} 
                  disabled={!secret || isStoring}
                  className="w-full"
                >
                  {isStoring ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Encrypt & Store on IPFS
                    </>
                  )}
                </Button>
                {ipfsHash && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-1">IPFS Hash:</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs flex-1 font-mono">{ipfsHash}</code>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => copyToClipboard(ipfsHash)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Retrieve Secret Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Download className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Retrieve Secret</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hash">IPFS Hash</Label>
                  <Input
                    id="hash"
                    value={retrieveHash}
                    onChange={(e) => setRetrieveHash(e.target.value)}
                    placeholder="QmXXXXXXXXXXXXXXXXXXXXXX"
                    className="font-mono text-sm"
                  />
                </div>
                <Button 
                  onClick={() => handleRetrieveSecret()} 
                  disabled={!retrieveHash || isRetrieving}
                  className="w-full"
                >
                  {isRetrieving ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Retrieve & Decrypt
                    </>
                  )}
                </Button>
                {retrievedSecret && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium mb-2">Decrypted Secret:</div>
                    <pre className="text-xs font-mono whitespace-pre-wrap break-all bg-background p-3 rounded border">
                      {retrievedSecret}
                    </pre>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="mt-2 w-full"
                      onClick={() => copyToClipboard(retrievedSecret)}
                    >
                      Copy Secret
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Stored Secrets List */}
          {storedSecrets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Stored Secrets</h2>
                <div className="space-y-2">
                  {storedSecrets.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.name}</div>
                        <code className="text-xs text-muted-foreground font-mono truncate block">
                          {item.hash}
                        </code>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(item.date).toLocaleString()}
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setRetrieveHash(item.hash);
                          handleRetrieveSecret(item.hash);
                        }}
                      >
                        Retrieve
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Security Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Architecture
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <div><strong>Double-Key Encryption:</strong> Wallet-derived key + Device-specific key</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <div><strong>AES-256-GCM:</strong> Military-grade encryption with integrity verification</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <div><strong>IPFS Storage:</strong> Decentralized, content-addressed, immutable</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <div><strong>Device Binding:</strong> Secrets tied to specific device + wallet combination</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
