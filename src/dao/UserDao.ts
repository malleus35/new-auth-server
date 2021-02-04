import { Model, UniqueConstraintError, ValidationError } from "sequelize";
import argon2 from "argon2";
import AuthDBManager from "@src/models/AuthDBManager";
import User from "@src/models/UserModel";
import LogService from "@src/utils/LogService";
import Dao from "@src/dao/Dao";
import { AllStrictReqData, AuthReqData } from "@src/vo/auth/services/reqData";
import KafkaDao from "@src/dao/KafkaDao";
import KafkaData from "@src/vo/auth/services/kafkaData";

const logger = LogService.getInstance();

class UserDao extends Dao {
    private constructor() {
        super();
        this.db = AuthDBManager.getInstance();
    }

    protected async connect() {
        this.db = await AuthDBManager.getInstance();
    }

    protected async endConnect() {
        await this.db?.endConnection();
    }
    async findOne({
        data,
        decoded,
        params
    }: AuthReqData): Promise<Model | string | null | undefined> {
        let result: Model | null = null;
        try {
            result = await User.findOne({
                where: {
                    id: data.id
                }
            });
        } catch (err) {
            logger.error(err);
            if (err instanceof ValidationError) return "BadRequest";
            return undefined;
        }
        return result;
    }

    async findMyInfo({
        data,
        decoded,
        params
    }: AllStrictReqData): Promise<Model | string | null | undefined> {
        let result: Model | null = null;
        try {
            result = await User.findOne({
                where: {
                    idx: decoded.idx
                }
            });
        } catch (err) {
            logger.error(err);
            if (err instanceof ValidationError) return "BadRequest";
            return undefined;
        }
        return result;
    }

    async save({
        data,
        decoded,
        params
    }: AuthReqData): Promise<User | string | null | undefined> {
        let newUser: User | null = null;
        console.log(data.pwd);
        data.pwd = await argon2.hash(data.pwd);
        try {
            newUser = await User.create(data);
        } catch (err) {
            logger.error(err);
            if (err instanceof UniqueConstraintError) return `AlreadyExistItem`;
            else if (err instanceof ValidationError) return `BadRequest`;
            return undefined;
        }
        return newUser;
    }

    async update({
        data,
        decoded,
        params
    }: AllStrictReqData): Promise<any | null | undefined> {
        let updateMember: any | null = null;
        try {
            updateMember = await User.update(
                { ...data },
                { where: { ...params } }
            );
        } catch (err) {
            logger.error(err);
            if (err instanceof ValidationError) return `BadRequest`;
            return undefined;
        }
        return updateMember;
    }

    async delete({
        data,
        decoded,
        params
    }: AllStrictReqData): Promise<number | string | null | undefined> {
        let deleteMember: number | null = null;
        try {
            deleteMember = await User.destroy({
                where: {
                    idx: decoded.idx
                }
            });
            // const sendData: KafkaData = {
            //     status: !deleteMember ? "Fail" : "Success",
            //     data: { email: decoded.email }
            // };
            // await KafkaDao.getInstance().sendMessage(
            //     "userMemberDelete",
            //     "userMemberDelete",
            //     sendData
            // );
        } catch (err) {
            logger.error(err);
            if (err instanceof ValidationError) return `BadRequest`;
            return undefined;
        }
        return deleteMember; //1 is success, 0 or undefined are fail
    }
}

export default UserDao;
