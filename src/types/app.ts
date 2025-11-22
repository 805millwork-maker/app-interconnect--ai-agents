// Multi-language app types
export interface MultiLangApp {
  id: string;
  lang: 'js-ts' | 'python' | 'rust' | 'solidity' | 'html-css';
  format: 'web' | 'api' | 'contract' | 'binary';
  runtime: 'node' | 'docker' | 'wasm';
  code: string;
  endpoint?: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  connections: number;
}

export const RUNTIMES = {
  python: { image: 'python:3.12-slim', cmd: 'uvicorn main:app --host 0.0.0.0 --port 8000' },
  rust: { image: 'rust:1.75', cmd: 'cargo run --release' },
  solidity: { image: 'node:20', cmd: 'npx hardhat run scripts/deploy.js --network localhost' },
  'js-ts': { image: 'node:20', cmd: 'npm start' },
  'html-css': { image: 'nginx:alpine', cmd: 'nginx -g "daemon off;"' },
} as const;
