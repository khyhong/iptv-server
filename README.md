# 📺 TV Station Manager

គ្រប់គ្រងប៉ុស្តិ៏ទូរទស្សន៍ M3U8 ចំនួន 10,000+ និងបង្កើត Playlist ដើម្បីលេងលើ Android!

---

## ✅ លក្ខណៈពិសេស

| លក្ខណៈ | ពិពណ៌នា |
|-------|--------|
| ➕ បន្ថែម/កែ/លុប | គ្រប់គ្រងប៉ុស្តិ៏តាម Dashboard |
| 🔍 Search & Filter | ស្វែងរកតាមឈ្មោះ, Category, ប្រទេស |
| 📋 Playlist M3U/M3U8 | បង្កើត Link ដើម្បីលេងលើ Android TV |
| 📥 Import/Export | បញ្ចូល M3U file ឬ JSON ចំនួន 10,000+ |
| 📱 Android Ready | ប្រើបានជាមួយ VLC, IPTV Smarters, TiviMate |

---

## 🚀 ជំហានដាក់ឲ្យដំណើរការ (ធ្វើតាម 1 ក្នុង 1)

### ជំហាន ១ — ចូលទៅ VPS តាម SSH

```bash
ssh root@YOUR_SERVER_IP
```

### ជំហាន ២ — ទាញយក Project នេះ

```bash
cd /root
```

(បញ្ចូល File ទាំងអស់ពី Folder `tv-station-manager` ទៅ VPS របស់អ្នក — ឬប្រើ `git clone` បើបាន Push ទៅ GitHub)

### ជំហាន ៣ — Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### ជំហាន ៤ — Install Dependencies និង Run

```bash
cd tv-station-manager
npm install
npm start
```

✅ **ឥឡូវ Website របស់អ្នកកំពុងដំណើរការនៅ `http://YOUR_SERVER_IP:3000`**

### ជំហាន ៥ — Run ជាប់រហូត (PM2)

```bash
npm install -g pm2
pm2 start server.js --name "tv-manager"
pm2 startup
pm2 save
```

---

## 📱 របៀបប្រើលើ Android

### ជម្រើស ១ — VLC for Android
1. ទាញយក VLC ពី Play Store
2. ចូលទៅ **Browse** → **Streams**
3. បញ្ចូល URL: `http://YOUR_SERVER_IP:3000/api/playlist.m3u8`
4. ចុច **Play**!

### ជម្រើស ២ — IPTV Smarters Pro
1. ចូលទៅ **Add Playlist** → **Load Your Playlist**
2. ជ្រើសរើស **M3U URL**
3. បញ្ចូល URL: `http://YOUR_SERVER_IP:3000/api/playlist.m3u8`
4. ចុច **Add**

---

## 📂 របៀបបញ្ចូល Stations ចំនួន 10,000

### ជម្រើស ១ — Import JSON

ទៅទំព័រ **"បញ្ចូលទិន្នន័យ"** នៅក្នុង Dashboard របស់អ្នក រួច Paste JSON បែបនេះ៖

```json
[
  {
    "name": "Cambodia TV",
    "url": "https://stream.example.com/cambodia.m3u8",
    "logo": "https://logo.example.com/cambodia.png",
    "category": "General",
    "country": "Cambodia",
    "language": "Khmer"
  },
  {
    "name": "Thai TV",
    "url": "https://stream.example.com/thai.m3u8",
    "logo": "https://logo.example.com/thai.png",
    "category": "News",
    "country": "Thailand",
    "language": "Thai"
  }
]
```

### ជម្រើស ២ — Import M3U/M3U8 File

បញ្ចូល Content នៃ M3U file ទាំងមូល រួចចុច **Parse M3U** → រួចចុច **បញ្ចូលទិន្នន័យ**

---

## 🔗 API Endpoints

| Endpoint | ការប្រើប្រាស់ |
|----------|-------------|
| `GET /api/stations` | ទាំងអស់ stations (with search, filter, pagination) |
| `POST /api/stations` | បន្ថែម station ថ្មី |
| `PUT /api/stations/:id` | កែ station |
| `DELETE /api/stations/:id` | លុប station |
| `GET /api/playlist.m3u` | ទាញយក M3U Playlist |
| `GET /api/playlist.m3u8` | ទាញយក M3U8 Playlist |
| `GET /api/playlist.m3u8?category=News` | Filter តាម Category |
| `POST /api/import` | Import JSON stations |

---

## 🛠️ បញ្ហាទូទៅ

| បញ្ហា | ដំណោះស្រាយ |
|-------|-----------|
| Server ដួល | `pm2 restart tv-manager` |
| Firewall រារាំង | `ufw allow 3000` |
| Port រវល់ | `lsof -i :3000` រួច kill process |
| មើល Logs | `pm2 logs tv-manager` |

---

## 🎯 ចំណាំសំខាន់

- **Data** ទាំងអស់រក្សាទុកនៅ `data/stations.json`
- **Backup** ទំព័រ Export ឬ Copy file `data/stations.json`
- **Domain + HTTPS** — អានជំហាន ៥ នៅក្នុងឯកសារ `DEPLOY_GUIDE.md`

---

## 💬 ត្រូវការជំនួយ?

បើអ្នកជាអ្នកដែលមិនចេះកូដ — គ្រាន់តែធ្វើតាមជំហានខាងលើ ១ ក្នុង ១ នឹងដំណើរការបាន!

---

🎉 រីករាយមើលប៉ុស្តិ៏ទូរទស្សន៍របស់អ្នក!
