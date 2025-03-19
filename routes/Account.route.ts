import AccountAPI from "$root/controllers/Account.controller";
import { auth, isAdmin, checkActive } from "$root/middleware/auth";
import { Router } from "express";

const router = Router();

//Authentications routes
router.post("/login", AccountAPI.login);
router.post("/loginWithCookies", AccountAPI.loginWithCookies);
router.post("/register", AccountAPI.register);
router.get("/logout", AccountAPI.logout);
router.post("/", AccountAPI.createAccount);

//Admin routes
router.get("/", auth, checkActive, isAdmin, AccountAPI.getAllAccounts);
router.patch("/:id", auth, isAdmin, AccountAPI.updateAccountAdmin);
router.delete("/:id", auth, isAdmin, AccountAPI.deleteAccount);

router.get("/profile", auth, checkActive, AccountAPI.getAccount);
router.patch("/updateProfile", auth, checkActive, AccountAPI.updateAccount);
router.post("/changePassword", auth, checkActive, AccountAPI.changePassword);

export default router;
