const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");

require("dotenv").config();

const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// 1) GLOBAL middlewares

// Set Security HTTP headers
app.use(helmet());

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 30 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an 30 minutes!",
});

app.use("/api", limiter);

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// 2) API routes
app.use("/api/v1/picknPay", require("./routes/api/picknPay"));
app.use("/api/v1/shoprite", require("./routes/api/shoprite"));
app.use("/api/v1/checkers", require("./routes/api/checkers"));
app.use("/api/v1/woolworths", require("./routes/api/woolworths"));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});
