var router = require('express').Router();

router.use('/', require('./users'));
router.use('/nodes', require('./nodes'));
router.use('/comm', require('./comm'));

module.exports = router;
