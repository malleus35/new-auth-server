import dotenv from "dotenv";
import path from "path";

const env = {
    setConfig: dotenv.config,
    envTestConfig: {
        path: path.join(__dirname, "../../envs/.env.test")
    },
    envConfig: {
        path: path.join(__dirname, "../../envs/.env.production")
    },
    envDevConfig: {
        path: path.join(__dirname, "../../envs/.env.develop")
    },
    chooseEnv: (): void => {
        if (process.env.NODE_ENV === "production") {
            env.setConfig(env.envConfig);
        } else if (process.env.NODE_ENV === "test") {
            env.setConfig(env.envTestConfig);
        } else if (process.env.NODE_ENV === "dev") {
            env.setConfig(env.envDevConfig);
        }
    }
};

export default env;
