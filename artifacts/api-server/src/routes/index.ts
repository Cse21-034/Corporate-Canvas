import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import contentRouter from "./content";
import quotesRouter from "./quotes";
import portalRouter from "./portal";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(contentRouter);
router.use(quotesRouter);
router.use(portalRouter);
router.use(adminRouter);

export default router;
