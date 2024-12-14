import express from 'express';
import passport from 'passport';
import {
  c_loginUserUsingGoogle,
} from '../../controllers/Auth Controller/authUsingFacebookGoogleController';

const authGoogleFacebookRoute = express.Router();

/**
 *  @description   Route for Google OAuth login
 *  @route          /auth/google
 *  @method        GET
 *  @access        Public
 */
authGoogleFacebookRoute.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 *  @description   Google OAuth callback route
 *  @route          /auth/google/callback
 *  @method        GET
 *  @access        Public
 */
authGoogleFacebookRoute.get('/auth/google/callback',passport.authenticate('google', { session: false }),c_loginUserUsingGoogle);

/**
 *  @description   Route for Facebook OAuth login
 *  @route          /auth/facebook
 *  @method        GET
 *  @access        Public
 */
authGoogleFacebookRoute.get('/auth/facebook',passport.authenticate('facebook', { scope: ['email'] }));

export default authGoogleFacebookRoute;
