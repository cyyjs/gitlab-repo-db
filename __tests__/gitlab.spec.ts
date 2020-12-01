import Gitlab from '../src/gitlab'
import config from './config';
const gitlab = new Gitlab(config)

describe('gitlab is ok', () => {
  test('get file', () => {
    gitlab.getFileContent('a').then(res => {
      expect(res).toBe('a')
    })
  })

  test('write file', () => {
    gitlab.writeFileContent('b', 'a').then(res => {
      expect(res.file_path).toBeDefined()
    })
  })
})
