/*
 * @Author: cyy
 * @Date: 2020-12-01 13:43:00
 * @LastEditors: cyy
 * @LastEditTime: 2020-12-01 17:08:54
 * @Description:
 */

import GitlabApi from 'gitlab-api-v4'
import { DbOption } from './index.d'

export default class Gitlab {
  private gitLabApi
  private options
  constructor (options:DbOption) {
    this.options = options
    this.gitLabApi = new GitlabApi({
      api: options.url,
      privateToken: options.token
    })
  }

  createFile (dbName: string, content: string) {
    return this.gitLabApi.repositoryFile.create({
      id: this.options.projectID,
      file_path: dbName + '.json',
      branch: 'master',
      commit_message: 'create file',
      content
    })
  }

  async getFileContent (dbName:string) {
    const res = await this.gitLabApi.repositoryFile.get({
      id: this.options.projectID,
      file_path: dbName + '.json',
      ref: 'master'
    })
    if (res.content) {
      try {
        const content = Buffer.from(res.content, 'base64').toString()
        return JSON.parse(content)
      } catch (e) {
        return []
      }
    } else if (res.message && res.message.startsWith('404')) {
      await this.createFile(dbName, '[]')
      return []
    }
    return Promise.reject(res)
  }

  async writeFileContent (dbName: string, content: string) {
    let res = await this.gitLabApi.repositoryFile.update({
      id: this.options.projectID,
      file_path: dbName + '.json',
      branch: 'master',
      commit_message: 'update file',
      content
    })
    if (res.message && res.message.includes('doesn\'t exist')) {
      res = await this.createFile(dbName, content)
    }
    return res
  }
}
