#!/bin/bash

echo "🚀 TV Station Manager — Easy Deploy Script"
echo "=========================================="

# Update system
echo "📦 Updating system..."
apt update && apt upgrade -y

# Install Node.js
echo "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Install Git
echo "📦 Installing Git..."
apt install git -y

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Clone project
echo "📂 Cloning project..."
cd /root

if [ -d "tv-station-manager" ]; then
    cd tv-station-manager
    git pull
else
    git clone https://github.com/$1/tv-station-manager.git
    cd tv-station-manager
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start with PM2
echo "🚀 Starting server..."
pm2 delete tv-manager 2>/dev/null || true
pm2 start server.js --name "tv-manager"
pm2 startup
pm2 save

# Open firewall
echo "🔥 Opening firewall..."
ufw allow 3000 2>/dev/null || true
ufw allow 80 2>/dev/null || true
ufw allow 443 2>/dev/null || true

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "========================"
echo "📺 Dashboard: http://$(hostname -I | awk '{print $1}'):3000"
echo "📋 Playlist: http://$(hostname -I | awk '{print $1}'):3000/api/playlist.m3u8"
echo ""
echo "🛠️ Useful commands:"
echo "   pm2 status        — Check server status"
echo "   pm2 logs          — View logs"
echo "   pm2 restart tv-manager  — Restart server"
echo ""
