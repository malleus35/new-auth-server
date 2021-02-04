import env from "@src/utils/env";
describe("Test dotenv test", () => {
    it("custom dotenv test", () => {
        env.chooseEnv();
        expect(process.env.SERVER_PORT).not.toEqual("5000");
        expect(process.env.SERVER_PORT).not.toEqual("8080");
        expect(process.env.SERVER_PORT).toEqual("8000");
    });
});
