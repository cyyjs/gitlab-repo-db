import Gitlab from '../src/gitlab'
import config from './config';
const gitlab = new Gitlab(config)

describe('gitlab is ok', () => {
  test.skip('get file', () => {
    gitlab.getFileContent('f/a').then(res => {
      expect(res).toBeInstanceOf(Array)
    })
  })

  test('write file', () => {
    gitlab.writeFileContent('a/b', 'a').then(res => {
      expect(res.file_path).toBeDefined()
    })
  })
})
