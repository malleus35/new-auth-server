import { NextFunction, Request, Response } from "express";

import Controller from "@src/controllers/Controller";
import JwtService from "@src/services/middlewares/JwtService";
import LogService from "@src/utils/LogService";
import resTypes from "@src/utils/resTypes";

import TokenDao from "@src/dao/TokenDao";
const logger = LogService.getInstance();
/*
로직
// 1.로그인을 하는 경우(유효한 토큰이 없는경우 === 첫로그인, refreshToken이 만료된 경우), accessToken, refreshToken을 발급해주면 됨.
2.accessToken이 만료되었다는 요청을 받을 경우, refreshToken을 사용해서 accessToken을 재발급하고 refreshToken도 같이 재발급 한다.
3.다른 API를 이용할 때, refreshToken이 만료가 안되어있으면, 재로그인 시킨다.
4.
*/

class JwtVerifyRefreshController extends Controller {
    private verify: string | object | undefined;

    private decode: any;

    private newAccessToken: any;

    private newRefreshToken: any;
    constructor() {
        super();
        this.verify = undefined;
        this.decode = null;
        this.newAccessToken = "";
        this.newRefreshToken = "";
    }
    async doService(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        // const refreshToken =
        // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDA5MjIzNDAsImV4cCI6MTYzMjQ3OTk0MH0.qqAMhL5eKlzHyz2KPQztrRAzMUK3LnNKPOqfeSrQ_cs"; // 1year from redis
        this.verify = await JwtService.verifyToken(req.headers.refresh);
        this.decode = await JwtService.decodeToken(
            req.headers.authorization?.split(" ")[1]
        );
        if (
            typeof this.verify !== "string" &&
            this.decode !== undefined &&
            typeof this.decode !== "string"
        ) {
            const refreshToken = await TokenDao.getInstance().find(
                this.decode.idx
            );
            if (refreshToken !== req.headers.refresh) {
                this.verify = "TokenError";
                return;
            } else {
                this.newRefreshToken = await JwtService.createRefreshToken();
                this.newAccessToken = await JwtService.createAccessToken(
                    this.decode.idx
                );
                await TokenDao.getInstance().save(
                    this.decode.idx,
                    this.newRefreshToken
                );
            }
        }
    }
    async doResolve(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        if (typeof this.verify === "string") resTypes.tokenErrorRes(res);
        else if (this.decode !== undefined && typeof this.decode !== "string") {
            resTypes.successRes(res, "Resign accessToken", {
                accessToken: this.newAccessToken,
                refreshToken: this.newRefreshToken
            });
        } else resTypes.tokenErrorRes(res);
    }
}

export default JwtVerifyRefreshController;
