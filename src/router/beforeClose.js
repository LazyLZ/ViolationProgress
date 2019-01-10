import store from '../store/index'

let defaultBeforeClose = function () {
  return new Promise((resolve) => {
    store.dispatch('confirm', {
      title: '确认关闭此页 ？',
      // text: '确认关闭此页 ？',
      text: '未提交的更改将不会保存',
      confirmText: '关闭此页',
      onConfirm: r => {
        resolve(true)
        r()
      },
      onCancel: r => {
        resolve(false)
        r()
      }
    })
  })
}
export default {
  defaultBeforeClose
}
