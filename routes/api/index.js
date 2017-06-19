var router = require('express').Router();

router.use('/', require('./users'));
router.use('/nodes', require('./nodes'));
// router.use('/profiles', require('./profiles'));
// router.use('/articles', require('./articles'));
// router.use('/tags', require('./tags'));

module.exports = router;
