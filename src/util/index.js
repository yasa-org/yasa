export default {
  set: (key, persist) => (state, value) => {
    state[key] = value
    if (persist) {
      localStorage.setItem(key, value)
    }
  }
}
