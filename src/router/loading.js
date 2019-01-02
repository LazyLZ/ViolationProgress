import store from '@/store/'
export function startLoading () {
  store.commit('$L/setPageLoading', true)
}
export function stopLoading () {
  store.commit('$L/setPageLoading', false)
}
