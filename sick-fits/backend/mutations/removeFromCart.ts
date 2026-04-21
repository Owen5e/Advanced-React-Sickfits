/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { Session } from '../types';

export default async function removeFromCart(
  root: any,
  { id }: { id: string },
  context: KeystoneContext,
): Promise<any> {
  console.log('Removing from cart!! ID:', id);

  // 1. Check if user is signed in
  const sesh = context.session as Session;
  console.log('Session:', sesh);
  console.log('Session itemId:', sesh?.itemId);
  if (!sesh || !sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }

  // 2. Check if the cart item belongs to the current user
  // We'll use findMany with a filter to ensure the user owns this cart item
  console.log('Checking if user owns cart item...');
  const userCartItems = await context.lists.CartItem.findMany({
    where: {
      user: { id: sesh.itemId },
      id: id,
    },
  });

  console.log('Found cart items:', userCartItems.length);

  if (userCartItems.length === 0) {
    console.log('User does not own this cart item or it does not exist');
    throw new Error('You do not have access to this resource');
  }

  // 3. Delete the cart item
  try {
    console.log('Deleting cart item...');
    const result = await context.lists.CartItem.deleteOne({
      id,
    });
    console.log('Delete result:', result);
    return result;
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw new Error('Failed to remove item from cart. Please try again.');
  }
}
