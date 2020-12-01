/*
 * @Author: cyy
 * @Date: 2020-12-01 13:53:14
 * @LastEditors: cyy
 * @LastEditTime: 2020-12-01 16:53:28
 * @Description: utils
 */
import { v1 } from 'uuid'

export const getId = () => {
  return v1().replace(/-/g, '')
}

export const initDoc = (data: object) => {
  return {
    ...data,
    _id: getId()
  }
}
