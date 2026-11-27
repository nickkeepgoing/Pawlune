export const USERNAME_RE = /^[a-z0-9_.]{3,20}$/;
export const normUsername = (s: string) => s.trim().toLowerCase();
export const USERNAME_HINT = 'ภาษาอังกฤษตัวเล็ก ตัวเลข _ หรือ . ยาว 3–20 ตัว';
