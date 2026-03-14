import subprocess
import os
import time

backend_dir = r"c:\Users\ASUS\OneDrive\Desktop\su hackathone\SU-Hackathon\SU-Hackathon\backend"
frontend_dir = r"c:\Users\ASUS\OneDrive\Desktop\su hackathone\SU-Hackathon\SU-Hackathon\frontend"

def run_server(name, directory, command, env_vars):
    print(f"Starting {name} server in {directory}...")
    # Merge existing environment with new variables
    env = os.environ.copy()
    env.update(env_vars)
    
    process = subprocess.Popen(
        command,
        cwd=directory,
        env=env,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding='utf-8',
        errors='replace'
    )
    return process

# Env vars for backend
backend_env = {"PORT": "3000"}

# Start backend
backend_proc = run_server("Sovereign AI Engine", backend_dir, "node server.js", backend_env)

print("Main Server started on Port 3000. Logging output for 30 seconds...")
start_time = time.time()
while time.time() - start_time < 30:
    line = backend_proc.stdout.readline()
    if line:
        print(f"[Engine] {line.strip()}")
    time.sleep(0.1)

print("Launcher script finished tracking. Server is running on http://localhost:3000")
