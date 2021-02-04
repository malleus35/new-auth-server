import { Request } from "express";
import { ReqData } from "@src/vo/auth/services/reqData";
import argon2 from "argon2";
const serviceReturn = {
    get: async <T>(
        reqData: ReqData,
        daoFunc: Function
    ): Promise<T | string> => {
        try {
            const result = await daoFunc(reqData);
            switch (result) {
                case "BadRequest":
                    return "BadRequest";
                case undefined:
                    return "InternalServerError";
                case null:
                    return "CannotFindItem";
                default:
                    return result;
            }
        } catch (e) {
            console.log(e);
            return "UnexpectedError";
        }
    },
    signin: async <T>(reqData: ReqData, daoFunc: Function): Promise<string> => {
        try {
            const result = await daoFunc(reqData);
            switch (result) {
                case "BadRequest":
                    return "BadRequest";
                case undefined:
                    return "InternalServerError";
                case null:
                    return "CannotFindItem";
                default:
                    if (
                        (await argon2.verify(result.pwd, reqData.data?.pwd)) ===
                        false
                    )
                        return "WrongPassword";
                    else return result;
            }
        } catch (e) {
            console.log(e);
            return "UnexpectedError";
        }
    },
    postOrUpdate: async <T>(
        reqData: ReqData,
        daoFunc: Function
    ): Promise<string> => {
        try {
            const result = await daoFunc(reqData);
            switch (result) {
                case "BadRequest":
                    return "BadRequest";
                case undefined:
                    return "InternalServerError";
                case null:
                    return "UnexpectedError";
                case "AlreadyExistItem":
                    return `AlreadyExistItem`;
                default:
                    return "Success";
            }
        } catch (e) {
            console.log(e);
            return "UnexpectedError";
        }
    },
    delete: async <T>(reqData: ReqData, daoFunc: Function): Promise<string> => {
        try {
            const result = await daoFunc(reqData);
            switch (result) {
                case "BadRequest":
                    return "BadRequest";
                case undefined:
                    return "InternalServerError";
                case null:
                    return "UnexpectedError";
                case 0:
                    return "NoItemDeleted";
                default:
                    return "Success";
            }
        } catch (e) {
            console.log(e);
            return "UnexpectedError";
        }
    }
};
const serviceFactory = {
    get: <T>(daoFunc: Function) => {
        const func = async (req: Request): Promise<T | string> => {
            const reqData: ReqData = {
                data: req.body,
                decoded: req.decoded,
                params: req.params
            };
            //if -> return "BadRequest"
            const result: T | string = await serviceReturn.get<T>(
                reqData,
                daoFunc
            );
            return result;
        };
        return func;
    },
    signin: <T>(daoFunc: Function) => {
        const func = async (req: Request): Promise<T | string> => {
            const reqData: ReqData = {
                data: req.body,
                decoded: req.decoded,
                params: req.params
            };
            //if -> return "BadRequest"
            const result: string = await serviceReturn.signin<T>(
                reqData,
                daoFunc
            );
            return result;
        };
        return func;
    },

    postOrUpdate: <T>(daoFunc: Function) => {
        const func = async (req: Request): Promise<string> => {
            const reqData: ReqData = {
                data: req.body,
                decoded: req.decoded,
                params: req.params
            };
            //if -> return "BadRequest"
            const result: string = await serviceReturn.postOrUpdate<T>(
                reqData,
                daoFunc
            );
            return result;
        };
        return func;
    },
    delete: <T>(daoFunc: Function) => {
        const func = async (req: Request): Promise<string> => {
            const reqData: ReqData = {
                data: req.body,
                decoded: req.decoded,
                params: req.params
            };
            //if -> return "BadRequest"
            const result: string = await serviceReturn.delete<T>(
                reqData,
                daoFunc
            );
            return result;
        };
        return func;
    }
};

export default serviceFactory;
