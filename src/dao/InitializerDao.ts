import User from "@src/models/UserModel";
import AuthDBManager from "@src/models/AuthDBManager";
import Dao from "@src/dao/Dao";

class InitializerDao extends Dao {
    protected db: AuthDBManager;
    protected constructor() {
        super();
        this.db = AuthDBManager.getInstance();
        const firstInit = async () => await this.init();
        const firstSync = async () => await this.sync();
        firstInit();
        firstSync();
    }

    protected async connect() {
        this.db = AuthDBManager.getInstance();
    }

    protected async endConnect() {
        await this.db?.endConnection();
    }

    public async init(): Promise<void> {
        User.initiate(this.db.getConnection());
    }

    public async sync(): Promise<void> {
        await User.sync();
        // await this.endConnect();
    }
}

export default InitializerDao;
