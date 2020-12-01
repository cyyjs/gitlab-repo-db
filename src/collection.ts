/*
 * @Author: cyy
 * @Date: 2020-12-01 13:29:10
 * @LastEditors: cyy
 * @LastEditTime: 2020-12-01 18:27:42
 * @Description: collection
 */
import GitLab from './gitlab'
import Mingo from 'mingo'
import { initDoc } from './utils'
import { DbUpdateOption } from './index.d'

export default class Collection {
  private dbName: string
  private gitlab: GitLab
  constructor (dbName: string, gitlab: GitLab) {
    this.dbName = dbName
    this.gitlab = gitlab
  }

  private async _getFileContent () {
    const content = <Array<any>> await this.gitlab.getFileContent(this.dbName)
    return content
  }

  private _writeFileContent (content: Array<object>) {
    return this.gitlab.writeFileContent(this.dbName, JSON.stringify(content))
  }

  async find (query = {}) {
    const content = await this._getFileContent()
    const Query = new Mingo.Query(query)
    const cursor = Query.find(content)
    return cursor.all()
  }

  async findOne (query = {}) {
    const content = await this._getFileContent()
    const Query = new Mingo.Query(query)
    const cursor = Query.find(content)
    return cursor.next()
  }

  async insert (doc: object | Array<object>) {
    const docs = Array.isArray(doc) ? doc : [doc]
    const newDocs = docs.map(item => initDoc(item))
    const content = await this._getFileContent()
    const newContent = content.concat(newDocs)
    await this._writeFileContent(newContent)
    return newDocs.length > 1 ? newDocs : newDocs[0]
  }

  async remove (query = {}) {
    const content = await this._getFileContent()
    const remaining = new Mingo.Query(query).remove(content)
    await this._writeFileContent(remaining)
    return remaining.length
  }

  async update (query = {}, doc:any = {}, options:DbUpdateOption = {}) {
    if (doc._id) {
      delete doc._id
    }
    const contentAll = await this._getFileContent()
    let newQuery = query
    const updateContent = await this.find(newQuery)
    let newContent = []

    // 非批量
    if (!options.multi && updateContent.length) {
      newQuery = {
        _id: updateContent[0]._id
      }
      newContent.push({
        ...updateContent[0],
        ...doc
      })
    } else {
      newContent = updateContent.map(item => {
        return {
          ...item,
          ...doc
        }
      })
    }

    const remaining = new Mingo.Query(newQuery).remove(contentAll)
    const result = newContent.concat(remaining)
    let length = newContent.length
    // 无更新，插入新数据
    if (!length && options.upsert) {
      result.push(initDoc(doc))
      length = 1
    }
    await this._writeFileContent(result)
    return length
  }
}
