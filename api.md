***本文档由 Rap2 (https://github.com/thx/rap2-delos) 生成***

***本项目仓库：[http://rap2.taobao.org/repository/editor?id=307677](http://rap2.taobao.org/repository/editor?id=307677) ***

***生成日期：2022-11-14 17:15:28***

# 仓库：election-demo
## 模块：管理员
### 接口：登录接口
* 地址：/admin/login
* 类型：POST
* 状态码：200
* 简介：
登录接口，登陆后获取到 jwt token

在需要登录校验的接口中传递 Authorization 参数。格式 Bearer \<token\>

默认账号为 admin 密码 Aa123456
* Rap地址：[http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349931](http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349931)
* 请求接口格式：

```
├─ account: String (必选) (账号)
└─ password: String (必选) (密码)

```

* 返回接口格式：

```
└─ token: String (必选) 

```


### 接口：新建选举
* 地址：/elections
* 类型：POST
* 状态码：200
* 简介：无
* Rap地址：[http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349932](http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349932)
* 请求接口格式：

```
└─ Authorization: String (必选) (Bearer <token>)

```

* 返回接口格式：

```
└─ electionId: Number (必选) (选举 ID)

```


### 接口：更新选举状态
* 地址：/elections/:electionId
* 类型：PUT
* 状态码：200
* 简介：开始&停止选举投票
* Rap地址：[http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349933](http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349933)
* 请求接口格式：

```
├─ Authorization: String (必选) (Bearer <token>)
├─ electionId: Number (必选) (path 参数，操作的选举 ID)
└─ action: Number (必选) (1. 开始选举投票 2. 停止选举投票)

```

* 返回接口格式：

```
└─ election: Object (选举信息)
   ├─ election_id: Number  (选举 ID)
   ├─ stat: Number  (选举状态：1.初始化 2.开始投票 3.停止投票)
   ├─ created_at: String  (创建时间)
   └─ updated_at: String  (更新时间)

```


### 接口：添加候选人
* 地址：/candidates
* 类型：POST
* 状态码：200
* 简介：无
* Rap地址：[http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349937](http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349937)
* 请求接口格式：

```
├─ electionId: Number (必选) (选举 ID)
├─ name: String (必选) (候选人姓名)
└─ Authorization: String (必选) (Bearer <token>)

```

* 返回接口格式：

```
└─ condidate: Object (候选人数据)
   ├─ candidate_id: Number (必选) (候选人 ID)
   ├─ election_id: Number (必选) (选举 ID)
   └─ name: String (必选) (候选人姓名)

```


### 接口：查看选举详情
* 地址：/elections/:electionId
* 类型：GET
* 状态码：200
* 简介：选举候选人，获得票数
* Rap地址：[http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349938](http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349938)
* 请求接口格式：

```
└─ Authorization: String (必选) (Bearer <token>)

```

* 返回接口格式：

```
└─ detail: Object (详情)
   ├─ election_id: Number (必选) (选举 ID)
   ├─ stat: Number (必选) (选举状态：1.初始化 2.开始投票 3.停止投票)
   ├─ created_at: String (必选) (选举创建时间)
   ├─ updated_at: String (必选) (选举更新时间)
   └─ detail: Array 
      ├─ cnt: Number (必选) (投票计数)
      ├─ candidate_id: Number (必选) (候选人 ID)
      └─ name: String (必选) (候选人姓名)

```


### 接口：查看候选人选票明细
* 地址：/candidates/:candidateId
* 类型：POST
* 状态码：200
* 简介：无
* Rap地址：[http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349939](http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349939)
* 请求接口格式：

```
├─ Authorization: String (必选) (Bearer <token>)
└─ page: Number (必选) (页码，从 1 开始)

```

* 返回接口格式：

```
└─ detail: Object (详情)
   ├─ votes: Array (投票记录)
   │  ├─ vote_id: Number  (投票 ID)
   │  ├─ elector_id: String  (投票人身份证)
   │  ├─ elector_email: String  (投票人邮箱)
   │  ├─ candidate_id: Number  (候选人 ID)
   │  └─ created_at: String  (投票时间)
   ├─ page: Number  (当前页码)
   └─ votesCount: Number  (投票总数)

```


### 接口：投票校验
* 地址：/check
* 类型：POST
* 状态码：200
* 简介：校验投票人是否有资格投票，校验内容包括选举状态、投票 ID 和身份证邮箱格式、该身份证是否已经参与过该选举投票。

如果通过则 200 响应。
* Rap地址：[http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349940](http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349940)
* 请求接口格式：

```
├─ electionId: Number (必选) (选举 ID)
├─ email: String (必选) (邮箱)
└─ electorId: String (必选) (投票人身份证)

```

* 返回接口格式：

```

```


### 接口：投票
* 地址：/votes
* 类型：POST
* 状态码：200
* 简介：
投票时校验投票人是否有资格投票。

校验内容包括选举状态、投票 ID 和身份证邮箱格式、该身份证是否已经参与过该选举投票。
* Rap地址：[http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349941](http://rap2.taobao.org/repository/editor?id=307677&mod=525827&itf=2349941)
* 请求接口格式：

```
├─ electionId: Number (必选) (选举 ID)
├─ email: String (必选) (邮箱)
├─ electorId: String (必选) (投票人身份证)
└─ candidateId: String (必选) (候选人 ID)

```

* 返回接口格式：

```
└─ detail: Array (投票详情)
   ├─ cnt: Number (必选) (票数)
   ├─ candidate_id: Number (必选) (候选人 ID)
   └─ name: String (必选) (候选人姓名)

```