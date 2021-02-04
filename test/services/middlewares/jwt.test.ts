import jwt from "jsonwebtoken";

import env from "@src/utils/env";
import LogService from "@src/utils/LogService";
const logger = LogService.getInstance();

env.chooseEnv();
describe("json webtoken test", () => {
    it("Test basic json webtoken sign", () => {
        const mJwtSign = jest.spyOn(jwt, "sign");
        const payload = { foo: "bar" };
        const secretKey = process.env.JWT_SECRET_KEY;
        const options = {
            expiresIn: "1h"
        };
        let createToken = jwt.sign(payload, secretKey, options);
        logger.info(createToken);
        expect(mJwtSign).toBeCalledTimes(1);
        expect(mJwtSign).toBeCalledWith(payload, secretKey, options);
    });

    it("Test jwt verify method", () => {
        const mJwtVerify = jest.spyOn(jwt, "verify");
        const payload = { foo: "bar" };
        const secretKey = process.env.JWT_SECRET_KEY;
        const options = {
            expiresIn: "1h"
        };
        let createToken = jwt.sign(payload, secretKey, options);
        const decoded = jwt.verify(createToken, secretKey);
        logger.info(decoded);
        expect(decoded.foo).toEqual("bar");
        expect(mJwtVerify).toBeCalledTimes(1);
        expect(mJwtVerify).toBeCalledWith(createToken, secretKey);
    });

    it("Test jwt decode method", () => {
        const payload = { foo: "bar" };
        const secretKey = process.env.JWT_SECRET_KEY;
        const options = {
            expiresIn: "1h"
        };
        let createToken = jwt.sign(payload, secretKey, options);
        const mJwtDecode = jest.spyOn(jwt, "decode");
        let decoded = jwt.decode(createToken);
        expect(mJwtDecode).toBeCalledTimes(1);
        expect(mJwtDecode).toBeCalledWith(createToken);
        expect(decoded.foo).toEqual("bar");
    });
});
