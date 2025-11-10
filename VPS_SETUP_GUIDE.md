# Vành Khuyên VPS Setup Guide for AI Assistant

This guide is designed to help you deploy the Vành Khuyên platform on a VPS server.

---

## 📋 System Information

### Server Details:
- **IP Address**: `94.237.77.86`
- **Domain**: `vanhkhuyen.com`
- **OS**: Ubuntu 20.04+ (or compatible Linux)
- **User**: `root`

### Repository:
- **GitHub**: `https://github.com/binhpht/vanhkhuyen.git`
- **Branch**: `main`

---

## 🔧 Required Software & Versions

### 1. **Python**
- **Version**: Python 3.8, 3.9, or 3.10 (NOT 3.11+)
- Used for: Course export from YAML to JSON
- Check: `python3 --version`

### 2. **Node.js**
- **Version**: 18.x or higher (LTS recommended)
- Used for: Next.js web application
- Check: `node --version`

### 3. **npm**
- **Version**: 8.x or higher
- Comes with Node.js
- Check: `npm --version`

### 4. **Git**
- Any recent version
- Check: `git --version`

### 5. **PM2** (Process Manager)
- **Version**: Latest
- Install globally: `npm install -g pm2`
- Check: `pm2 --version`

### 6. **Nginx** (Web Server)
- **Version**: 1.18+ 
- Used for: Reverse proxy and SSL termination
- Check: `nginx -v`

---

## 📦 Installation Steps

### Step 1: Connect to Server

```bash
ssh root@94.237.77.86
```

---

### Step 2: Update System

```bash
apt update
apt upgrade -y
```

---

### Step 3: Install Python 3.10

```bash
# Add deadsnakes PPA for Python 3.10
apt install -y software-properties-common
add-apt-repository ppa:deadsnakes/ppa -y
apt update

# Install Python 3.10 and pip
apt install -y python3.10 python3.10-venv python3.10-dev python3-pip

# Verify version
python3.10 --version
# Should output: Python 3.10.x
```

---

### Step 4: Install Node.js 18.x

```bash
# Remove old Node.js if exists
apt remove -y nodejs npm

# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Install Node.js
apt install -y nodejs

# Verify versions
node --version    # Should be v18.x.x or higher
npm --version     # Should be 8.x.x or higher
```

---

### Step 5: Install Git

```bash
apt install -y git
git --version
```

---

### Step 6: Install PM2

```bash
npm install -g pm2
pm2 --version
```

---

### Step 7: Install Nginx

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
nginx -v
```

---

### Step 8: Clone Repository

```bash
# Create web directory
mkdir -p /var/www
cd /var/www

# Clone the repository
git clone https://github.com/binhpht/vanhkhuyen.git
cd vanhkhuyen

# Verify files exist
ls -la
```

---

### Step 9: Set Up Python Environment

```bash
cd /var/www/vanhkhuyen

# Create virtual environment with Python 3.10
python3.10 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install LibreLingo packages
pip install -e .

# Verify installation
pip list | grep librelingo
# Should show: librelingo-json-export, librelingo-yaml-loader, etc.
```

---

### Step 10: Export Bru Course to JSON

```bash
cd /var/www/vanhkhuyen
source .venv/bin/activate

# Export the bru-course to JSON format
python -c "
from librelingo_yaml_loader import load_course
from librelingo_json_export.export import export_course

course = load_course('./courses/bru-course')
export_course('./apps/librelingo-web/src/courses/bru-course', course)
print('✅ Course exported successfully!')
"

# Verify export
ls -la apps/librelingo-web/src/courses/bru-course/
# Should see: courseData.json and challenges/ directory
```

---

### Step 11: Install Node.js Dependencies (Root)

```bash
cd /var/www/vanhkhuyen

# Install root dependencies
npm install

# This installs dependencies for the monorepo
```

---

### Step 12: Install Web App Dependencies

```bash
cd /var/www/vanhkhuyen/apps/librelingo-web

# Install web app dependencies
npm install

# Verify installation
ls -la node_modules/ | wc -l
# Should show hundreds of modules installed
```

---

### Step 13: Configure Environment Variables

```bash
cd /var/www/vanhkhuyen/apps/librelingo-web

# Create .env.local file
cat > .env.local << EOF
AUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://vanhkhuyen.com
NODE_ENV=production
EOF

# Verify file created
cat .env.local
```

---

### Step 14: Build the Next.js Application

```bash
cd /var/www/vanhkhuyen/apps/librelingo-web

# Build for production
npm run build

# This will take 2-5 minutes
# Output should end with: "✓ Compiled successfully"
```

---

### Step 15: Start Application with PM2

```bash
cd /var/www/vanhkhuyen/apps/librelingo-web

# Start with PM2
pm2 start npm --name "vanhkhuyen" -- start

# Check status
pm2 status
# Should show "vanhkhuyen" status "online"

# View logs
pm2 logs vanhkhuyen --lines 20

# Save PM2 process list
pm2 save

# Set PM2 to start on boot
pm2 startup
# IMPORTANT: Run the command it outputs!
```

---

### Step 16: Configure Nginx

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/vanhkhuyen << 'EOF'
server {
    listen 80;
    server_name vanhkhuyen.com www.vanhkhuyen.com;

    # Redirect to HTTPS (will be added by Certbot)
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts for large dictionary loads
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
    
    # Increase body size for uploads
    client_max_body_size 50M;
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/vanhkhuyen /etc/nginx/sites-enabled/

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# If test passes, restart Nginx
systemctl restart nginx
systemctl status nginx
```

---

### Step 17: Configure Firewall

```bash
# Install UFW if not installed
apt install -y ufw

# Allow SSH (IMPORTANT - don't lock yourself out!)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw --force enable

# Check status
ufw status
```

---

### Step 18: Set Up SSL Certificate (HTTPS)

**IMPORTANT**: Make sure DNS is configured first!
- `vanhkhuyen.com` → `94.237.77.86`
- `www.vanhkhuyen.com` → `94.237.77.86`

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d vanhkhuyen.com -d www.vanhkhuyen.com \
  --non-interactive \
  --agree-tos \
  --email th_thcsso1kimthuy@lethuy.edu.vn \
  --redirect

# This will:
# - Get SSL certificates
# - Update Nginx config automatically
# - Set up auto-renewal
# - Redirect HTTP to HTTPS

# Test auto-renewal
certbot renew --dry-run
```

---

### Step 19: Verify Deployment

```bash
# Check if app is running
pm2 status
pm2 logs vanhkhuyen --lines 50

# Check if Nginx is running
systemctl status nginx

# Test from command line
curl -I http://localhost:3000
# Should return HTTP 200

# Test external access
curl -I https://vanhkhuyen.com
# Should return HTTP 200 or 301 (redirect)
```

---

## 🔍 Verification Checklist

Run these commands to verify everything is working:

```bash
# 1. Python
python3.10 --version
# Expected: Python 3.10.x

# 2. Node.js
node --version
# Expected: v18.x.x or higher

# 3. PM2
pm2 list
# Expected: vanhkhuyen process running (online)

# 4. Nginx
systemctl status nginx
# Expected: active (running)

# 5. Application
curl http://localhost:3000
# Expected: HTML response with "Vành Khuyên"

# 6. SSL
curl -I https://vanhkhuyen.com
# Expected: HTTP 200 or 301

# 7. Ports
netstat -tlnp | grep -E ':(80|443|3000)'
# Expected: All three ports listening
```

---

## 📂 Important File Locations

```
/var/www/vanhkhuyen/                          # Main application
├── apps/librelingo-web/                      # Next.js web app
│   ├── .env.local                            # Environment variables
│   ├── package.json                          # Dependencies
│   └── src/                                  # Source code
├── courses/bru-course/                       # Course YAML files
├── dict/bru-dictionary/                      # Dictionary data
├── .venv/                                    # Python virtual environment
└── pyproject.toml                            # Python dependencies

/etc/nginx/sites-available/vanhkhuyen         # Nginx config
/etc/nginx/sites-enabled/vanhkhuyen           # Nginx enabled site
~/.pm2/logs/                                  # PM2 logs
/etc/letsencrypt/                             # SSL certificates
```

---

## 🔄 How to Update the Application

When code is updated on GitHub:

```bash
# 1. Connect to server
ssh root@94.237.77.86

# 2. Pull latest code
cd /var/www/vanhkhuyen
git pull origin main

# 3. If courses changed, re-export
source .venv/bin/activate
python -c "
from librelingo_yaml_loader import load_course
from librelingo_json_export.export import export_course
course = load_course('./courses/bru-course')
export_course('./apps/librelingo-web/src/courses/bru-course', course)
"

# 4. Update dependencies (if package.json changed)
cd apps/librelingo-web
npm install

# 5. Rebuild application
npm run build

# 6. Restart application
pm2 restart vanhkhuyen

# 7. Check logs
pm2 logs vanhkhuyen --lines 50
```

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors
```bash
cd /var/www/vanhkhuyen/apps/librelingo-web
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart vanhkhuyen
```

### Issue: Port 3000 already in use
```bash
# Find what's using the port
lsof -i :3000
# Kill the process or stop duplicate PM2 instances
pm2 delete all
pm2 start npm --name "vanhkhuyen" -- start
```

### Issue: Nginx won't start
```bash
# Test configuration
nginx -t

# Check logs
journalctl -u nginx -n 50

# Restart
systemctl restart nginx
```

### Issue: SSL certificate fails
```bash
# Make sure DNS is configured correctly
nslookup vanhkhuyen.com
# Should return: 94.237.77.86

# Try again
certbot --nginx -d vanhkhuyen.com -d www.vanhkhuyen.com
```

### Issue: Application crashes
```bash
# Check PM2 logs
pm2 logs vanhkhuyen --lines 100

# Check environment variables
cat /var/www/vanhkhuyen/apps/librelingo-web/.env.local

# Restart with more memory
pm2 delete vanhkhuyen
pm2 start npm --name "vanhkhuyen" --max-memory-restart 500M -- start
```

---

## 🔐 Security Checklist

```bash
# 1. Set up firewall
ufw status
# Should show: 22, 80, 443 allowed

# 2. Disable password authentication (after SSH key works)
nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
# Set: PermitRootLogin prohibit-password
systemctl restart sshd

# 3. Keep system updated
apt update && apt upgrade -y

# 4. Set up automatic security updates
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

---

## 📊 Monitoring Commands

```bash
# Check application status
pm2 status
pm2 monit

# View real-time logs
pm2 logs vanhkhuyen

# Check server resources
htop  # Install with: apt install htop
df -h  # Disk space
free -h  # Memory

# Check Nginx status
systemctl status nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Check application performance
curl -w "@-" -o /dev/null -s https://vanhkhuyen.com << 'EOF'
    time_namelookup:  %{time_namelookup}\n
    time_connect:  %{time_connect}\n
    time_total:  %{time_total}\n
EOF
```

---

## 🗂️ Course Data Structure

The application uses these data sources:

### 1. Course Files (YAML)
```
courses/bru-course/
├── course.yaml                    # Main course config
├── basics/
│   ├── module.yaml
│   └── skills/
│       ├── greetings.yaml         # Vocabulary & phrases
│       └── introductions.yaml
├── family/, numbers/, animals/    # Other modules
└── ... (7 modules total)
```

### 2. Exported JSON (Auto-generated)
```
apps/librelingo-web/src/courses/bru-course/
├── courseData.json                # Course metadata
└── challenges/                    # Challenge files
    ├── loi-chao-greetings.json
    ├── gioi-thieu-introductions.json
    └── ... (16 files total)
```

### 3. Dictionary
```
dict/bru-dictionary/
└── bru_dictionary.json            # 3,683 entries
```

**Note**: JSON files are generated from YAML. Always edit YAML files, then re-export!

---

## 🔄 Re-exporting Courses

If you modify course YAML files:

```bash
cd /var/www/vanhkhuyen
source .venv/bin/activate

python << 'PYEOF'
from librelingo_yaml_loader import load_course
from librelingo_json_export.export import export_course

course = load_course('./courses/bru-course')
export_course('./apps/librelingo-web/src/courses/bru-course', course)
print('✅ Course exported!')
PYEOF

# Then rebuild and restart
cd apps/librelingo-web
npm run build
pm2 restart vanhkhuyen
```

---

## 📝 Environment Variables Explained

File: `/var/www/vanhkhuyen/apps/librelingo-web/.env.local`

```bash
# Authentication secret (keep secure!)
AUTH_SECRET=random-32-character-string

# Website URL (use your domain)
NEXTAUTH_URL=https://vanhkhuyen.com

# Environment
NODE_ENV=production
```

---

## 🌐 DNS Configuration

**Before SSL setup**, configure DNS at your domain registrar:

### Required DNS Records:
```
Type: A
Name: @
Value: 94.237.77.86
TTL: 3600

Type: A
Name: www
Value: 94.237.77.86
TTL: 3600
```

### Verify DNS:
```bash
nslookup vanhkhuyen.com
# Should return: 94.237.77.86

dig vanhkhuyen.com +short
# Should return: 94.237.77.86
```

Wait 5-60 minutes for DNS propagation before setting up SSL.

---

## 🚀 Quick Start Script

Save this as `deploy.sh` for easy deployment:

```bash
#!/bin/bash
set -e

echo "🐦 Deploying Vành Khuyên..."

# Update code
cd /var/www/vanhkhuyen
git pull origin main

# Export courses if changed
source .venv/bin/activate
python -c "
from librelingo_yaml_loader import load_course
from librelingo_json_export.export import export_course
course = load_course('./courses/bru-course')
export_course('./apps/librelingo-web/src/courses/bru-course', course)
"

# Build and restart
cd apps/librelingo-web
npm install
npm run build
pm2 restart vanhkhuyen

echo "✅ Deployment complete!"
pm2 logs vanhkhuyen --lines 20
```

Make executable:
```bash
chmod +x deploy.sh
```

---

## 📊 Expected Resource Usage

- **Memory**: 200-500 MB
- **CPU**: Low (5-15% on average)
- **Disk**: ~500 MB for app + dependencies
- **Network**: Minimal (static site, no external API calls)

---

## ✅ Final Verification

Visit these URLs in your browser:

1. **https://vanhkhuyen.com** - Homepage
2. **https://vanhkhuyen.com/dictionary** - Dictionary
3. **https://vanhkhuyen.com/vi/courses/brv** - Bru course
4. **https://vanhkhuyen.com/auth/signin** - Login page

All should load successfully!

---

## 📞 Support Information

**School**: TRƯỜNG PTDTBT TH&THCS SỐ 1 KIM THỦY
**Location**: Kim Thủy - Lệ Thủy - Quảng Trị
**Email**: th_thcsso1kimthuy@lethuy.edu.vn
**GitHub**: https://github.com/binhpht/vanhkhuyen

---

## 🎯 Success Indicators

After completing all steps, you should see:

```bash
✅ Python 3.10.x installed
✅ Node.js v18.x.x installed
✅ Repository cloned to /var/www/vanhkhuyen
✅ Python packages installed (librelingo-*)
✅ Course exported to JSON
✅ npm dependencies installed
✅ Application built successfully
✅ PM2 running "vanhkhuyen" (online)
✅ Nginx running and configured
✅ SSL certificate installed
✅ Website accessible at https://vanhkhuyen.com
✅ PM2 configured for auto-start on reboot
```

---

**🎊 When all checkmarks are complete, Vành Khuyên is live!**

The platform will be accessible to students at:
**https://vanhkhuyen.com** 🐦🎓🇻🇳

