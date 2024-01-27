const express = require("express");
const app = express();
const morgan = require("morgan")
const toursRoute = require("./routes/tourRoutes")
const userRoute = require("./routes/userRoutes");
app.use(express.json());


if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}



app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    console.log("First Middleware", req.requestedAt)
    next();
})

app.use("/api/v1/tours", toursRoute);
// app.use("/api/v1/users", userRoute)

module.exports = app;