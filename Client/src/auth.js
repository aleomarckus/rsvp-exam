export const USER_KEY = 'username'

export function getUsername() {
  return localStorage.getItem(USER_KEY)
}
export function setUsername(u) {
  localStorage.setItem(USER_KEY, (u || '').trim())
}
export function clearUsername() {
  localStorage.removeItem(USER_KEY)
}