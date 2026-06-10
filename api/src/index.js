require('dotenv').config();
const express = require('express');
const setupSwagger = require('./presentation/swagger');
const eventsRouter = require('./presentation/events.routes');

const app = express();
app.use(express.json());

setupSwagger(app);
app.use('/events', eventsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
const purchasesRouter = require('./presentation/purchases.routes');

// Nested under events/:id/categories/:categoryId
app.use('/events/:id/categories/:categoryId', purchasesRouter);

// Wallet tickets lookup
app.use('/wallets/:address', purchasesRouter);

module.exports = app; // for tests