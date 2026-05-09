import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure uploads directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Configure Multer for local storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
    }
  });

  const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  app.use(express.json());

  // Serve static uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

  // JSON Database setup
  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);
  
  const BANNERS_FILE = path.join(dbDir, 'banners.json');
  const PRODUCTS_FILE = path.join(dbDir, 'products.json');

  const readData = (file: string) => {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  };

  const writeData = (file: string, data: any) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  };

  // Banners API
  app.get('/api/banners', (req, res) => res.json(readData(BANNERS_FILE)));
  app.post('/api/banners', (req, res) => {
    const banners = readData(BANNERS_FILE);
    const newBanner = { ...req.body, id: Date.now().toString() };
    banners.push(newBanner);
    writeData(BANNERS_FILE, banners);
    res.json(newBanner);
  });
  app.put('/api/banners/:id', (req, res) => {
    let banners = readData(BANNERS_FILE);
    banners = banners.map((b: any) => b.id === req.params.id ? { ...req.body, id: b.id } : b);
    writeData(BANNERS_FILE, banners);
    res.json({ success: true });
  });
  app.delete('/api/banners/:id', (req, res) => {
    let banners = readData(BANNERS_FILE);
    banners = banners.filter((b: any) => b.id !== req.params.id);
    writeData(BANNERS_FILE, banners);
    res.json({ success: true });
  });

  // Products API
  app.get('/api/products', (req, res) => res.json(readData(PRODUCTS_FILE)));
  app.post('/api/products', (req, res) => {
    const products = readData(PRODUCTS_FILE);
    const newProduct = { ...req.body, id: Date.now().toString() };
    products.push(newProduct);
    writeData(PRODUCTS_FILE, products);
    res.json(newProduct);
  });
  app.put('/api/products/:id', (req, res) => {
    let products = readData(PRODUCTS_FILE);
    products = products.map((p: any) => p.id === req.params.id ? { ...req.body, id: p.id } : p);
    writeData(PRODUCTS_FILE, products);
    res.json({ success: true });
  });
  app.delete('/api/products/:id', (req, res) => {
    let products = readData(PRODUCTS_FILE);
    products = products.filter((p: any) => p.id !== req.params.id);
    writeData(PRODUCTS_FILE, products);
    res.json({ success: true });
  });

  // API Routes for Uplods
  app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
