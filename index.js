import Express from "express";
import passport from "./Controller/auth.js";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send("you must login first");
  }
};

const app = Express();
app.use(
  session({
    secret: "keyboard cat",
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (Req, Res) => {
  Res.send('<a href="/auth/google">google authanticate </a>');
});
app.get("/protected", isLoggedIn, (Req, Res) => {
  Res.send("hello");
});
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "/protected",
  })
);
app.get("/failure", (Req, Res) => {
  Res.send("failed to login");
});

app.listen(3001, () => {
  console.log("Listening on port 3001");
});
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected!"))
  .catch((error) => {
    console.log("connecting to database has failed", error);
  });
