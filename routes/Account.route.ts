import AccountAPI from "$root/controllers/Account.controller";
import {
  auth,
  isAdmin,
  checkActive,
  authWithCookies,
} from "$root/middleware/auth";
import { Router } from "express";

const router = Router();

//Authentications routes
router.post("/login", AccountAPI.login);
router.post("/loginWithCookies", AccountAPI.loginWithCookies);
router.post("/register", AccountAPI.register);
router.get("/logout", AccountAPI.logout);
router.post("/", AccountAPI.createAccount);

//Admin routes
router.get("/", authWithCookies, checkActive, isAdmin, AccountAPI.getAllAccounts);
router.patch("/:id", authWithCookies, isAdmin, AccountAPI.updateAccountAdmin);
router.delete("/:id", authWithCookies, isAdmin, AccountAPI.deleteAccount);

router.get("/profile", authWithCookies, checkActive, AccountAPI.getAccount);
router.get("/profileJWT", auth, checkActive, AccountAPI.getAccount);

router.patch("/updateProfile/id", authWithCookies, checkActive, AccountAPI.updateAccount);
router.patch("/updateProfileJWT/:id", auth, checkActive, AccountAPI.updateAccount);

router.post("/changePassword", authWithCookies, checkActive, AccountAPI.changePassword);
router.post("/changePasswordJWT", auth, checkActive, AccountAPI.changePassword);

export default router;
