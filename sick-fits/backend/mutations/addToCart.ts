/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext,
): Promise<any> {
  console.log('Adding to cart!!');
  // 1   query the current user, see if they are signed in
  const sesh = context.session as Session;
  if (!sesh || !sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2 query the current user's cart
  let allCartItems;
  try {
    // Try to find cart items for this user AND this product
    // Using simpler syntax without 'equals'
    allCartItems = await context.lists.CartItem.findMany({
      where: {
        user: { id: sesh.itemId },
        product: { id: productId },
      },
    });
    console.log('All cart items for user and product:', allCartItems);
  } catch (error: any) {
    console.error('Error finding cart items:', error);
    console.log('Session itemId:', sesh.itemId);
    console.log('Product ID:', productId);

    // If we get a permission error, fall back to fetching all and filtering in JS
    if (
      error.message?.includes('access') ||
      error.message?.includes('permission') ||
      error.message?.includes('You do not have access')
    ) {
      console.log('Permission error, falling back to JS filtering...');
      // Fetch all cart items for the user
      allCartItems = await context.lists.CartItem.findMany({
        where: {
          user: { id: sesh.itemId },
        },
      });
      console.log('All cart items for user:', allCartItems);

      // We need to fetch each product separately since we can't include it in the query
      // This is inefficient but works
      const filteredItems = [];
      for (const item of allCartItems) {
        // Fetch the full cart item with product relationship using findOne
        // Note: We can't use query parameter, so we'll get whatever fields are returned
        const fullItem = await context.lists.CartItem.findOne({
          where: { id: item.id },
        });
        // We need to check if fullItem has product relationship
        // Since we can't specify fields, we'll assume it includes product
        if (fullItem && fullItem.product && fullItem.product.id === productId) {
          filteredItems.push(fullItem);
        }
      }
      allCartItems = filteredItems;
      console.log('Filtered cart items for product (JS):', allCartItems);
    } else {
      throw error;
    }
  }

  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log('Existing cart item:', existingCartItem);

    // Use GraphQL directly to get the current quantity
    // This ensures we get the quantity field
    const graphqlResult = await context.graphql.run({
      query: `
        query GetCartItem($id: ID!) {
          CartItem(where: { id: $id }) {
            id
            quantity
          }
        }
      `,
      variables: { id: existingCartItem.id },
    });

    const cartItemWithQuantity = graphqlResult.CartItem;
    console.log('Cart item with quantity from GraphQL:', cartItemWithQuantity);

    const currentQuantity = cartItemWithQuantity?.quantity || 1;
    console.log('Current quantity:', currentQuantity);

    // 3 see if the item is already in their cart
    // 4 if it is, increment by 1
    const newQuantity = currentQuantity + 1;
    console.log('Updating cart item with new quantity:', newQuantity);

    // Use GraphQL directly to update with the new quantity
    const updateResult = await context.graphql.run({
      query: `
        mutation UpdateCartItem($id: ID!, $quantity: Int!) {
          updateCartItem(id: $id, data: { quantity: $quantity }) {
            id
            quantity
          }
        }
      `,
      variables: { id: existingCartItem.id, quantity: newQuantity },
    });

    console.log('Update result:', updateResult);
    return updateResult.updateCartItem;
  }
  // 5 if it is not, create a new cart item for that user
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
  });
}
