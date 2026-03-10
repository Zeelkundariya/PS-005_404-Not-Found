import subprocess
import os
import time

backend_dir = r"C:\Users\zeelk\OneDrive\Desktop\AI & Automation for Manufacturing SMEs\smartfactory-ai\backend"
frontend_dir = r"C:\Users\zeelk\OneDrive\Desktop\AI & Automation for Manufacturing SMEs\smartfactory-ai\frontend"

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
backend_env = {"PORT": "3001"}
# Env vars for frontend
frontend_env = {"BROWSER": "none", "PORT": "3000"}

# Start backend
backend_proc = run_server("Backend", backend_dir, "node server.js", backend_env)

# Start frontend
frontend_proc = run_server("Frontend", frontend_dir, "npm start", frontend_env)

print("Servers started. Logging output for 30 seconds...")
start_time = time.time()
while time.time() - start_time < 30:
    for proc, name in [(backend_proc, "Backend"), (frontend_proc, "Frontend")]:
        line = proc.stdout.readline()
        if line:
            print(f"[{name}] {line.strip()}")
    time.sleep(0.1)

print("Launcher script finished tracking. Servers should be running in the background.")
