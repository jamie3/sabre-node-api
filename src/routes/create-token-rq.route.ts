import express, { NextFunction, Request, Response } from "express";

import { createToken } from "../lib/sabre"

const router = express.Router();

const createTokenRoute = (req: Request, res: Response, next: NextFunction) => {

    createToken((token, error) => {
        if (error) {
            next(error)
        } else if (token) {
            if (token?.error) {
                if (token.error.name.match(/InvalidSecurityToken/)) {
                    res.status(403).json(token.error)
                } else {
                    res.status(500).json(token.error)
                }
                res.status(500).json(token)
            } else {
                res.status(201).json(token);
            }
        } else {
            next()
        }
    });
};

router.post("/token", createTokenRoute);

export default router;
