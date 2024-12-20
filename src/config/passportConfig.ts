import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import passport from 'passport';


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile: any, done: any) => {
      try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
        const displayName = profile.displayName || '';
        const picture = profile._json.picture || null;

        const user: any = {
          id: profile.id,
          emails: [{ value: email }],
          displayName: displayName,
          picture: picture,
        };
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);


passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'picture'],
    },
    async (accessToken, refreshToken, profile: any, done: any) => {
      try {
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
        const name = profile.name ? `${profile.name.givenName} ${profile.name.familyName}` : '';
        const picture = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

        const user: any = {
          id: profile.id,
          email: email,
          name: name,
          picture: picture,
        };
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
