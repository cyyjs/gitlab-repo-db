/*
 * @Author: cyy
 * @Date: 2020-12-01 13:29:10
 * @LastEditors: cyy
 * @LastEditTime: 2020-12-01 15:26:57
 * @Description: gitlabDB
 */

import { DbOption } from './index.d'
import GitLab from './gitlab'
import Collection from './collection'

class GitlibDB {
  private gitlab: GitLab
  constructor (option: DbOption) {
    this.gitlab = new GitLab(option)
  }

  collection (dbName: string) {
    return new Collection(dbName, this.gitlab)
  }
}

export default GitlibDB
 
 