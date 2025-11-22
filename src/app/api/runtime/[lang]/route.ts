import { NextRequest, NextResponse } from 'next/server';

const RUNTIME_URLS = {
  python: process.env.PYTHON_RUNTIME_URL || 'http://localhost:8000',
  rust: process.env.RUST_RUNTIME_URL || 'http://localhost:8080',
  solidity: process.env.SOLIDITY_RUNTIME_URL || 'http://localhost:8545',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  const lang = params.lang;
  
  if (!['python', 'rust', 'solidity'].includes(lang)) {
    return NextResponse.json(
      { error: 'Invalid runtime language' },
      { status: 400 }
    );
  }

  try {
    const runtimeUrl = RUNTIME_URLS[lang as keyof typeof RUNTIME_URLS];
    const response = await fetch(`${runtimeUrl}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    
    const data = await response.json();
    
    return NextResponse.json({
      status: 'connected',
      runtime: data.runtime || lang,
      url: runtimeUrl,
      ...data,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'disconnected',
      runtime: lang,
      url: RUNTIME_URLS[lang as keyof typeof RUNTIME_URLS],
      error: error instanceof Error ? error.message : 'Connection failed',
    });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  const lang = params.lang;
  
  if (!['python', 'rust', 'solidity'].includes(lang)) {
    return NextResponse.json(
      { error: 'Invalid runtime language' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { code, action = 'execute', entryPoint = 'main' } = body;

    const runtimeUrl = RUNTIME_URLS[lang as keyof typeof RUNTIME_URLS];
    
    let endpoint = '/execute';
    if (lang === 'solidity' && action === 'compile') {
      endpoint = '/compile';
    }
    
    const response = await fetch(`${runtimeUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        entry_point: entryPoint,
      }),
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      runtime: lang,
      ...data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      runtime: lang,
      error: error instanceof Error ? error.message : 'Execution failed',
    }, { status: 500 });
  }
}
