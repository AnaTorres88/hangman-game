const express = require("express");
const { exec } = require("child_process");
const path = require('path');
const app = express();
const PORT = 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/deploy", (req, res) => {
  console.log("Deploy triggered......");

  exec("git pull origin main && npm install", (err, stdout, stderr) => {
    if (err) {
      console.error(`Error during deploy: ${err}`);
      return res.status(500).send(`Deploy failed: ${err.message}`);
    }

    console.log(stdout);
    console.error(stderr);

    res.send("Code updated! Restarting server...");


  });
});

app.listen(PORT, () => console.log(`App server running on port ${PORT}`));