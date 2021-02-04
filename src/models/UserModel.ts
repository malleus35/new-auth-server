import { Model, Sequelize, Optional } from "sequelize";
import { UserModelTypes } from "@src/vo/auth/models/UserModel";
import { SignUpTypes } from "@src/vo/auth/controllers/Signup";

interface UserCreationAttributes
    extends Optional<SignUpTypes.SignUpBody, "user_idx"> {}
class User
    // extends Model<SignUpTypes.SignUpBody, UserCreationAttributes>
    extends Model
    implements SignUpTypes.SignUpBody {
    public user_idx!: number;
    public user_id!: string;
    public nickname!: string;
    public password!: string;
    public level!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    static initiate(connection: Sequelize): Model {
        const opt: UserModelTypes.IBaseUserTableOptions = {
            sequelize: connection,
            tableName: "User"
        };
        return User.init(UserModelTypes.attr, opt);
    }
}

export default User;
