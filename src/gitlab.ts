/*
 * @Author: cyy
 * @Date: 2020-12-01 13:43:00
 * @LastEditors: cyy
 * @LastEditTime: 2020-12-02 13:09:38
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
      file_path: encodeURIComponent(dbName) + '.json',
      branch: 'master',
      commit_message: 'create file',
      content
    })
  }

  async getFileContent (dbName:string) {
    const res = await this.gitLabApi.repositoryFile.get({
      id: this.options.projectID,
      file_path: encodeURIComponent(dbName) + '.json',
      ref: 'master'
    })
    if (res.content) {
      try {
        const content = Buffer.from(res.content, 'base64').toString()
        return JSON.parse(content)
      } catch (e) {
        return []
      }
    }
    const message = res.message || res.error
    if (message && message.startsWith('404')) {
      await this.createFile(dbName, '[]')
      return []
    }
    return Promise.reject(res)
  }

  async writeFileContent (dbName: string, content: string) {
    let res = await this.gitLabApi.repositoryFile.update({
      id: this.options.projectID,
      file_path: encodeURIComponent(dbName) + '.json',
      branch: 'master',
      commit_message: 'update file',
      content
    })
    const message = res.message || res.error
    if (message && (message.includes('doesn\'t exist') || message.startsWith('404'))) {
      res = await this.createFile(dbName, content)
    }
    return res
  }
}
