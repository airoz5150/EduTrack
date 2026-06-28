// Traduce los códigos de error de Firebase Auth a mensajes en español.
export function traducirErrorAuth(code) {
  const mensajes = {
    'auth/invalid-email': 'El correo no es válido.',
    'auth/user-disabled': 'Esta cuenta está deshabilitada.',
    'auth/user-not-found': 'No existe una cuenta con ese correo.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/email-already-in-use': 'Ese correo ya está registrado.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/too-many-requests': 'Demasiados intentos. Inténtalo más tarde.',
    'auth/network-request-failed': 'Error de red. Revisa tu conexión.',
  }
  return mensajes[code] || 'Ocurrió un error. Inténtalo de nuevo.'
}
