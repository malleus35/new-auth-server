import { promisify } from "util";
import LogSerivce from "@src/utils/LogService";
import TokenDBManager from "@src/models/TokenDBManager";

const logger = LogSerivce.getInstance();
class TokenDao {
    private static instance: TokenDao;
    private db: TokenDBManager | undefined;
    private getAsync: Function | undefined;
    private setAsync: Function | undefined;
    private ttlAsync: Function | undefined;
    private delAsync: Function | undefined;
    private INIT_NUM: number;

    private constructor() {
        this.INIT_NUM = -987654321;
    }
    private static setSingleton(): void {
        if (TokenDao.instance == null) TokenDao.instance = new TokenDao();
    }
    static getInstance(): TokenDao {
        if (TokenDao.instance == null) TokenDao.setSingleton();
        return this.instance;
    }
    private connect() {
        // this.db = TokenDBManager.getInstance();
        this.db = new TokenDBManager();
        this.getAsync = promisify(this.db.getConnection().get).bind(
            this.db.getConnection()
        );
        this.setAsync = promisify(this.db.getConnection().set).bind(
            this.db.getConnection()
        );
        this.ttlAsync = promisify(this.db.getConnection().ttl).bind(
            this.db.getConnection()
        );
        this.delAsync = promisify(this.db.getConnection().del).bind(
            this.db.getConnection()
        );
    }
    private endConnect() {
        if (this.db === undefined) {
            throw Error("Connect Redis Fail!");
        } else {
            this.db.endConnection();
        }
    }
    async save(key: number, value: string): Promise<string | number> {
        this.connect();
        if (this.db === undefined || this.setAsync === undefined) {
            throw Error("Connect Redis Fail!");
        } else {
            let result = this.INIT_NUM;
            await this.setAsync(key, value, "EX", 60 * 60 * 24 * 14)
                .then((reply) => {
                    result = reply;
                    logger.info(reply.toString());
                })
                .catch((err) => {
                    logger.error(err);
                });
            this.endConnect();
            return result;
        }
    }
    async find(key: number): Promise<string> {
        this.connect();
        if (this.db === undefined || this.getAsync === undefined) {
            throw Error("Connect Redis Fail!");
        } else {
            let result: string = "";
            await this.getAsync(key)
                .then((reply) => {
                    logger.info(reply.toString());
                    result = reply.toString();
                })
                .catch((err) => {
                    logger.error(err);
                    result = err.toString();
                });
            this.endConnect();
            return result;
        }
    }
    async checkTTL(key: string): Promise<number> {
        this.connect();
        if (this.db === undefined || this.ttlAsync === undefined) {
            throw Error("Connect Redis Fail!");
        } else {
            let result: number = this.INIT_NUM;
            await this.ttlAsync(key)
                .then((reply) => {
                    logger.info(reply);
                    result = result;
                })
                .catch((err) => {
                    logger.error(err);
                });
            this.endConnect();
            return result;
        }
    }
    async remove(key: string): Promise<number> {
        this.connect();
        if (this.db === undefined || this.delAsync === undefined) {
            throw Error("Connect Redis Fail!");
        } else {
            let result: number = this.INIT_NUM;
            await this.delAsync(key)
                .then((reply) => {
                    result = reply;
                })
                .catch((err) => {
                    console.log(err);
                });
            this.endConnect();
            return result;
        }
    }
}

export default TokenDao;
