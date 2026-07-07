# 🚀 កំរិតវិធី Deploy ពេញលេញ (សម្រាប់អ្នកមិនចេះកូត)

> អានពីខាងលើចុះក្រោម។ ធ្វើតាម ១ ជំហាន ១ ជំហាន។

---

## 🧾 អ្វីដែលអ្នកត្រូវមានជាមុន

1. **GitHub Account** — ចុះឈ្មោះនៅ github.com
2. **DigitalOcean Account** — ចុះឈ្មោះនៅ digitalocean.com + បង់ប្រាក់ $5
3. **Computer** — មាន Terminal (Mac) ឬ Git Bash (Windows)

---

## ជំហាន ១ — ចុះឈ្មោះ GitHub + បង្កើត Repo (5 នាទី)

### ១.១ ចុះឈ្មោះ GitHub
- ចូលទៅ https://github.com
- ចុច **Sign Up** → បំពេញ Email, Password, Username
- Verify email

### ១.២ បង្កើត Repository ថ្មី
- ចូលទៅ GitHub Dashboard
- ចុចប៊ូតុង **ខៀវ "+"** ខាងលើ → **New repository**
- Repository name: `tv-station-manager`
- ជ្រើសរើស **Public** ✅
- ចុច **Create repository**

### ១.៣ Upload Project ឡើងទៅ GitHub

បើក Terminal / Git Bash នៅក្នុង Folder `tv-station-manager` (Folder ដែលខ្ញុំបានផ្តល់ឱ្យ)។

```bash
cd tv-station-manager

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tv-station-manager.git
git push -u origin main
```

✅ **ឥឡូវ Project របស់អ្នកនៅលើ GitHub ហើយ!**

---

## ជំហាន ២ — ទិញ DigitalOcean VPS $5/ខែ (5 នាទី)

### ២.១ ចុះឈ្មោះ DigitalOcean
- ចូលទៅ https://www.digitalocean.com
- ចុច **Sign Up** → ចុះឈ្មោះជាមួយ Email
- បំពេញព័ត៌មានបង់ប្រាក់ (Credit Card ឬ PayPal)
- **$200 Free Credit** បើប្រើ Link referral!

### ២.២ បង្កើត VPS (Droplet)

**ចុច "Create" ខាងលើ → ជ្រើសរើស "Droplets"**

រួចជ្រើសរើសជម្រើសទាំងនេះ៖

| ជម្រើស | ត្រូវជ្រើសរើស |
|--------|------------|
| **OS** | Ubuntu 22.04 (LTS) |
| **Plan** | Basic → $5/month (1 CPU, 1GB RAM, 25GB SSD) |
| **Region** | Singapore (ឬ NYC បើចង់) |
| **Authentication** | Password (ងាយស្រួលសម្រាប់អ្នកដំបូង) |

- ចុច **Create Droplet**
- រង់ចាំ ៣០ វិនាទី
- **ចូរចំណាំ IP Address** ដែលចេញមក (ឧ. `123.456.78.90`)

✅ **ឥឡូវអ្នកមាន Server ហើយ!**

---

## ជំហាន ៣ — Connect ទៅ Server តាម SSH (2 នាទី)

### លើ Mac / Linux
បើក Terminal រួចវាយ៖

```bash
ssh root@YOUR_SERVER_IP
```

វានឹងសួរ Password។ បញ្ចូល Password ដែល DigitalOcean បានផ្តល់ឱ្យ។

### លើ Windows
បើក **Git Bash** (ឬ PuTTY) រួចវាយដូចគ្នា៖

```bash
ssh root@YOUR_SERVER_IP
```

✅ **ប្រសិនបើឃើញពាក្យបែបនេះ = ចូលបាន!**
```
root@your-server:~#
```

---

## ជំហាន ៤ — Install Node.js + Deploy Project (10 នាទី)

**ធ្វើទាំងអស់នៅលើ Server (ពេលឃើញ `root@...`)**

### ៤.១ Update System
```bash
apt update && apt upgrade -y
```

### ៤.២ Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

Verify ថាដំឡើងបាន៖
```bash
node -v
npm -v
```

### ៤.៣ Install Git + Clone Project
```bash
apt install git -y

git clone https://github.com/YOUR_USERNAME/tv-station-manager.git
cd tv-station-manager
```

### ៤.៤ Install Dependencies ហើយ Run
```bash
npm install
npm start
```

✅ **ឥឡូវ Server កំពុងដំណើរការ!**

បើក Browser ហើយចូលទៅ៖
```
http://YOUR_SERVER_IP:3000
```

### ៤.៥ Run ជាប់រហូត (PM2)

បើចុច Ctrl+C វានឹងឈប់។ ដើម្បីឲ្យវាដំណើរការជាប់រហូត៖

```bash
npm install -g pm2
pm2 start server.js --name "tv-manager"
pm2 startup
pm2 save
```

✅ **Server នឹងចាប់ផ្តើមឡើងវិញដោយស្វ័យប្រវត្តិពេល Reboot!**

---

## ជំហាន ៥ — Domain + HTTPS (បន្ថែម 10 នាទី)

> ជំហាននេះ **ជាជម្រើស**។ អ្នកអាចប្រើ IP Address បានដោយមិនចាំបាច់មាន Domain ទេ។

### ៥.១ ទិញ Domain
- ចូលទៅ Namecheap, GoDaddy, ឬ Cloudflare
- ទិញឈ្មោះដែលចូលចិត្ត (ឧ. `mytvstreams.com`)

### ៥.២ ភ្ជាប់ Domain ទៅ Server
- ចូលទៅ **DNS Management** នៃ Domain អ្នក
- បង្កើត **A Record**៖
  - Host: `@` → Value: `YOUR_SERVER_IP`
  - Host: `www` → Value: `YOUR_SERVER_IP`
- Save រួចរង់ចាំ ៥-១៥ នាទី

### ៥.៣ Install Nginx + SSL (HTTPS)

**SSH ទៅ Server របស់អ្នកវិញ រួចវាយជំហានទាំងនេះ៖**

```bash
# Install Nginx
apt install nginx -y

# Create config
nano /etc/nginx/sites-available/tv-manager
```

**Paste អីខាងក្រោមចូលទៅក្នុង file (ជំនួស yourdomain.com)៖**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save:** ចុច `Ctrl+O` → `Enter` → `Ctrl+X`

```bash
# Enable site
ln -s /etc/nginx/sites-available/tv-manager /etc/nginx/sites-enabled/

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### ៥.៤ SSL Certificate (HTTPS)

```bash
apt install certbot python3-certbot-nginx -y

certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

វានឹងសួរ Email និងចុច **Y** ពីរបីដង។

✅ **ឥឡូវអ្នកមាន https://yourdomain.com!**

---

## 🎯 ផ្លូវងាយស្រួលជាងនេះ (One-Command Deploy Script)

បើអ្នកចង់ងាយស្រួល ខ្ញុំបានផ្តល់ script `deploy.sh` នៅក្នុង Folder។

ធ្វើតែនេះ៖

```bash
# លើ Server របស់អ្នក
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/tv-station-manager/main/deploy.sh | bash
```

---

## 📱 លឿនមើល Playlist លើ Android

**Playlist URL របស់អ្នក៖**
```
http://YOUR_SERVER_IP:3000/api/playlist.m3u8
```

**ឬបើមាន Domain៖**
```
https://yourdomain.com/api/playlist.m3u8
```

### App ណាដែលប្រើបានល្អ?

| App | តម្លៃ | ល្អបំផុតសម្រាប់ |
|-----|------|-------------|
| **VLC** | Free | ទូរសព្ទ, ថែប្លេត |
| **IPTV Smarters Pro** | Free | Android TV Box |
| **TiviMate** | ~$5 | Android TV / Firestick |
| **MX Player** | Free | ទូទៅ |

---

## 🆘 មិនដំណើរការ? ពិនិត្យជំហានទាំងនេះ

| បញ្ហា | ពិនិត្យ |
|-------|--------|
| មិនអាចចូល Website | `ufw status` — បើសិន Port 3000 blocked, វាយ `ufw allow 3000` |
| Server ឈប់ | `pm2 status` — បើសិនមិនដំណើរ វាយ `pm2 restart tv-manager` |
| Error មួយចំនួន | `pm2 logs tv-manager` |
| មិនអាច SSH | ពិនិត្យ IP Address, Password, Firewall របស់ DigitalOcean |

---

## 🎉 រីករាយ!

បើធ្វើតាមជំហានទាំងអស់នេះ — អ្នកនឹងមាន Server គ្រប់គ្រង 10,000 ប៉ុស្តិ៏ដំណើរការបានពេញលេញ!
