# Vành Khuyên - VPS Deployment Guide

## 🐦 Hướng dẫn triển khai Vành Khuyên lên VPS

This guide will help you deploy the Vành Khuyên platform on your VPS server (94.237.77.86).

---

## 📋 Prerequisites

### Server Requirements:
- Ubuntu 20.04+ or similar Linux distribution
- 2GB RAM minimum (4GB recommended)
- 20GB disk space
- Root or sudo access
- Port 80 and 443 open for web traffic

### What You Need:
- VPS IP: `94.237.77.86`
- SSH access (use key: `~/.ssh/vanhkhuyen`)
- Domain name: `vanhkhuyen.com`

---

## 🚀 Step-by-Step Deployment

### 1. Connect to Your Server

```bash
ssh -i ~/.ssh/vanhkhuyen root@94.237.77.86
```

Or if configured:
```bash
ssh vanhkhuyen
```

---

### 2. Update System and Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18+ (required for Next.js)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Git
apt install -y git

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (web server)
apt install -y nginx

# Verify installations
node --version  # Should be 18.x or higher
npm --version
git --version
```

---

### 3. Clone the Repository

```bash
# Navigate to web directory
cd /var/www

# Clone your repository
git clone https://github.com/binhpht/vanhkhuyen.git
cd vanhkhuyen
```

---

### 4. Install Application Dependencies

```bash
# Install Node.js dependencies
cd /var/www/vanhkhuyen
npm install

# Install web app dependencies
cd apps/librelingo-web
npm install
```

---

### 5. Set Up Environment Variables

```bash
# Create .env.local file
cd /var/www/vanhkhuyen/apps/librelingo-web
cat > .env.local << EOF
AUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://vanhkhuyen.com
NODE_ENV=production
EOF
```

---

### 6. Build the Application

```bash
cd /var/www/vanhkhuyen/apps/librelingo-web
npm run build
```

---

### 7. Set Up PM2 (Keep App Running)

```bash
# Start the application with PM2
cd /var/www/vanhkhuyen/apps/librelingo-web
pm2 start npm --name "vanhkhuyen" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the command it outputs

# Check status
pm2 status
pm2 logs vanhkhuyen
```

---

### 8. Configure Nginx (Reverse Proxy)

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/vanhkhuyen << 'EOF'
server {
    listen 80;
    server_name vanhkhuyen.com www.vanhkhuyen.com;

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
    }
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/vanhkhuyen /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx
```

---

### 9. Configure Firewall

```bash
# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp  # SSH
ufw enable
ufw status
```

---

### 10. Set Up SSL Certificate (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate for vanhkhuyen.com
certbot --nginx -d vanhkhuyen.com -d www.vanhkhuyen.com --non-interactive --agree-tos --email th_thcsso1kimthuy@lethuy.edu.vn

# Test auto-renewal
certbot renew --dry-run
```

### 11. Test the Deployment

Visit in your browser:
- **https://vanhkhuyen.com**
- **https://www.vanhkhuyen.com**

You should see the Vành Khuyên homepage! 🎉

---

## 🌐 DNS Configuration (Before SSL Setup)

**Important**: Before running SSL setup, configure your domain DNS:

1. Go to your domain registrar (where you bought vanhkhuyen.com)
2. Add DNS A records:
   - `vanhkhuyen.com` → `94.237.77.86`
   - `www.vanhkhuyen.com` → `94.237.77.86`
3. Wait 5-60 minutes for DNS propagation
4. Verify with: `nslookup vanhkhuyen.com`

---

## 🔄 Updating the Application

When you push updates to GitHub:

```bash
# On the server
cd /var/www/vanhkhuyen
git pull origin main
cd apps/librelingo-web
npm install
npm run build
pm2 restart vanhkhuyen
```

---

## 🛠️ Useful Commands

### Check Application Status
```bash
pm2 status
pm2 logs vanhkhuyen
pm2 monit
```

### Restart Application
```bash
pm2 restart vanhkhuyen
```

### Stop Application
```bash
pm2 stop vanhkhuyen
```

### View Logs
```bash
pm2 logs vanhkhuyen --lines 100
```

### Check Nginx
```bash
systemctl status nginx
nginx -t  # Test configuration
journalctl -u nginx -n 50  # View logs
```

---

## 📊 Monitoring and Maintenance

### Check Disk Space
```bash
df -h
```

### Check Memory Usage
```bash
free -h
pm2 monit
```

### Backup Database (if added later)
```bash
# Create backup directory
mkdir -p /var/backups/vanhkhuyen

# If you add a database later, backup regularly
# Example for PostgreSQL:
# pg_dump dbname > /var/backups/vanhkhuyen/backup-$(date +%Y%m%d).sql
```

---

## 🐛 Troubleshooting

### App Won't Start
```bash
pm2 logs vanhkhuyen  # Check error logs
cd /var/www/vanhkhuyen/apps/librelingo-web
npm run build  # Rebuild
pm2 restart vanhkhuyen
```

### Nginx Issues
```bash
nginx -t  # Test configuration
systemctl status nginx
journalctl -u nginx -n 50
```

### Port Already in Use
```bash
lsof -i :3000  # See what's using port 3000
pm2 list  # Check PM2 processes
```

---

## 📁 Important File Locations

- Application: `/var/www/vanhkhuyen`
- Web app: `/var/www/vanhkhuyen/apps/librelingo-web`
- Environment: `/var/www/vanhkhuyen/apps/librelingo-web/.env.local`
- Nginx config: `/etc/nginx/sites-available/vanhkhuyen`
- PM2 logs: `~/.pm2/logs/`

---

## 🔐 Security Recommendations

1. **Disable root SSH login** (after creating a regular user)
2. **Use SSH keys only** (disable password authentication)
3. **Set up firewall** (ufw)
4. **Keep system updated** (`apt update && apt upgrade`)
5. **Enable automatic security updates**
6. **Use HTTPS/SSL** (free with Let's Encrypt)
7. **Regular backups** of course data and dictionary

---

## 📞 Support

For issues or questions:
- Email: th_thcsso1kimthuy@lethuy.edu.vn
- GitHub: https://github.com/binhpht/vanhkhuyen

---

## ✅ Quick Deployment Checklist

- [ ] Server updated and dependencies installed
- [ ] Repository cloned to `/var/www/vanhkhuyen`
- [ ] npm dependencies installed
- [ ] `.env.local` configured
- [ ] Application built (`npm run build`)
- [ ] PM2 configured and running
- [ ] Nginx configured and running
- [ ] Firewall configured
- [ ] Application accessible via browser
- [ ] SSL certificate installed (optional)
- [ ] PM2 startup configured for auto-restart

---

**🎉 Once complete, Vành Khuyên will be live at http://94.237.77.86 (or your domain)!**

