## gitlab-db

基于Gitlab 仓库文件存储的数据库

### 安装

```bash
yarn add gitlab-repo-db
```

### 使用

```js
const DB = new GitlabDB({
  url: 'your gitlab api url',
  projectID: 'repo project id',
  token: 'your gitlab token'
})

const collection = DB.collection('test')


const query = {
  a: 1
}

// find all
collection.find(query)

// find one
collection.findOne(query)

// insert one
collection.insert({
  b: 1
})

// insert multiple
collection.insert([{
  b: 1
}, {
  c: 1
}])

// update
const updateData = {
  c: 1
}

const updateOption = {
  multi: true, // default: false
  upsert: true // default: false
} 

collection.update(query, updateData, option)

// remove all
collection.remove(query)
```
