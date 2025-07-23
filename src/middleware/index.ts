/** Get user data from header */
export { default as DeserializeUser } from '@/Middleware/DeserializeUser';

/** Check if the data format is okay with the given schema */
export { default as ValidateResource } from '@/Middleware/ValidateResource';

/** Check the role of user data inside the req.locales.user */
export { default as CheckPermission } from '@/Middleware/CheckPermission';
