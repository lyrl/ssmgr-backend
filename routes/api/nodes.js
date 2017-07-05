const router = require('express').Router();
const User = require('../../models/User');
const {Node, UserNodes} = require('../../models/Node');
const logger = require('../../component/Logger');
const auth = require('../auth');
const sequelize = require('../../models/DatabaseConnection');
const {post} = require('../../component/HttpUtil');


/**
 * 获取产品下所有节点
 */
router.get('/', auth.required, function (req, res, next) {
    logger.info('查看所有节点 countUser = %s', req.query.countUser ? 'true' : 'false' );
    User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

    if (req.query.countUser) {
      sequelize.query('SELECT `node`.`id`, `node`.`node_name`, `node`.`node_ip`, `node`.`node_port`, `node`.`node_key`, `node`.`node_encry_mode`,`node`.`max_user`, `node`.`created_at`, `node`.`updated_at`, `node`.`deleted_at`, `node`.`last_heartbeat`, (SELECT COUNT(1) FROM `t_user_node` AS `tun` WHERE tun.deleted_at IS NULL AND tun.node_id = node.id) AS `user_count` FROM `t_node` AS `node` WHERE `node`.`deleted_at` IS NULL')
          .then(nodes => {
        return res.json({nodes: nodes[0]})
      }).catch(next);
    } else {
      Node.findAll({
      }).then(nodes => {
        return res.json({nodes: nodes})
      }).catch(next);
    }
});


/**
 * 增加节点
 */
router.post('/', auth.required, function (req, res, next) {
    logger.info('增加服务节点 %s!', req.body.node);
    User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

    Node.create(req.body.node).then(node => {
        return res.json({node: node})
    }).catch(next);
});


/**
 * 修改节点接口
 */
router.put('/:nodeid', auth.required, function (req, res, next) {
  logger.info('修改节点信息  nodeId: %s!', req.params.nodeid);
    User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

    Node.findOne({
        where: {
            id: req.params.nodeid
        }
    }).then(node => {
        if (!node) {return res.status(404).json({errors: {message: "节点不存在!"}})}

        node.update(req.body.node).then(node => {
            return res.json({node: {node}})
        })
    }).catch(next);

});

/**
 * 获取节点信息
 */
router.get('/:nodeid', auth.required, function (req, res, next) {
  logger.info('获取节点信息  nodeId: %s!', req.params.nodeid);
  User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

  Node.findOne({
    where: {
      id: req.params.nodeid
    }
  }).then(node => {
    if (!node) {return res.status(404).json({errors: {message: "节点不存在!"}})}

    return res.json({node: node});
  }).catch(next);

});


/**
 * 获取节点下用户信息
 */
router.get('/:nodeid/users', auth.required, function (req, res, next) {
  logger.info('获取节点下用户信息  nodeId: %s!', req.params.nodeid);
  User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

  Node.findOne({
    where: {
      id: req.params.nodeid
    },
    include: {
      model: User
    }
  }).then(node => {
    if (!node) {return res.status(404).json({errors: {message: "节点不存在!"}})}

    return res.json({node: node});
  }).catch(next);

});

/**
 * 增加节点用户
 */
router.post('/:nodeid/users', auth.required, function (req, res, next) {
  logger.info('增加节点用户  nodeId: %s!', req.params.nodeid);
  User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

  Node.findOne({
    where: {
      id: req.params.nodeid
    }
  }).then(node => {
    if (!node) {return res.status(404).json({errors: {message: "节点不存在!"}})}

    let nodeuser = req.body.nodeuser;

    User.findOne({ where: { user_name: nodeuser.user}}).then(user => {
      if (user) {
        let node_ip = node.node_ip;
        let node_port = node.node_port;
        let node_key = node.node_key;


        let url = `http://${node_ip}:${node_port}/api/users`;

        post(url, { "user": { "username": user.user_name, "password": nodeuser.password, "method": nodeuser.method},}, node_key)
            .then(function (body) {
              logger.info('Http POST 请求成功！ 返回: %s', JSON.stringify(body));
              user.userNodes = { method: nodeuser.method, password: nodeuser.password, port: body.user.server_port, status: 'working'};

              node.addUser(user).then((nu)=> {
                return res.json(nu);
              })})
            .catch(function (err) {
              logger.error('Http POST 请求失败！ 返回: %s %s', err.statusCode,  err.message);
              user.userNodes = { method: nodeuser.method, password: nodeuser.password};
              node.addUser(user).then((nu)=> {
                return res.json(nu);
              })
            });


      } else {
        if (!user) {return res.status(404).json({errors: {message: "用户不存在!"}})}
      }
    });
  }).catch(next);

});


/**
 * 删除节点用户
 */
router.delete('/:nodeid/users/:userid', auth.required, function (req, res, next) {
  logger.info('删除节点用户  nodeid: %s userid: %s!', req.params.nodeid, req.params.userid);
  User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

  Node.findOne({
    include: [
      {
        model: User,
        through: {
          where: {
            user_id: req.params.userid
          }
        }
      }
    ],
    where: {
      id: req.params.nodeid
    }
  }).then(node => {

    if (node) {
      if (node.users && node.users.length) {
        node.removeUser(node.users[0]).then(() => {
          return res.json(node);
        });
      } else {
        return res.status(404).json({errors: {message: "用户不存在于这个节点下!"}});
      }
    } else {
      return res.status(404).json({errors: {message: "节点不存在!"}});
    }

  }).catch(next);

});




/**
 * 删除产品节点
 */
router.delete('/:nodeid', auth.required, function (req, res, next) {
  logger.info('删除节点信息  nodeId: %s!', req.params.nodeid);
    User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

    Node.findOne({
        where: {
            id: req.params.nodeid
        }
    }).then(node => {
        if (!node) {return res.status(404).json({errors: {message: "节点不存在!"}})}

        node.destroy().then(success => {
            return res.sendStatus(200)
        })
    }).catch(next);

});


module.exports = router;