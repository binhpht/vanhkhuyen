#!/bin/bash
# Vành Khuyên - Quick Deployment Script
# Run this on the server: bash QUICK_DEPLOY.sh

set -e

echo "🐦 Deploying Vành Khuyên..."

# Clean up any existing PM2 processes
echo "Stopping existing processes..."
pm2 delete all 2>/dev/null || true

# Pull latest code
echo "Pulling latest code..."
cd /root/vanhkhuyen
git pull origin main

# Install dependencies
echo "Installing dependencies..."
cd apps/librelingo-web
npm install

# Clean and build
echo "Building application..."
rm -rf .next
npm run build

# Setup environment if not exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local..."
    cat > .env.local << EOF
AUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://vanhkhuyen.com
NODE_ENV=production
EOF
fi

# Start application
echo "Starting application..."
pm2 start npm --name "vanhkhuyen" -- start
pm2 save

# Setup autostart
pm2 startup | tail -1 | bash || true

echo "✅ Deployment complete!"
echo ""
echo "Check status: pm2 status"
echo "View logs: pm2 logs vanhkhuyen"
echo "Website: http://94.237.77.86/ or https://vanhkhuyen.com"

