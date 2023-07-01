const { Router } = require('express');
const authRouter = require('./authRouter');
const passwordRouter = require('./passwordRouter');
const userRouter = require('./userRouter');

const router = Router();

router.use('/auth', authRouter);
router.use('/password', passwordRouter);
router.use('/user', userRouter);
module.exports = router;
