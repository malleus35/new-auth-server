import { NextFunction, Request, Response } from "express";

import Controller from "@src/controllers/Controller";

import resTypes from "@src/utils/resTypes";
import JwtService from "@src/services/middlewares/JwtService";
import StrictRequest from "@src/vo/auth/services/request";

class TokenSigninController extends Controller {
    private decodedPayload: number | undefined;
    private accessToken: string | object | null;
    constructor() {
        super();
        this.decodedPayload = -1;
        this.accessToken = "";
    }

    async doService(
        req: StrictRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            this.decodedPayload = req.decoded.idx;
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
        resTypes.successRes(res, "Login");
    }
}

export default TokenSigninController;
