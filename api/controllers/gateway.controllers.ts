import * as passport from "passport";
import * as _ from "lodash";
import { model as User, IUser } from "../models/user.model";
const CustomStrategy = require('passport-custom').Strategy;
import { logger } from "../config/logger";

class Auth {

    public initialize = () => {
      passport.use('custom', this.getStrategy());
      return passport.initialize();
    }

    public authenticate = (callback) => passport.authenticate('custom', { session: false, failWithError: true }, callback);

    private getStrategy = () => {
      return new CustomStrategy(
        function(req, done) {
          var username = req.headers.username;
          if (!_.isString(username)) {
            done(null,null)
          }
          else{
            User.schema.methods.findUser(req.headers.username).then(function(user){
              let err;
              done(err, user);
            });
          }


        }
      );
    }
}

export default new Auth();
