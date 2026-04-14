import { relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const Category = list({
  access: {
    create: isSignedIn,
    read: true, // Everyone can read categories
    update: rules.canManageProducts, // Use same rules as product management for now
    delete: rules.canManageProducts,
  },
  fields: {
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    slug: text({
      isRequired: true,
      isUnique: true,
      ui: {
        createView: { fieldMode: 'hidden' },
      },
    }),
    products: relationship({
      ref: 'Product.categories',
      many: true,
    }),
    // Optional: Add image for category banners
    image: relationship({
      ref: 'ProductImage',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'slug', 'products'],
    },
  },
});
