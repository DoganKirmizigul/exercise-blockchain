require('dotenv').config();
const express = require('express');
const cors = require('cors');
const setupSwagger = require('./presentation/swagger');
const eventsRouter = require('./presentation/events.routes');
const purchasesRouter = require('./presentation/purchases.routes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

setupSwagger(app);
app.use('/events', eventsRouter);

// Nested under events/:id/categories/:categoryId
app.use('/events/:id/categories/:categoryId', purchasesRouter);

// Wallet tickets lookup
app.use('/wallets/:address', purchasesRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

module.exports = app;