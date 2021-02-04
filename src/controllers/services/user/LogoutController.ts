import { NextFunction, Request, Response } from "express";

import Controller from "@src/controllers/Controller";

import UserService from "@src/services/UserService";

import resTypes from "@src/utils/resTypes";
import TokenDao from "@src/dao/TokenDao";
import User from "@src/models/UserModel";
import StrictRequest from "@src/vo/auth/services/request";

interface result {
    findInfo: User | string;
    removeResult: number;
}
class LogoutController extends Controller {
    private result: result;
    private accessToken: string;
    private refreshToken: string;
    constructor() {
        super();
        this.result = { findInfo: "", removeResult: -987654321 };
        this.accessToken = "";
        this.refreshToken = "";
    }

    async doService(
        req: StrictRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            this.result.findInfo = await UserService.findMyInfo(req);
            this.result.removeResult = await TokenDao.getInstance().remove(
                req.decoded.idx
            );
        } catch (e: unknown) {
            this.result.findInfo = "InternalServerError";
            console.log(e);
        }
    }

    async doResolve(
        req: StrictRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        switch (this.result.findInfo) {
            case "BadRequest":
                resTypes.badRequestErrorRes(res);
                break;
            case "InternalServerError":
                resTypes.internalErrorRes(res);
                break;
            case "CannotFindItem":
                resTypes.cannotFindItemRes(res, "user");
                break;
            default:
                if (
                    this.result.removeResult === 0 ||
                    this.result.removeResult === -987654321
                ) {
                    resTypes.dbErrorRes(res);
                } else
                    resTypes.successRes(res, "Logout", {
                        accessToken: this.accessToken,
                        refreshToken: this.refreshToken
                    });
        }
    }
}
export default LogoutController;
