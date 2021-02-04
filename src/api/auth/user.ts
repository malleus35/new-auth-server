import { Router } from "express";
import passport from "passport";
import SignupController from "@src/controllers/services/user/SignupController";
import SignInController from "@src/controllers/services/user/SigninController";
import LogoutController from "@src/controllers/services/user/LogoutController";
import TokenSignInController from "@src/controllers/services/user/TokenSigninController";
import JwtVerifyAccessController from "@src/controllers/middlewares/jwt/JwtVerifyAccessController";
import JwtVerifyRefreshController from "@src/controllers/middlewares/jwt/JwtVerifyRefreshController";
import DeleteController from "@src/controllers/services/user/DeleteController";

const router = Router();

router.post("/", new SignupController().excute());

router.post("/signin/local", new SignInController().excute());
router.post("/signin/google", new SignInController().excute());
router.post("/signin/kakao", new SignInController().excute());

router.post(
    "/logout",
    new JwtVerifyAccessController().excute(),
    new LogoutController().excute()
);
router.post(
    "/verify",
    new JwtVerifyAccessController().excute(),
    new TokenSignInController().excute()
);
router.get("/refresh", new JwtVerifyRefreshController().excute());
router.delete(
    "/",
    new JwtVerifyAccessController().excute(),
    new DeleteController().excute()
);

export default router;
