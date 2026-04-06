export function isAdmin(role) {
  return role === "admin";
}

export function isSeller(role) {
  return role === "seller" || role === "admin";
}