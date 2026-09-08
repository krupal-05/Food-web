import {Router} from 'express'
import {registerRestarant} from '../controllers/Restaurant.controller.js'
import {verifyAdmin} from '../middleware/admin.middleware.js'

const router  = Router ();

router.route("/register-restaurant").post(isAdmin,registerRestarant)
router.route("/All-restairant").post( verifyAdmin, registerRestarant)


export default router;