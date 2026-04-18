const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');

app.use(express.json());

let rooms = {};
let wallets = {};

app.get('/', (req, res) => {
  res.send('TUI GAME API RUNNING');
});
