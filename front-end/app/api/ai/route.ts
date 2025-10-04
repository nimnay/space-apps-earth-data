import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { spawn, ChildProcess } from "child_process";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    // Input validation
    const body = await req.json();
    const { message, mode } = body;
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }
    
    if (!mode || !['wildfire', 'pollution'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode. Must be "wildfire" or "pollution"' }, { status: 400 });
    }
    
    // Get paths
    const projectRoot = path.resolve(process.cwd(), '..');
    const pythonPath = path.join(projectRoot, '.venv', 'Scripts', 'python.exe');
    const scriptPath = path.join(projectRoot, 'ai', 'bridge.py');
    
    // Debug logging
    console.log({
      workingDirectory: process.cwd(),
      projectRoot,
      pythonPath,
      scriptPath,
      mode,
      message,
      pythonExists: fs.existsSync(pythonPath),
      scriptExists: fs.existsSync(scriptPath)
    });
    
    // Validate files exist
    if (!fs.existsSync(pythonPath)) {
      console.error(`Python not found: ${pythonPath}`);
      return NextResponse.json({ error: 'Python environment not configured' }, { status: 500 });
    }
    
    if (!fs.existsSync(scriptPath)) {
      console.error(`Script not found: ${scriptPath}`);
      return NextResponse.json({ error: 'AI script not found' }, { status: 500 });
    }
    
    return new Promise((resolve, reject) => {
      try {
        const childProcess: ChildProcess = spawn(pythonPath, [scriptPath, mode, message], {
          env: { ...process.env },
          cwd: path.dirname(scriptPath)
        });

        let output = '';
        let error = '';

        childProcess.stdout?.on('data', (data: Buffer) => {
          output += data.toString('utf-8');
        });

        childProcess.stderr?.on('data', (data: Buffer) => {
          error += data.toString('utf-8');
          console.error('Python stderr:', data.toString('utf-8'));
        });

        childProcess.on('error', (err) => {
          console.error('Process error:', err);
          reject(new Error(`Failed to start process: ${err.message}`));
        });

        childProcess.on('close', (code: number | null) => {
          console.log('Process closed with code:', code);
          console.log('Output:', output);
          console.log('Error:', error);
          
          if (code !== 0) {
            resolve(NextResponse.json({ 
              error: error || 'Process failed',
              code,
              output 
            }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ response: output }));
          }
        });
      } catch (err) {
        console.error('Spawn error:', err);
        reject(err);
      }
    }).catch(error => {
      console.error('Promise error:', error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    });
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to process request',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}