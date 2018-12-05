import store from '../store'

let defaultBeforeClose = function () {
  return new Promise((resolve) => {
    store.dispatch('confirm', {
      title: '确认关闭此页 ？',
      // text: '确认关闭此页 ？',
      text: '未提交的更改将不会保存',
      confirmText: '关闭此页',
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false)
    })
  })
}
export default {
  defaultBeforeClose
}
