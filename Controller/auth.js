import passport from "passport";
import User from "../Model/user.js"; // Assuming this is your user model
import dotenv from "dotenv"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config() 

const CLIENT_ID =process.env.CLIENT_ID
  
const CLIENT_SECRET =process.env.CLIENT_SECRET

passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        let user = await User.findOne({ email });

        if (!user) {
          const CreateUser = await User.create({ email, name });
          if (CreateUser) {
            console.log("User created", CreateUser);
          }
        } else {
          console.log("User already exists");
        }

        return cb(null, user);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
