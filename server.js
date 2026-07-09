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
      categories: ['General', 'News', 'Sports', 'Movies', 'Music', 'Kids', 'Documentary'],
      groups: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  } else {
    // Migrate old data without groups
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    if (!data.groups) {
      data.groups = [];
      saveData(data);
    }
  }
}

function loadData() {
  initDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ===== STATIONS API =====

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
      group: '',
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
  
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    stations = stations.filter(s => 
      s.name.toLowerCase().includes(search) || 
      s.category.toLowerCase().includes(search) ||
      s.country.toLowerCase().includes(search) ||
      (s.group || '').toLowerCase().includes(search)
    );
  }
  
  if (req.query.category) {
    stations = stations.filter(s => s.category === req.query.category);
  }
  
  if (req.query.country) {
    stations = stations.filter(s => s.country === req.query.country);
  }
  
  if (req.query.group) {
    stations = stations.filter(s => s.group === req.query.group);
  }
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  res.json({
    stations: stations.slice(start, end),
    total: stations.length,
    page,
    totalPages: Math.ceil(stations.length / limit),
    categories: data.categories,
    groups: data.groups
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
  // Remove from groups
  data.groups.forEach(g => {
    g.stations = g.stations.filter(sid => sid != req.params.id);
  });
  saveData(data);
  res.json({ success: true });
});

// Bulk delete
app.post('/api/stations/bulk-delete', (req, res) => {
  const data = loadData();
  const ids = req.body.ids || [];
  data.stations = data.stations.filter(s => !ids.includes(s.id));
  data.groups.forEach(g => {
    g.stations = g.stations.filter(sid => !ids.includes(sid));
  });
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

// ===== GROUPS API =====

// Get all groups
app.get('/api/groups', (req, res) => {
  const data = loadData();
  res.json(data.groups || []);
});

// Add new group
app.post('/api/groups', (req, res) => {
  const data = loadData();
  if (!data.groups) data.groups = [];
  const group = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  data.groups.push(group);
  saveData(data);
  res.json({ success: true, group });
});

// Update group
app.put('/api/groups/:id', (req, res) => {
  const data = loadData();
  const idx = data.groups.findIndex(g => g.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  
  const oldName = data.groups[idx].name;
  data.groups[idx] = { ...data.groups[idx], ...req.body };
  
  // Update station group references if name changed
  if (req.body.name && req.body.name !== oldName) {
    data.stations.forEach(s => {
      if (s.group === oldName) s.group = req.body.name;
    });
  }
  
  saveData(data);
  res.json({ success: true, group: data.groups[idx] });
});

// Delete group
app.delete('/api/groups/:id', (req, res) => {
  const data = loadData();
  const group = data.groups.find(g => g.id == req.params.id);
  if (group) {
    // Remove group reference from stations
    data.stations.forEach(s => {
      if (s.group === group.name) s.group = '';
    });
  }
  data.groups = data.groups.filter(g => g.id != req.params.id);
  saveData(data);
  res.json({ success: true });
});

// Assign stations to group
app.put('/api/groups/:id/stations', (req, res) => {
  const data = loadData();
  const idx = data.groups.findIndex(g => g.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  
  const groupName = data.groups[idx].name;
  const stationIds = req.body.stationIds || [];
  
  // Update stations' group field
  data.stations.forEach(s => {
    if (stationIds.includes(s.id)) {
      s.group = groupName;
    } else if (s.group === groupName && !stationIds.includes(s.id)) {
      s.group = '';
    }
  });
  
  data.groups[idx].stations = stationIds;
  saveData(data);
  res.json({ success: true });
});

// ===== CATEGORIES API =====

app.get('/api/categories', (req, res) => {
  const data = loadData();
  res.json(data.categories || []);
});

app.post('/api/categories', (req, res) => {
  const data = loadData();
  const cat = req.body.category;
  if (!data.categories.includes(cat)) {
    data.categories.push(cat);
    saveData(data);
  }
  res.json({ success: true, categories: data.categories });
});

app.get('/api/countries', (req, res) => {
  const data = loadData();
  const countries = [...new Set(data.stations.map(s => s.country).filter(Boolean))];
  res.json(countries);
});

// ===== PLAYLIST API =====

function generatePlaylist(filterFn) {
  const data = loadData();
  let stations = data.stations.filter(s => s.enabled !== false);
  if (filterFn) stations = stations.filter(filterFn);
  
  let m3u = '#EXTM3U\n';
  stations.forEach(station => {
    const groupTitle = station.group || station.category || 'General';
    m3u += `#EXTINF:-1 tvg-id="${station.id}" tvg-name="${station.name}" tvg-logo="${station.logo || ''}" group-title="${groupTitle}",${station.name}\n`;
    m3u += `${station.url}\n`;
  });
  return m3u;
}

app.get('/api/playlist.m3u', (req, res) => {
  let m3u = generatePlaylist(s => {
    if (req.query.category) return s.category === req.query.category;
    if (req.query.group) return s.group === req.query.group;
    return true;
  });
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.setHeader('Content-Disposition', 'attachment; filename="playlist.m3u"');
  res.send(m3u);
});

app.get('/api/playlist.m3u8', (req, res) => {
  let m3u = generatePlaylist(s => {
    if (req.query.category) return s.category === req.query.category;
    if (req.query.group) return s.group === req.query.group;
    return true;
  });
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.setHeader('Content-Disposition', 'attachment; filename="playlist.m3u8"');
  res.send(m3u);
});

// ===== EXPORT / IMPORT =====

app.get('/api/export', (req, res) => {
  const data = loadData();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="stations.json"');
  res.json({ stations: data.stations, groups: data.groups });
});

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

// ===== STATS =====

app.get('/api/stats', (req, res) => {
  const data = loadData();
  const enabled = data.stations.filter(s => s.enabled !== false).length;
  const disabled = data.stations.length - enabled;
  res.json({
    total: data.stations.length,
    enabled,
    disabled,
    categories: data.categories.length,
    groups: (data.groups || []).length
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TV Station Manager running on http://0.0.0.0:${PORT}`);
  console.log(`📺 Admin Dashboard: http://your-server-ip:${PORT}`);
  console.log(`📄 Playlist URL: http://your-server-ip:${PORT}/api/playlist.m3u8`);
});
