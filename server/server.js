const express = require("express");
const app = express();
const port = 5000;
const routers = require('./src/routers');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/api/v1', routers);
app.use('/uploads', express.static('uploads'));

app.listen(port, () => console.log(`running on port ${port}`));