import request from "supertest";
import argon2 from "argon2";
import app from "@src/app";
import LogService from "@src/utils/LogService";
import AuthDBManager from "@src/models/AuthDBManager";
import UserModel from "@src/models/UserModel";
describe("make server and test signup request", () => {
    const logger = LogService.getInstance();
    it.skip("200 OK and sign POST /signup ", async (done) => {
        const db = AuthDBManager.getInstance();
        UserModel.initiate(db.getConnection());
        await UserModel.sync();
        request(app)
            .post("/api/auth/signup/")
            .set("Accept", "application/json")
            .send({
                name: "yang Hoya",
                pwd: "1234",
                email: "luciferkala@seoultech.ac.kr",
                grade: 3,
                school: "seoultech",
                stdNum: "17293873"
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.msg).toEqual("Signup Success!");
                logger.info("200 OK BASE");
                done();
            });
    });

    it("401 NO POST DATA with POST /signup", (done) => {
        request(app)
            .post("/api/auth/signup/")
            .set("Accept", "application/json")
            .send({
                name: "junghun yang",
                pwd: "12345",
                email: "maestroprog@seoultech.ac.kr",
                grade: 4,
                stdNum: "15109342"
            })
            .expect(401)
            .end((err, res) => {
                if (err) {
                    logger.error(err);
                    done();
                }
                expect(res.body.msg).toEqual("Bad Request!");
                done();
            });
    });

    it("409 Already Existed User POST /signup", async (done) => {
        const db = AuthDBManager.getInstance();
        UserModel.initiate(db.getConnection());
        const newUser = await UserModel.create({
            name: "junghun yang",
            pwd: await argon2.hash("1234"),
            email: "maestroprog@seoultech.ac.kr",
            grade: 4,
            school: "seoultech",
            stdNum: "15109342"
        });
        db.getConnection().close();
        request(app)
            .post("/api/auth/signup/")
            .set("Accept", "application/json")
            .send({
                name: "junghun yang",
                pwd: "1234",
                email: "maestroprog@seoultech.ac.kr",
                grade: 4,
                school: "seoultech",
                stdNum: "15109342"
            })
            .expect(409)
            .end((err, res) => {
                if (err) {
                    logger.error(err);
                    done();
                }
                expect(res.body.msg).toEqual("Already have Item!");
                done();
            });
    });
});
