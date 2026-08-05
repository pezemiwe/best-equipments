import { listProducts, updateProduct } from '../src/server/productStore';
import { listCategories } from '../src/server/categoryStore';

async function main() {
  const args = process.argv.slice(2);
  let assignTo = '';
  if (args[0] === '--assign' && args[1]) {
    assignTo = args[1];
  }

  console.log('Loading products and categories...');
  const products = await listProducts();
  const categories = await listCategories();
  const validCategoryValues = new Set(categories.map((c) => c.value));

  const strandedProducts = products.filter((p) => !validCategoryValues.has(p.category));

  if (strandedProducts.length === 0) {
    console.log('No stranded products found! All products have valid categories.');
    process.exit(0);
  }

  console.log(`Found ${strandedProducts.length} products with invalid categories.`);
  for (const p of strandedProducts) {
    console.log(`- Product: "${p.name}" (ID: ${p.id}) has invalid category: "${p.category}"`);
  }

  if (assignTo) {
    if (!validCategoryValues.has(assignTo)) {
      console.error(`\nError: The specified --assign category "${assignTo}" does not exist in the database!`);
      process.exit(1);
    }
    console.log(`\nReassigning ${strandedProducts.length} stranded products to "${assignTo}"...`);
    let count = 0;
    for (const p of strandedProducts) {
      await updateProduct(p.id, { category: assignTo });
      count++;
    }
    console.log(`Done. ${count} rows affected.`);
  } else {
    console.log('\nRun this script with --assign <valid_category_value> to repair these products.');
  }
}

main().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
