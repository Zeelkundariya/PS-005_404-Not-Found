const { spawn } = require('child_process');
const path = require('path');

const backendDir = 'C:\\Users\\zeelk\\OneDrive\\Desktop\\AI & Automation for Manufacturing SMEs\\smartfactory-ai\\backend';
const frontendDir = 'C:\\Users\\zeelk\\OneDrive\\Desktop\\AI & Automation for Manufacturing SMEs\\smartfactory-ai\\frontend';

function start(dir, cmd, args, env = {}) {
    console.log(`Starting ${cmd} in ${dir}...`);
    const p = spawn(cmd, args, {
        cwd: dir,
        env: { ...process.env, ...env },
        shell: true,
        stdio: 'inherit'
    });
    p.on('error', (err) => console.error(`Failed to start ${cmd} in ${dir}:`, err));
}

// Start backend
start(backendDir, 'node', ['server.js'], { PORT: 3001 });

// Start frontend
start(frontendDir, 'npx', ['react-scripts', 'start'], { PORT: 3000, BROWSER: 'none' });
