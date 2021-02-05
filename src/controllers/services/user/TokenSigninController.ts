import { NextFunction, Request, Response } from "express";

import Controller from "@src/controllers/Controller";

import resTypes from "@src/utils/resTypes";
import JwtService from "@src/services/middlewares/JwtService";
import StrictRequest from "@src/vo/auth/services/request";
import User from "@src/models/UserModel";
import UserService from "@src/services/UserService";

class TokenSigninController extends Controller {
    private user: User | string;
    private decodedPayload: number | undefined;
    private accessToken: string | object | null;
    constructor() {
        super();
        this.user = "";
        this.decodedPayload = -1;
        this.accessToken = "";
    }

    async doService(
        req: StrictRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            this.user = await UserService.findOne(req);
            this.decodedPayload = req.decoded.user_idx;
            this.accessToken = await JwtService.createAccessToken(
                this.decodedPayload
            );
        } catch (e: unknown) {
            console.log(e);
        }
    }

    async doResolve(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        resTypes.successRes(res, "Login", this.user);
    }
}

export default TokenSigninController;
