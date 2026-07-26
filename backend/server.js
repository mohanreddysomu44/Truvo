import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = (await import("mongoose")).default;
const express = (await import("express")).default;

const app = express();
const uri =
  "mongodb+srv://MohanReddy:Mohan2005@cluster-1.gctlkf4.mongodb.net/truvo?retryWrites=true&w=majority&appName=Cluster-1";

try {
  console.log("Connecting...");
  await mongoose.connect(uri);
  console.log("✅ Connected");
} catch (err) {
  console.error(err);
}

app.listen(4000, () => console.log("Server running"));
