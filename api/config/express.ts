const dotenv = require("dotenv").config();
import express = require("express");
const auth = require("../controllers/gateway.controllers").default;
import bodyParser = require("body-parser");
//import expressValidator = require("express-validator");
const db = require("./db");
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require(path.resolve('../docs/swagger/swagger.json'));

export = () => {
    let app = express();

    app.use(bodyParser.json());
    /*app.use(expressValidator({
        customValidators: {
            isArray: function (value) {
                return Array.isArray(value);
            }
        }
    }));*/

    app.use('/apidocs', express.static('../docs/apidoc'));
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


    // so we can get the client's IP address
    app.enable("trust proxy");

    app.use(auth.initialize());

    app.all(process.env.API_BASE + "*", (req, res, next) => {

        return auth.authenticate((err, user) => {
            if (err) { return next(err); }
            if (!user) {
                return res.status(401).json({ status:'error', errorMessage: 'Invalid headers username' });
            }
            app.set("user", user);
            return next();
        })(req, res, next);
    });

    const routes = require("../routes")(app);

    return app;
};
