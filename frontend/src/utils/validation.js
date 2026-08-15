export function validateName(name) {
  if (!name || name.trim().length < 20) return 'Name must be at least 20 characters'
  if (name.trim().length > 60) return 'Name must be at most 60 characters'
  return ''
}

export function validateStoreName(name) {
  if (!name || name.trim().length === 0) return 'Store name is required'
  if (name.trim().length > 100) return 'Store name must be at most 100 characters'
  return ''
}

export function validateAddress(address) {
  if (!address || address.trim().length === 0) return 'Address is required'
  if (address.trim().length > 400) return 'Address must be at most 400 characters'
  return ''
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !re.test(email)) return 'Enter a valid email address'
  return ''
}

export function validatePassword(password) {
  if (!password || password.length < 8 || password.length > 16) {
    return 'Password must be 8-16 characters'
  }
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter'
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/.test(password)) {
    return 'Password must include a special character'
  }
  return ''
}

export function validateRating(rating) {
  const n = Number(rating)
  if (!n || n < 1 || n > 5) return 'Rating must be between 1 and 5'
  return ''
}