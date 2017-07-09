const User = require('../models/User');
const {Node} = require('../models/Node');
const logger = require('./Logger');
const {post, del, get} = require('./HttpUtil');



function sync() {

  Node.findAll({
    include: {
        model: User
    }
  }).then(nodes => {
    for (let node of nodes) {
      logger.info("准备开始同步节点 %s!", node.node_name);

      let node_ip = node.node_ip;
      let node_port = node.node_port;
      let node_key = node.node_key;

      logger.info("节点同步任务开始!");


      let url = `http://${node_ip}:${node_port}/api/sync`;

      let needSyncData = [];

      for (let user of node.users) {
        let data = {
          username: user.user_name,
          password: user.userNodes.password,
          method: user.userNodes.method,
          port: user.userNodes.port
        };

        needSyncData.push(data);
        logger.info("增加待同步项 %s!", JSON.stringify(data));
      }


      logger.info("发送同步指令到节点  数据：%s!", JSON.stringify(needSyncData));

      post(url, {users: needSyncData}, node_key)
          .then(body => {
            logger.info('Http POST 请求成功！ 返回: %s', JSON.stringify(body));

            if (body.errors) {
              logger.error("同步失败 %s!", JSON.stringify(body.errors));
            } else {
              logger.info("同步成功!");
            }
          })
          .catch(err => {
            logger.error('Http POST 请求失败！ 返回: %s %s', err.statusCode,  err.message);
          });



    }

  });

}

setInterval(sync, 30000);

