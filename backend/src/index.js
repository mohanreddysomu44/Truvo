const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', project: 'Truvo' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Truvo backend running on port ${PORT}`));