const { exec } = require('child_process');
const express = require("express");
const cors = require("cors");
const os = require('os');
const app = express();

const PORT = 3000;

// Function to execute a command within WSL and return total output
const runCommand = (command, callback) => {
  const isWindows = os.platform() === 'win32';
  const commandPrefix = isWindows ? 'wsl' : ''; 
  console.log("This info is in development only: \nRunning in:\n"+os.platform()+"\nVersion: "+os.release+"\nArchitecture: "+os.arch()+"\nType: "+os.type())
  exec(`${commandPrefix} ${command}`, (error, stdout, stderr) => {
    if (error) {
      callback(`Error executing command: ${error.message}\n${stderr}`, null);
      return;
    }

    callback(null, stdout + stderr);
  });
};

app.use(express.json());
app.use(cors());

app.post("/execute", (req, res) => {
  const { command } = req.body;

  if (!command) return res.status(400).json({ error: "No command provided" });

  runCommand(command, (error, output) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
    console.log("Output: ", output);
    res.json({ output });
  });
});

app.listen(PORT, () => {
  console.log("App is running on PORT: " + PORT);
});
