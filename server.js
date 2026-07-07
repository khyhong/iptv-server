const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'stations.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ensure data file exists
function initDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      stations: [],
      categories: ['General', 'News', 'Sports', 'Movies', 'Music', 'Kids', 'Documentary']
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
}

function loadData() {
  initDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Generate sample stations (100 demo stations)
app.get('/api/generate-sample', (req, res) => {
  const sampleStations = [];
  const categories = ['General', 'News', 'Sports', 'Movies', 'Music', 'Kids', 'Documentary'];
  const countries = ['USA', 'UK', 'France', 'Germany', 'Japan', 'Korea', 'Thailand', 'Cambodia', 'China', 'India'];
  
  for (let i = 1; i <= 100; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    sampleStations.push({
      id: Date.now() + i,
      name: `TV Station ${i} - ${cat}`,
      url: `https://example-stream.com/channel${i}/playlist.m3u8`,
      logo: `https://via.placeholder.com/80?text=TV${i}`,
      category: cat,
      country: country,
      language: 'English',
      enabled: true,
      createdAt: new Date().toISOString()
    });
  }
  
  const data = loadData();
  data.stations = [...data.stations, ...sampleStations];
  saveData(data);
  
  res.json({ success: true, message: `Generated ${sampleStations.length} sample stations`, count: sampleStations.length });
});

// Get all stations
app.get('/api/stations', (req, res) => {
  const data = loadData();
  let stations = data.stations;
  
  // Search filter
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    stations = stations.filter(s => 
      s.name.toLowerCase().includes(search) || 
      s.category.toLowerCase().includes(search) ||
      s.country.toLowerCase().includes(search)
    );
  }
  
  // Category filter
  if (req.query.category) {
    stations = stations.filter(s => s.category === req.query.category);
  }
  
  // Country filter
  if (req.query.country) {
    stations = stations.filter(s => s.country === req.query.country);
  }
  
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  res.json({
    stations: stations.slice(start, end),
    total: stations.length,
    page,
    totalPages: Math.ceil(stations.length / limit),
    categories: data.categories
  });
});

// Add new station
app.post('/api/stations', (req, res) => {
  const data = loadData();
  const station = {
    id: Date.now(),
    ...req.body,
    enabled: true,
    createdAt: new Date().toISOString()
  };
  data.stations.push(station);
  saveData(data);
  res.json({ success: true, station });
});

// Update station
app.put('/api/stations/:id', (req, res) => {
  const data = loadData();
  const idx = data.stations.findIndex(s => s.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  
  data.stations[idx] = { ...data.stations[idx], ...req.body };
  saveData(data);
  res.json({ success: true, station: data.stations[idx] });
});

// Delete station
app.delete('/api/stations/:id', (req, res) => {
  const data = loadData();
  data.stations = data.stations.filter(s => s.id != req.params.id);
  saveData(data);
  res.json({ success: true });
});

// Bulk delete
app.post('/api/stations/bulk-delete', (req, res) => {
  const data = loadData();
  const ids = req.body.ids || [];
  data.stations = data.stations.filter(s => !ids.includes(s.id));
  saveData(data);
  res.json({ success: true, deleted: ids.length });
});

// Toggle station enabled
app.put('/api/stations/:id/toggle', (req, res) => {
  const data = loadData();
  const station = data.stations.find(s => s.id == req.params.id);
  if (!station) return res.status(404).json({ error: 'Not found' });
  station.enabled = !station.enabled;
  saveData(data);
  res.json({ success: true, enabled: station.enabled });
});

// Get categories
app.get('/api/categories', (req, res) => {
  const data = loadData();
  res.json(data.categories || []);
});

// Add category
app.post('/api/categories', (req, res) => {
  const data = loadData();
  const cat = req.body.category;
  if (!data.categories.includes(cat)) {
    data.categories.push(cat);
    saveData(data);
  }
  res.json({ success: true, categories: data.categories });
});

// Get unique countries
app.get('/api/countries', (req, res) => {
  const data = loadData();
  const countries = [...new Set(data.stations.map(s => s.country).filter(Boolean))];
  res.json(countries);
});

// Generate M3U Playlist
app.get('/api/playlist.m3u', (req, res) => {
  const data = loadData();
  let stations = data.stations.filter(s => s.enabled !== false);
  
  if (req.query.category) {
    stations = stations.filter(s => s.category === req.query.category);
  }
  
  let m3u = '#EXTM3U\n';
  stations.forEach(station => {
    m3u += `#EXTINF:-1 tvg-id="${station.id}" tvg-name="${station.name}" tvg-logo="${station.logo || ''}" group-title="${station.category || 'General'}",${station.name}\n`;
    m3u += `${station.url}\n`;
  });
  
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.setHeader('Content-Disposition', 'attachment; filename="playlist.m3u"');
  res.send(m3u);
});

// Generate M3U8 Playlist
app.get('/api/playlist.m3u8', (req, res) => {
  const data = loadData();
  let stations = data.stations.filter(s => s.enabled !== false);
  
  if (req.query.category) {
    stations = stations.filter(s => s.category === req.query.category);
  }
  
  let m3u = '#EXTM3U\n';
  stations.forEach(station => {
    m3u += `#EXTINF:-1 tvg-id="${station.id}" tvg-name="${station.name}" tvg-logo="${station.logo || ''}" group-title="${station.category || 'General'}",${station.name}\n`;
    m3u += `${station.url}\n`;
  });
  
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.setHeader('Content-Disposition', 'attachment; filename="playlist.m3u8"');
  res.send(m3u);
});

// Export JSON
app.get('/api/export', (req, res) => {
  const data = loadData();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="stations.json"');
  res.json(data.stations);
});

// Bulk import
app.post('/api/import', (req, res) => {
  const data = loadData();
  const stations = req.body.stations || [];
  const newStations = stations.map(s => ({
    id: Date.now() + Math.floor(Math.random() * 100000),
    ...s,
    createdAt: new Date().toISOString()
  }));
  data.stations = [...data.stations, ...newStations];
  saveData(data);
  res.json({ success: true, imported: newStations.length });
});

// Dashboard stats
app.get('/api/stats', (req, res) => {
  const data = loadData();
  const enabled = data.stations.filter(s => s.enabled !== false).length;
  const disabled = data.stations.length - enabled;
  res.json({
    total: data.stations.length,
    enabled,
    disabled,
    categories: data.categories.length
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TV Station Manager running on http://0.0.0.0:${PORT}`);
  console.log(`📺 Admin Dashboard: http://your-server-ip:${PORT}`);
  console.log(`📄 Playlist URL: http://your-server-ip:${PORT}/api/playlist.m3u8`);
});
