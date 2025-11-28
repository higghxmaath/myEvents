export function requireAuth(isAuthenticated, navigate, target) {
  if (!isAuthenticated) {
    navigate("/login", { state: { from: target } });
    return false;
  }
  return true;
}
