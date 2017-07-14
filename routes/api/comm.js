const router = require('express').Router();
const User = require('../../models/User');
const {Node, UserNodes} = require('../../models/Node');
const NetworkActivity = require('../../models/NetworkActivity');
const logger = require('../../component/Logger');
const auth = require('../auth');
const sequelize = require('../../models/DatabaseConnection');

/**
 * 流量上报
 */
router.post('/traffics', function (req, res, next) {
    logger.info('流量上报 数据 %s', JSON.stringify(req.body.data));

    let securityKey = req.body.data.security_key;
    let traffics = req.body.data.traffics;

    Node.findOne({where: {
      node_key: securityKey
    }}).then(node => {
      if (!node) {return res.status(404).json({errors: {message: "节点不存在!"}})}

      let keys = Object.keys(traffics);

      keys.map(k => { let users = node.getUsers({ through: { where: { port: k}}})
          .then(result => {
          users = result;

          if (result && result.length) {
            let user = users[0];
            logger.info('用户 %s 端口 %s  新增流量 %s 其中上传 %s 下载 %s!', user.user_name, k, traffics[k].total, traffics[k].tcpUp + traffics[k].udpUp, traffics[k].tcpDown + traffics[k].udpDown);

            user.userNodes.update({
              traffic_total: user.userNodes.traffic_total + traffics[k].total,
              traffic_up: user.userNodes.traffic_total + traffics[k].tcpUp + traffics[k].udpUp ,
              traffic_down: user.userNodes.traffic_total + traffics[k].tcpDown + traffics[k].udpDown
            }).then(ok => {
              logger.info('用户 %s 端口 %s 当前总流量 %s!', user.user_name, ok.port, ok.traffic_total);
            });

            let activities = traffics[k].activities;

            // NetworkActivity.bulkCreate(activities, {returning: true}).then(instances => {
            NetworkActivity.bulkCreate(activities, { individualHooks: true }).then(instances => {
              user.userNodes.addActivities(instances).then(() => {
                logger.info('用户 %s 端口 %s 网络活动信息保存成功 共 %s 条!', user.user_name, ok.port, activities.length);
              });
            })

          } else {
            logger.error('没有使用端口 %s 的用户!', k);
          }
        });
      });

      logger.info("更新节点最后心跳时间");

      node.update({
        last_heartbeat: new Date()
      }).then(n => {
        return res.sendStatus(200);
      });

    }).catch(next);
});




/**
* 用户列表
*/
router.get('/node/users/:security_key', function (req, res, next) {
  logger.info('获取节点下已有用户列表!');

  let securityKey = req.params.security_key;

  Node.findOne({where: {
    node_key: securityKey
  },
    include: {
      model: User
    }
  }).then(node => {
    if (!node) {return res.status(404).json({errors: {message: "节点不存在!"}})}

    return res.json(node);
  }).catch(next);
});

// 主页仪表盘
router.get('/statistics',  auth.required, function (req, res, next)
{
  logger.info('主页仪表盘数据');
  User.findById(req.payload.id).then(user => { if (!user) {return  res.status(401).json({ errors: { message: "未授权的访问!"}}) } if (user.id !== 1) {return res.status(403).json({ errors: { message: "您没有权限执行此操作!"}}) } }).catch(next);

  sequelize.query('SELECT (SELECT COUNT(u.`id`) AS users FROM `t_user` u WHERE u.`deleted_at` IS NULL) AS users, (SELECT COUNT(n.`id`) AS nodes FROM `t_node` n WHERE n.`deleted_at` IS NULL) AS nodes').then(result => {
    return res.json({statistics: result[0][0]});
  });

});


module.exports = router;