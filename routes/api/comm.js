const router = require('express').Router();
const User = require('../../models/User');
const {Node, UserNodes} = require('../../models/Node');
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

            logger.info('用户 %s 端口 %s 新增流量 %s!', user.user_name, k, traffics[k]);



            user.userNodes.update({
              traffic_total: user.userNodes.traffic_total + traffics[k]
            }).then(ok => {
              logger.info('用户 %s 端口 %s 当前总流量 %s!', user.user_name, ok.port, ok.traffic_total);
            })

          } else {
            logger.error('没有使用端口 %s 的用户!', k);
          }
        });
      });

      return res.sendStatus(200)

    }).catch(next);
});




module.exports = router;