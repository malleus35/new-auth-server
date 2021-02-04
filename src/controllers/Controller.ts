import { NextFunction, Request, Response } from "express";

abstract class Controller {
    protected controlFunction: any;
    protected abstract doService(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    protected abstract doResolve(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    constructor() {
        this.controlFunction = async (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            await this.doService(req, res, next);
            await this.doResolve(req, res, next);
        };
    }
    excute() {
        return this.controlFunction;
    }
}

export default Controller;
