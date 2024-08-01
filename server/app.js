const path = require("path");
const express = require("express");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const session = require("express-session");
const notFoundHandler = require("./middlewares/errors");

const app = express();
app.use(morgan(process.env.ENV));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 600000 * 24, //set to 24 hours
      httpOnly: true,
    },
  })
);

// Middleware
const { isAuth, isAdmin } = require("./middlewares/isAuth"); 

// Clients Routes
const indexRouter = require("./routes/clients/index/index.router");
const destinationRouter = require("./routes/clients/destination/destination.router");
const packageRouter = require("./routes/clients/packages/packages.router");
const blogRouter = require("./routes/clients/blog/blog.router");
const transRouter = require("./routes/clients/trans/trans.router");
const acomodationRouter = require("./routes/clients/acomodation/acomodation.router");
const restaurantRouter = require("./routes/clients/restaurant/restaurant.router");

app.use("/", indexRouter);
app.use("/destination", destinationRouter);
app.use("/package", packageRouter);
app.use("/blog", blogRouter);
app.use("/transportation", transRouter);
app.use("/acomodation", acomodationRouter);
app.use("/restaurant", restaurantRouter);

// Admin Routes
const adminIndexRouter = require("./routes/admin/index/index.router");
const adminDestinationRouter = require("./routes/admin/destination/destination.router");
const adminPackageRouter = require("./routes/admin/packages/package.router");
const adminBlogRouter = require("./routes/admin/blog/blog.router");
const adminTripTypeRouter = require("./routes/admin/trip_type/trip_type.router");
const adminUserRouter = require("./routes/admin/user/user.router");
const adminRestaurantRouter = require("./routes/admin/restaurant/restaurant.router");
const adminTransportationRouter = require("./routes/admin/transportation/transportation.router");
const adminAcomodationRouter = require("./routes/admin/acomodation/acomodation.router");
const adminBlogCategoryRouter = require("./routes/admin/blog-category/blog-category.router");

app.use("/admin", isAuth, isAdmin, adminIndexRouter);
app.use("/admin/destination", isAuth, isAdmin, adminDestinationRouter);
app.use("/admin/trip_type", isAuth, isAdmin, adminTripTypeRouter);
app.use("/admin/package", isAuth, isAdmin, adminPackageRouter);
app.use("/admin/blog", isAuth, isAdmin, adminBlogRouter);
app.use("/admin/user", isAuth, isAdmin, adminUserRouter);
app.use("/admin/restaurant", isAuth, isAdmin, adminRestaurantRouter);
app.use("/admin/transportation", isAuth, isAdmin, adminTransportationRouter);
app.use("/admin/acomodation", isAuth, isAdmin, adminAcomodationRouter);

app.use("/api/blog-category", isAuth, isAdmin, adminBlogCategoryRouter);

// Routes Not Found
app.use(notFoundHandler);

module.exports = app;
