import express, { NextFunction } from "express";

import routes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get( "/health", ( req, res ) => {
    res.send( {
        gitCommit: process.env.GIT_COMMIT,
        status: "ok",
    } );
} );

app.use(routes.CreateTokenRouter);
app.use(routes.VCRDisplayRouter);

app.listen( port, () => {
    // eslint-disable-line no-console
    console.log(`server started at http://localhost:${ port }`);
} );
