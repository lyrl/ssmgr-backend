const rp = require('request-promise');
const logger = require('./Logger');



function post(url, data, securityKey) {
  logger.info('Http POST 发起请求到 %s 数据 %s', url, JSON.stringify(data));


  let options = {
    method: 'POST',
    uri: url,
    body: data,
    json: true,
    headers: {
      'Authorization': securityKey
    },
  };

  rp(options)
      .then(function (body) {
        logger.info('Http POST 请求成功！ 返回: %s', JSON.stringify(body));

        return body;
      }).catch(function (err) {
        logger.error('Http POST 请求失败！ 返回: %s %s', err.statusCode,  err.message);

        return err;
      });
}




post('http://127.0.0.1:9999/api/users', {
  "user":{
    "port": 10005,
    "username": "ak2500",
    "password": "1z2x3c4v",
    "method": "aes-256-cfb"
  },
},'1z2x3c4v');