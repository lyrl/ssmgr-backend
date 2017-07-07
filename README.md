# SSMGR-Backend  API


### Authentication Header:

`Authorization: Token jwt.token.here`

## Endpoints:

### Authentication:
`POST /api/users/login`
> No authentication required

Request body:

| Name      | Type   | Description |
|-----------|--------|-------------|
| user_name | string |     -        |
| password  | string |       -      |


```JSON
{
  "user":{
    "user_name": "lyrl",
    "password": "jakejake"
  }
}
```


Response:

| Name      | Type   | Description |
|-----------|--------|-------------|
| user_name | string |    -   |
| email | string |   -    |
| token | string |    用于身份认证   |

```json
{
    "user": {
        "user_name": "lyrl",
        "email": "18ssss90@qq.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcl9uYW1lIjoibHlybCIsImV4cCI6MTUwNDU5NjUxNSwiaWF0IjoxNDk5NDEyNTE1fQ.Iz4wRijBQDWCMFq_dTCJ_hStyQczobWyQWBXLE5CMOs"
    }
}
```

### Get Current User

`GET /api/user`

> Authentication required



### Update User

`PUT /api/user`

> Authentication required

Request Body:

```json
{
  "user": {
    "email": "john@jacob.com"
  }
}
```

Update User Email


## Node:

### Create Node

`POST /api/nodes`

> Authentication required

Request Body:

| Name      | Type   | Description |
|-----------|--------|-------------|
| node_name | string |    节点名称         |
| node_ip  | string |      IP       |
| node_encry_mode  | string |     默认加密方式        |
| node_port  | init |      管理端口       |
| node_key  | string |      通讯秘钥       |


```json
{
	"node": {
	"node_name": "香港",
	"node_ip": "113.222.111.244",
	"node_port": 8080,
	"node_key": "1z2x3c4v",
	"node_encry_mode": "aes-256-cfb"
	}
}
```

### Delete Node
`DELETE /api/nodes/:nodeid`

> Authentication required

### Get All Nodes

`GET /api/nodes`

> Authentication required

## User


### Create User

`POST /api/users`

> Authentication required

Request Body:

| Name      | Type   | Description |
|-----------|--------|-------------|
| user_name | string |      -       |
| password  | string |      -       |
| email  | string |       -      |



```json
{
	"user":
	{
	"user_name": "test",
	"password": "111222333",
	"email": "xxxx@qq.com"
	}
}
```

### Delete User
`DELETE /api/users/:user_name`

> Authentication required

### Get All Users

`GET /api/users`

> Authentication required


### Update User

`PUT /api/users/:user_name`

> Authentication required

Request Body:

| Name      | Type   | Description |
|-----------|--------|-------------|
| user_name | string |    -         |
| password  | string |      -       |
| email  | string |      -       |

```json
{
	"user":
	{
	"user_name": "xxxx",
	"password": "1xxxxxxxxx23",
	"email": "xxxxxxxx@qq.com"
	}
}
```



