import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.ts";
import contactController from "../controller/contact.controller.ts";

const router = Router();

router.get("/", authMiddleware.authenticate, contactController.listContacts);
router.get("/:id", authMiddleware.authenticate, contactController.getContact);
router.post("/", authMiddleware.authenticate, contactController.createContact);
router.put(
  "/:id",
  authMiddleware.authenticate,
  contactController.updateContact,
);
router.delete(
  "/:id",
  authMiddleware.authenticate,
  contactController.deleteContact,
);
router.post(
  "/:id/share",
  authMiddleware.authenticate,
  contactController.shareContact,
);
router.post(
  "/:id/unshare",
  authMiddleware.authenticate,
  contactController.unshareContact,
);

export default router;
