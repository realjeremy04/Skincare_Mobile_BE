import AccountAPI from "$root/controllers/Account.controller";
import { auth, isAdmin, checkActive } from "$root/middleware/auth";
import { Router } from "express";

const router = Router();

//Authentications routes
router.post("/login", AccountAPI.login);
router.post("/register", AccountAPI.register);
router.get("/logout", AccountAPI.logout);
router.post("/", AccountAPI.createAccount);

//Admin routes
router.get("/", auth, checkActive, isAdmin, AccountAPI.getAllAccounts);
router.put("/:id", auth, isAdmin, AccountAPI.updateAccount);
router.delete("/:id", auth, isAdmin, AccountAPI.deleteAccount);

router.get("/profile", auth, checkActive, AccountAPI.getAccount);
router.put("/updateProfile", auth, checkActive, AccountAPI.updateAccount);
router.post("/changePassword", auth, checkActive, AccountAPI.changePassword);

export default router;
