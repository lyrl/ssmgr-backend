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

  return rp(options);
}


function del(url, securityKey) {
  logger.info('Http DELETE 发起请求到 %s 数据 %s', url);


  let options = {
    method: 'DELETE',
    uri: url,
    headers: {
      'Authorization': securityKey
    }
  };

  return rp(options);
}


module.exports = {post, del};

// post('http://127.0.0.1:9999/api/users', {
//   "user":{
//     "port": 10005,
//     "username": "ak2500",
//     "password": "1z2x3c4v",
//     "method": "aes-256-cfb"
//   },
// },'1z2x3c4v');