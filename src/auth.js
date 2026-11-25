// Who may use the admin endpoints. Users carry a list of exact role names, for example ['support', 'admin'].
// Roles such as 'admin-readonly' or 'billing-admin-viewer' are deliberately NOT admin.
export const ADMIN_ROLE = 'admin';
export function isAdmin(user) {
  return Array.isArray(user?.roles) && user.roles.includes(ADMIN_ROLE);
}

// Parse the demo auth header: "x-demo-user: name;role1,role2". Real systems verify a signed token instead.
export function userFromHeader(value) {
  if (!value) return null;
  const [name, roles = ''] = String(value).split(';');
  return { name: name.trim(), roles: roles.split(',').map(r => r.trim()).filter(Boolean) };
}
