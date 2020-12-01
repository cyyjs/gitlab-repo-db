import GitlabDB from '../src/index'
import config from './config';
const DB = new GitlabDB(config)

describe('DB is ok', () => {
  test.skip('get data', () => {
    DB.collection('c').find().then(res => {
      expect(res).toBeInstanceOf(Array)
    })
  })
  test('get one data', () => {
    DB.collection('c').findOne().then(res => {
      expect(res).toBeInstanceOf(Object)
    })
  })
  test.skip('save data', () => {
    DB.collection('c').insert([{a:2}]).then(res => {
      expect(res).toBeDefined()
    })
  })

  test.skip('update data', () => {
    DB.collection('c').update({
      d: 2
    }, {
      c: 2
    }, {
      multi: true,
      upsert: true
    }).then(res => {
      expect(res).toBeDefined()
    })
  })

  test.skip('remove all data', () => {
    DB.collection('c').remove().then(res => {
      expect(res).toBeDefined()
    })
  })
})
