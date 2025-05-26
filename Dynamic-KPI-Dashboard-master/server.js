require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const connectDB = require("./backend/config.js/db");
const userRoutes = require("./backend/routes/userRoutes");
const employeeRoutes = require("./backend/routes/employeeRoutes");
const messageRoutes = require("./backend/routes/messageRoutes");
const customerRoutes = require("./backend/routes/customerRoutes");

// Initialize app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Database Connection
connectDB();

app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.set('trust proxy', 1);

// Session Configuration
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }

  })
);

// Passport Configuration
const passportInit = require("./backend/controller/User/passportConfig");
passportInit(passport);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session({
  secret: 'secretcode',
  proxy: true,
  resave: true,
  saveUninitialized: true
}));


// Routes
app.use("/api/auth", userRoutes);
app.use("/api/tasks", employeeRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/customers", customerRoutes);


if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get("*", (req, res)=>{
   res.sendFile(path.join(__dirname, 'frontend',"build","index.html"));
  })
}else{
  app.get("/", (req,res)=>{
    res.send("Hey There , Greetings From The Server. Have a Good Day :)")
  })
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("serve at http://localhost:5000"));
