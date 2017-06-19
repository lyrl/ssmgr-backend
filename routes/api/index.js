var router = require('express').Router();

router.use('/', require('./users'));
router.use('/nodes', require('./nodes'));

module.exports = router;
