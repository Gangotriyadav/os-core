require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = require("./model/model"); 

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);

const database = mongoose.connection;
database.on('error', (error) => console.log(error));
database.once('connected', () => console.log('Database Connected'));

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', routes);

app.get("/", function (req, res) {
   let token = jwt.sign({ password: "123" }, process.env.JWT_SECRET);
   res.json({ token });
});

app.post("/login", async function (req, res) {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
   }

   const user = await User.findOne({ email });
   if (!user) return res.status(400).json({ error: "User not found" });

   const match = await bcrypt.compare(password, user.password);
   if (!match) return res.status(400).json({ error: "Invalid password" });

   let token = jwt.sign({ email }, process.env.JWT_SECRET);
   res.json({ token });
});

const PORT = 5005;
app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
