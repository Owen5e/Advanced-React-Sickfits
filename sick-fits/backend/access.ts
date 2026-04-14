// AT it's simplest, the access control returns a yes or no value depending on the users session

import { Permission, permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

// Create a type for the permissions object
type PermissionsObj = {
  [key in Permission]: ({ session }: ListAccessArgs) => boolean;
} & {
  isAwesome: ({ session }: ListAccessArgs) => boolean;
};

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ]),
) as { [key in Permission]: ({ session }: ListAccessArgs) => boolean };

// Permission checkers - yes or no
export const permissions: PermissionsObj = {
  ...generatedPermissions,
  isAwesome({ session }: ListAccessArgs): boolean {
    return session?.data?.name?.includes('Owen') || false;
  },
};

// Rule based access control
// Rules can return a boolean or a filter which limits which items they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have permission to manage products
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. if not, do they own this product?
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have permission to manage cart
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. Otherwise, they can only manage their own cart items
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have permission to manage products
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. if not, do they own this product?
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true; // They can read everything
    }
    // Everyone else (including unauthenticated users) should only see available products
    return { status: 'Available' };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have permission to manage users
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // 2. otherwise they can only update themselves
    return { id: session.itemId };
  },
  canManageCategories({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have permission to manage categories
    if (permissions.canManageCategories({ session })) {
      return true;
    }
    // 2. For now, use same rules as product management
    // In the future, we might want different rules
    return false;
  },
};
