const { spawn } = require('child_process');
const path = require('path');

const env = { ...process.env, BROWSER: 'none', PORT: '3000' };
// On Windows, running .cmd files usually REQUIRES shell: true or the full path to node running the script
const cmd = path.join(__dirname, 'node_modules', '.bin', 'react-scripts.cmd');

console.log('Starting frontend from:', __dirname);
console.log('Using command:', cmd);

const proc = spawn(cmd, ['start'], {
    cwd: __dirname,
    env,
    shell: false // Try false to bypass cmd.exe parsing of the path
});

proc.stdout.on('data', (data) => console.log(data.toString()));
proc.stderr.on('data', (data) => console.error(data.toString()));
proc.on('close', (code) => console.log(`Frontend exited with code ${code}`));
