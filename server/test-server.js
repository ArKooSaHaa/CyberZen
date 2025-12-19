import express from "express";
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, message: "Server is running!" });
});

app.post("/api/User", (req, res) => {
  console.log("Received signup request:", req.body);
  
  // Return the user data directly (without password) as the client expects
  const { password, confirmPassword, ...userData } = req.body;
  
  res.status(201).json({
    ...userData,
    _id: "test-user-id-" + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

app.post("/api/User/login", (req, res) => {
  console.log("Received login request:", req.body);
  
  const { username, password } = req.body;
  
  // Simple validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  
  // For testing, accept any login with valid credentials
  // In production, this would check against the database
  const token = "test-jwt-token-" + Date.now();
  
  res.json({
    token,
    user: {
      _id: "test-user-id",
      firstName: "Test",
      lastName: "User",
      username: username,
      email: username.includes("@") ? username : username + "@example.com",
      nid: "123456",
      phone: "1234567890",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
