import TransactionAPI from "$root/controllers/Transaction.controller";
import { auth, authWithCookies, checkActive, isStaffOrAdmin } from "$root/middleware/auth";
import { Router } from "express";

const router = Router();

router.get("/", TransactionAPI.getAllTransactions);
router.post("/", auth, checkActive, TransactionAPI.createTransaction);
router.get("/:transactionId", TransactionAPI.getTransaction);
router.get(
  "/customer/:customerId",
  auth,
  checkActive,
  TransactionAPI.getTransactionsByCustomerId
);
router.delete("/:transactionId", TransactionAPI.deleteTransaction);
router.put(
  "/:transactionId",
  authWithCookies,
  checkActive,
  isStaffOrAdmin,
  TransactionAPI.updateTransaction
);

export default router;
