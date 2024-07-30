require("dotenv").config();

const express = require('express');
const fs = require('fs');
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));

// Load JSON data from resources folder
const register = JSON.parse(fs.readFileSync('./resources/Register.json', 'utf-8'));
const opcode = JSON.parse(fs.readFileSync('./resources/Opcode.json', 'utf-8'));

app.get("/", async (req, res) => {
  res.json({ data: "hello" });
});

// API to get data by keyword
app.get('/get-data/:keyword', async (req, res) => {
    const keyword = req.params.keyword.toLowerCase();
    const filteredData = register.filter(item => {
        return (
          item.name1.toLowerCase().includes(keyword) ||
          item.name2.toLowerCase().includes(keyword) ||
          item.register.toLowerCase().includes(keyword)
        );
    });

    res.json(filteredData);
});

const port = 8000;

app.listen(port);
console.log(`Running on http://localhost:${port}`);

module.exports = app;