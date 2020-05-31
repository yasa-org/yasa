export default {
  set: (key: string, persist = false) => (state: any, value: any) => {
    state[key] = value
    if (persist) {
      localStorage.setItem(key, value)
    }
  }
}
