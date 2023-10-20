const express = require("express");
const app = express();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config/config.env" });

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const users = [
  {
    username: "tom",
    password: "123",
  },
];

app.get("/", (req, res) => {
  const token = req.cookies.token; // Retrieve the token from cookies
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
      if (result) {
        res.redirect('/profile');
      } else {
        res.sendFile(__dirname + "/index.html");
      }
    });
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.post("/", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (item) => item.username === username && item.password === password
  );

  if (!user) {
    res.redirect("/");
  } else {
    const data = {
      username,
      time: Date(),
    };
    const token = jwt.sign(data, process.env.JWT_SECRET_KEY, { // Use the same secret key here
      expiresIn: "10min", // Adjust the expiration as needed
    });
    res.cookie("token", token).redirect("/profile");
  }
});

app.get("/profile", (req, res) => {
  const token = req.cookies.token; // Retrieve the token from cookies
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
      if (result) {
        res.sendFile(__dirname + "/profile.html"); // Allow access to the profile page
      } else {
        res.redirect('/');
      }
    });
  } else {
    res.redirect('/');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
