import { categories, products } from './data';

export async function insertSeedData(ks: any) {
  // Keystone API changed, so we need to check for both versions to get keystone
  const keystone = ks.keystone || ks;
  const adapter = keystone.adapters?.MongooseAdapter || keystone.adapter;

  console.log(
    `🌱 Inserting Seed Data: ${categories.length} Categories and ${products.length} Products`,
  );
  const { mongoose } = adapter;

  // First, create categories and store their IDs
  const categoryMap = new Map();
  for (const category of categories) {
    console.log(`  📁 Adding Category: ${category.name}`);
    const { _id } = await mongoose.model('Category').create(category);
    categoryMap.set(category.slug, _id);
  }

  // Map products to categories based on product type
  const productCategoryMap = {
    'Yeti Hondo': ['t-shirts'],
    'Airmax 270': ['shoes'],
    'KITH Hoodie': ['hoodies'],
    Fanorak: ['outerwear'],
    'Nike Vapormax': ['shoes'],
    'Yeti Cooler': ['accessories'],
    'Naked and Famous Denim': ['t-shirts'],
    'Rimowa Luggage': ['bags'],
    'Black Hole': ['bags'],
    'Nudie Belt': ['accessories'],
    Goose: ['outerwear'],
    Ultraboost: ['shoes'],
  };

  // Then create products with category associations
  for (const product of products) {
    console.log(`  🛍️ Adding Product: ${product.name}`);
    const { _id } = await mongoose
      .model('ProductImage')
      .create({ image: product.photo, altText: product.description });
    product.photo = _id;

    // Add category associations if they exist
    const categorySlugs = productCategoryMap[product.name] || [];
    if (categorySlugs.length > 0) {
      product.categories = categorySlugs
        .map((slug) => categoryMap.get(slug))
        .filter((id) => id)
        .map((id) => ({ connect: { id } }));
    }

    await mongoose.model('Product').create(product);
  }

  console.log(
    `✅ Seed Data Inserted: ${categories.length} Categories and ${products.length} Products`,
  );
  console.log(
    `👋 Please start the process with \`yarn dev\` or \`npm run dev\``,
  );
  process.exit();
}
