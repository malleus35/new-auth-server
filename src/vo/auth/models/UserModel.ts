import {
    Sequelize,
    DataTypes,
    InitOptions,
    ModelAttributes,
    ModelValidateOptions
} from "sequelize";
export namespace UserModelTypes {
    export interface IBaseUserTableOptions extends InitOptions {
        sequelize: Sequelize;
        tableName: string;
    }
    export interface IColumnOption {
        type: DataTypes.DataType;
        allowNull: boolean;
        primaryKey?: boolean;
        validate?: ModelValidateOptions;
        unique?: boolean;
    }
    export interface IUserScheme extends ModelAttributes {
        user_id: IColumnOption;
        nickname: IColumnOption;
        password: IColumnOption;
        level: IColumnOption;
    }
    export const attr: UserModelTypes.IUserScheme = {
        user_idx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        level: {
            type: DataTypes.TINYINT,
            allowNull: true,
            validate: {
                notEmpty: false
            }
        }
    };
}
