require('dotenv').config();
const express = require('express');
const cors = require('cors');
const verifyToken = require('./middlewares/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ping', async (req, res) => {
  try {
    const supabase = require('./config/supabase');
    const { data, error } = await supabase.from('categories').select('id').limit(1);
    if (error) throw error;
    res.json({ status: 'ok', message: 'Supabase ping successful' });
  } catch (err) {
    console.error('Ping error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const publicRoutes = require('./routes/public');
const publicContactRoutes = require('./routes/public-contact');
const publicHeroImagesRoutes = require('./routes/public-hero-images');
const publicAssociatesRoutes = require('./routes/public-associates');
const privateAuthRoutes = require('./routes/private-auth');
const privateCategoriesRoutes = require('./routes/private-categories');
const privateProductsRoutes = require('./routes/private-products');
const privateProductVariantsRoutes = require('./routes/private-product-variants');
const privateCitiesRoutes = require('./routes/private-cities');
const privateFranchisesRoutes = require('./routes/private-franchises');
const privateFranchisePhotosRoutes = require('./routes/private-franchise-photos');
const privateSalesPointsRoutes = require('./routes/private-sales-points');
const privateAnnouncementsRoutes = require('./routes/private-announcements');
const privateHeroImagesRoutes = require('./routes/private-hero-images');
const privateAssociatesRoutes = require('./routes/private-associates');
const privateStorageRoutes = require('./routes/private-storage');

app.use('/public', publicRoutes);
app.use('/public', publicContactRoutes);
app.use('/public', publicHeroImagesRoutes);
app.use('/public', publicAssociatesRoutes);
app.use('/private/auth', privateAuthRoutes);
app.use('/private/categories', verifyToken, privateCategoriesRoutes);
app.use('/private/products', verifyToken, privateProductsRoutes);
app.use('/private/product-variants', verifyToken, privateProductVariantsRoutes);
app.use('/private/cities', verifyToken, privateCitiesRoutes);
app.use('/private/franchises', verifyToken, privateFranchisesRoutes);
app.use('/private/franchise-photos', verifyToken, privateFranchisePhotosRoutes);
app.use('/private/sales-points', verifyToken, privateSalesPointsRoutes);
app.use('/private/announcements', verifyToken, privateAnnouncementsRoutes);
app.use('/private/hero-images', verifyToken, privateHeroImagesRoutes);
app.use('/private/associates', verifyToken, privateAssociatesRoutes);
app.use('/private/storage', verifyToken, privateStorageRoutes);

app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const server = isServerless ? null : app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = (signal) => {
  console.log(`\n${signal} received. Closing server...`);
  if (!server) {
    process.exit(0);
  }
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app;
