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
    // Use GraphQL API to find cart items - this properly handles relationship filters
    // and access control in production
    const graphqlResult = await context.graphql.run({
      query: `
        query GetUserCartItems($userId: ID!, $productId: ID!) {
          allCartItems(where: { user: { id: $userId }, product: { id: $productId } }) {
            id
            quantity
            product {
              id
            }
          }
        }
      `,
      variables: {
        userId: sesh.itemId,
        productId: productId,
      },
    });
    allCartItems = graphqlResult.allCartItems || [];
    console.log('All cart items for user and product:', allCartItems);
  } catch (error: any) {
    console.error('Error finding cart items via GraphQL:', error);
    console.log('Session itemId:', sesh.itemId);
    console.log('Product ID:', productId);

    // Fallback: use context.lists to get all cart items for the user
    try {
      console.log('Falling back to context.lists...');
      allCartItems = await context.lists.CartItem.findMany({
        where: {
          user: { id: sesh.itemId },
        },
      });
      console.log('All cart items for user:', allCartItems);

      // Filter in JS by checking each item's product relationship
      const filteredItems = [];
      for (const item of allCartItems) {
        // Use GraphQL to get the full item with product relationship
        const fullItemResult = await context.graphql.run({
          query: `
            query GetCartItem($id: ID!) {
              CartItem(where: { id: $id }) {
                id
                quantity
                product {
                  id
                }
              }
            }
          `,
          variables: { id: item.id },
        });
        const fullItem = fullItemResult.CartItem;
        // Check if product matches - product could be an object with id or just an id string
        const itemProductId =
          fullItem?.product?.id || fullItem?.product || null;
        if (itemProductId && String(itemProductId) === String(productId)) {
          filteredItems.push(fullItem);
        }
      }
      allCartItems = filteredItems;
      console.log('Filtered cart items for product (JS):', allCartItems);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw error; // Throw the original error
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
