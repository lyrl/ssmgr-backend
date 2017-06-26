var router = require('express').Router();
var User = require('../../models/User');
var logger = require('../../component/Logger');
var auth = require('../auth');




/**
 * 用户注册
 */
router.post('/users',auth.required, function (req, res, next) {
    logger.info('添加用户!', req.body.user);
    User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

    const user = User.build(req.body.user);
    user.setPassword(user.password);

    user.save().then(user => {
        return res.json({user: user.toAuthJSON()});
    }).catch(next);
});

/**
 * 用户登录
 */
router.post('/users/login', function(req, res, next){
    if(!req.body.user.user_name){ return res.status(422).json({errors: {message: "用户名不能为空！"}}); }

    if(!req.body.user.password){ return res.status(422).json({errors: {message: "密码不能为空！"}}); }

    User.findOne({
        where: { user_name: req.body.user.user_name}
    }).then(user => {
        if (user && user.validPassword(req.body.user.password)) {
            return res.json({user: user.toAuthJSON()});
        } else {
            return res.status(401).json({ errors: { message: "登录失败！用户名或者密码错误!"}});
        }
    }).catch(next);
});


/**
 * 获取当前登录用户信息
 */
router.get('/user', auth.required, function(req, res, next){
    User.findOne({
        where: {
            user_name: req.payload.user_name
        }
    }).then(function(user){
        if(!user){ return res.sendStatus(401); }

        return res.json({user: user.toAuthJSON()});
    }).catch(next);
});

/**
 * 修改当前用户信息
 *  user.email    修改邮箱
 *  user.password 修改密码
 */
router.put('/user', auth.required, function(req, res, next){

    User.findOne({
        where: {
            user_name: req.payload.user_name
        }
    }).then(function(user){
        if(!user){ return res.sendStatus(401); }

        let updateFiled = {};

        if(typeof req.body.user.email !== 'undefined'){
            user.email = req.body.user.email;
            updateFiled.email = req.body.user.email;
        }

        if(typeof req.body.user.password !== 'undefined'){
            if (req.body.user.password && !req.body.user.password.trim()) {
                user.setPassword(req.body.user.password);

                updateFiled.password = user.password;
                updateFiled.salt = user.salt;
            }
        }

        return user.update(updateFiled).then(function(){
            return res.json({user: user.toAuthJSON()});
        });

    }).catch(next);
});


/**
 * 获取所有用户
 */
router.get('/users', auth.required, function (req, res, next) {
    logger.info('列出所有用户');
    User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

    User.findAll().then((users) => {
        return res.json({
            'users' : users
        });
    }).catch(next);
});


/**
 * 获取用户信息
 *  根据用户名查询
 */
router.get('/users/:user_name', auth.required, function (req, res, next) {
  logger.info('查询用户信息 %s!', req.params.user_name);
  User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

  User.findOne({where: { user_name: req.params.user_name}}).then((user) => {
    if (user) {
      return res.json({ 'user': user});
    }

    return res.status(404).json({ errors: { message: "用户不存在!"}})
  }).catch(next);
});


/**
 * 修改用户信息
 */
router.put('/users/:user_name',auth.required, function (req, res, next) {
    logger.info('修改用户信息 %s!', req.params.user_name, req.body.user);
    User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

    User.findOne({
        where: { user_name: req.params.user_name}
    }).then((user) => {
        if (user) {
            if(typeof req.body.user.password !== 'undefined'){
                if (req.body.user.password) {
                    logger.info('原密码 hash %s , salt %s', user.password, user.salt);

                    user.setPassword(req.body.user.password);


                    let updateFiled = Object.assign({}, req.body.user, {password: user.password, salt: user.salt});

                    user.update(updateFiled).then(user => {return res.json({user: user})})
                }else {
                    logger.info('原密码 hash %s , salt %s', user.password, user.salt);
                    user.update(req.body.user).then(user => {return res.json({user: user})})
                }
            } else {
                logger.info('原密码 hash %s , salt %s', user.password, user.salt);
                user.update(req.body.user).then(user => {return res.json({user: user})})
            }
        } else { return res.status(404).json({ errors: { message: "用户不存在!"}}) }
    }).catch(next);
});


/**
 * 删除用户
 */
router.delete('/users/:user_name', auth.required, function (req, res, next) {
    logger.info('删除用户 %s!', req.params.user_name);
    User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

    User.findOne({
        where: { user_name: req.params.user_name}
    }).then((user) => {
        if (user) {
            user.destroy().then(success => {
                return res.sendStatus(200);
            })
        } else {
            return res.status(404).json({ errors: { message: "用户不存在!"}});
        }
    }).catch(next);
});


router.delete('/users/:user_name', auth.required, function (req, res, next) {
    logger.info('删除用户 %s!', req.params.user_name);

    User.destroy({
        where: {
            user_name: req.params.user_name
        }
    }).then((rowDeleted ) => {
        // rowDeleted == 1 删除成功  rowDeleted == 0 没有记录或者删除失败
        logger.info("删除成功! %s", rowDeleted );
        res.json({})
    }).catch(next);
});






module.exports = router;