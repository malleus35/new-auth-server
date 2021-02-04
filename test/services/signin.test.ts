import request from "supertest";
import argon2 from "argon2";
import app from "@src/app";
import LogService from "@src/utils/LogService";

import AuthDBManager from "@src/models/AuthDBManager";
import UserModel from "@src/models/UserModel";

import redis from "redis";
import { promisify } from "util";
// import RedisSerivce from "@src/services/middlewares/RedisService";

const logger = LogService.getInstance();
describe("make server and test login request", () => {
    it("200 OK POST /signin", async (done) => {
        const db = AuthDBManager.getInstance();
        UserModel.initiate(db.getConnection());
        const testdata = {
            name: "junghun yang",
            pwd: "1234",
            email: "maestroprog@seoultech.ac.kr",
            grade: 4,
            school: "seoultech",
            stdNum: "15109342"
        };
        testdata.pwd = await argon2.hash("1234");
        const newUser = await UserModel.create(testdata);
        db.getConnection().close();
        let refreshToken = "";
        request(app)
            .post("/api/auth/signin")
            .send({ email: "maestroprog@seoultech.ac.kr", pwd: "1234" })
            .expect(200)
            .end((err, res) => {
                expect(res.body.msg).toEqual("Login Success!");
                logger.info(res.body.data.accessToken);
                logger.info(res.body.data.refreshToken);
                refreshToken = res.body.data.refreshToken;
                done();
            });
    });

    it("200 OK and sign accessToken and refreshToken POST /verify ", (done) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        request(app)
            .post("/api/auth/signin/verify/")
            .set("Accept", "application/json")
            .set(
                "Authorization",
                "bearer " +
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hZXN0cm9wcm9nQHNlb3VsdGVjaC5hYy5rciIsImlhdCI6MTYwMDkxODkyNywiZXhwIjoxNjEzODc4OTI3fQ.1SViyS4d_1e9fu23I3878zGS-CLfHM32zEYLacLsGho"
            )
            .expect(200)
            .end((err, res) => {
                console.log(res.body);
                expect(res.body.msg).toEqual("Login Success!");
                logger.info("200 OK BASE");
                done();
            });
    });

    // it("200 OK with verify accessToken jwtToken POST /signin", (done) => {
    //     request(app)
    //         .post("/api/auth/signin/")
    //         .set("Accept", "application/json")
    //         .send({
    //             email: "maestroprog@seoultech.ac.kr",
    //             pwd: "1234",
    //             //token expired In 150D
    //             accessToken:
    //                 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoianVuZ2h1biBZYW5nIiwiaWF0IjoxNjAwMDc2Nzk3LCJleHAiOjE2MTMwMzY3OTd9.PjhxKdQNomsMLlH4mxmhTz-8D0DdyFIYj66T_U4U9m8"
    //         })
    //         .expect(200)
    //         .end((err, res) => {
    //             if (err) {
    //                 logger.error(err);
    //                 done();
    //             }
    //             expect(res.body.msg).toEqual("Signin Success!");
    //             expect(res.body.accessToken).toBeUndefined();
    //             expect(res.body.refreshToken).toBeUndefined();
    //             logger.info("200 OK with accessToken");
    //             done();
    //         });
    // });

    // it("401 Unauthorized with invalid accessToken jwtToken POST /signin", (done) => {
    //     request(app)
    //         .post("/api/auth/signin/")
    //         .set("Accept", "application/json")
    //         .send({
    //             email: "maestroprog@seoultech.ac.kr",
    //             pwd: "1234",
    //             //token expiredIn 150D
    //             accessToken:
    //                 "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoianVuZ2h1biBZYW5nIiwiaWF0IjoxNjAwMDc2Nzk3LCJleHAiOjE2MTMwMzY3OTd9.PjhxKdQNomsMLlH4mxmhTz-8D0DdyFIYj66T_U4U9m8"
    //         })
    //         .expect(401)
    //         .end((err, res) => {
    //             if (err) {
    //                 logger.error(err);
    //                 done();
    //             }
    //             expect(res.body.msg).toEqual("Access Token is Invalid");
    //             expect(res.body.accessToken).toBeUndefined();
    //             expect(res.body.refreshToken).toBeUndefined();
    //             done();
    //         });
    // });

    // it("401 Unauthorized with Expired accessToken jwtToken POST /signin", (done) => {
    //     request(app)
    //         .post("/api/auth/signin/")
    //         .set("Accept", "application/json")
    //         .send({
    //             email: "maestroprog@seultech.ac.kr",
    //             pwd: "1234",
    //             //token expired In 10s
    //             accessToken:
    //                 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoianVuZ2h1biBZYW5nIiwiaWF0IjoxNjAwMDc2ODY5LCJleHAiOjE2MDAwNzY4Nzl9.FIl96VRlXWfNam7EJVMjOffdXogF-7LzFGabeWfhxw4"
    //         })
    //         .expect(401)
    //         .end((err, res) => {
    //             if (err) {
    //                 logger.error(err);
    //                 done();
    //             }
    //             expect(res.body.msg).toEqual("Access Token is expired");
    //             expect(res.body.accessToken).toBeUndefined();
    //             expect(res.body.refreshToken).toBeUndefined();
    //             done();
    //         });
    // });

    // it("200 OK with verify refreshToken jwtToken POST /signin", (done) => {
    //     request(app)
    //         .post("/api/auth/signin/")
    //         .set("Accept", "application/json")
    //         .send({
    //             email: "maestroprog@seoultech.ac.kr",
    //             pwd: "1234",
    //             //token expired In 150D
    //             accessToken:
    //                 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoianVuZ2h1biBZYW5nIiwiaWF0IjoxNjAwMDc2Nzk3LCJleHAiOjE2MTMwMzY3OTd9.PjhxKdQNomsMLlH4mxmhTz-8D0DdyFIYj66T_U4U9m8",
    //             refreshToken:
    //                 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoianVuZ2h1biBZYW5nIiwiaWF0IjoxNjAwMDc2Nzk3LCJleHAiOjE2MTMwMzY3OTd9.PjhxKdQNomsMLlH4mxmhTz-8D0DdyFIYj66T_U4U9m8"
    //         })
    //         .expect(200)
    //         .end((err, res) => {
    //             if (err) {
    //                 logger.error(err);
    //                 done();
    //             }
    //             expect(res.body.msg).toEqual("Signin Success!");
    //             expect(res.body.accessToken).not.toBeUndefined();
    //             expect(res.body.refreshToken).toBeUndefined();
    //             logger.info("200 OK with refreshToken");
    //             done();
    //         });
    // });

    // it("401 Unauthorized with invalid refreshToken jwtToken POST /signin", (done) => {
    //     request(app)
    //         .post("/api/auth/signin/")
    //         .set("Accept", "application/json")
    //         .send({
    //             email: "maestroprog@seoultech.ac.kr",
    //             pwd: "1234",
    //             //token expiredIn 150D
    //             accessToken:
    //                 "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoianVuZ2h1biBZYW5nIiwiaWF0IjoxNjAwMDc2Nzk3LCJleHAiOjE2MTMwMzY3OTd9.PjhxKdQNomsMLlH4mxmhTz-8D0DdyFIYj66T_U4U9m8",
    //             refreshToken:
    //                 "yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoianVuZ2h1biBZYW5nIiwiaWF0IjoxNjAwMDc2Nzk3LCJleHAiOjE2MTMwMzY3OTd9.PjhxKdQNomsMLlH4mxmhTz-8D0DdyFIYj66T_U4U9m8"
    //         })
    //         .expect(401)
    //         .end((err, res) => {
    //             if (err) {
    //                 logger.error(err);
    //                 done();
    //             }
    //             expect(res.body.msg).toEqual("Refresh Token is Invalid");
    //             expect(res.body.accessToken).toEqual("");
    //             expect(res.body.refreshToken).toEqual("");
    //             done();
    //         });
    // });

    // it("401 Unauthorized with Expired RefreshToken jwtToken POST /signin", (done) => {
    //     request(app)
    //         .post("/api/auth/signin/")
    //         .set("Accept", "application/json")
    //         .send({
    //             email: "maestroprog@seoultech.ac.kr",
    //             pwd: "1234",
    //             //token expired In 10s
    //             accessToken:
    //                 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoianVuZ2h1biBZYW5nIiwiaWF0IjoxNjAwMDc2ODY5LCJleHAiOjE2MDAwNzY4Nzl9.FIl96VRlXWfNam7EJVMjOffdXogF-7LzFGabeWfhxw4",
    //             refreshToken:
    //                 "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoianVuZ2h1biBZYW5nIiwiaWF0IjoxNjAwMDc2ODY5LCJleHAiOjE2MDAwNzY4Nzl9.FIl96VRlXWfNam7EJVMjOffdXogF-7LzFGabeWfhxw4"
    //         })
    //         .expect(401)
    //         .end((err, res) => {
    //             if (err) {
    //                 logger.error(err);
    //                 done();
    //             }
    //             expect(res.body.msg).toEqual("Refresh Token is expired");
    //             expect(res.body.accessToken).toEqual("");
    //             expect(res.body.refreshToken).toEqual("");
    //             done();
    //         });
    // });
});
