import redis from "redis";
import DBManager from "@src/models/DBManager";

class TokenDBManager extends DBManager {
    constructor() {
        super();
        this.connection = redis.createClient({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT)
        });
    }
    getConnection() {
        return this.connection;
    }
    endConnection(): void {
        this.connection.quit();
    }
}

export default TokenDBManager;
