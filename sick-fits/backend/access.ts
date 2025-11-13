// AT it's simplest, the access control returns a yes or no value depending on the users session

import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permission checkers - yes or no
export const permissions = {
  ...generatedPermissions,
  isAwesome({ session }: ListAccessArgs): boolean {
    return session?.data.name.includes("Owen");
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
    // 1. Do they have permission to manage products
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. if not, do they own this product?
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
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // They can read everything
    }
    // they should only see available products (based on status field)
    return { status: "AVAILABLE" };
  },
};
