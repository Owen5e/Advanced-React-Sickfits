// pages/api/ai-search.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    console.log('Searching Keystone for query:', query);

    const keystoneUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    const graphqlEndpoint = `${keystoneUrl}/api/graphql`;

    // Query Keystone GraphQL for products matching the search term
    const response = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query SearchProducts($searchTerm: String!) {
            allProducts(
              where: {
                OR: [
                  { name_contains_i: $searchTerm }
                  { description_contains_i: $searchTerm }
                ]
              }
              first: 10
            ) {
              id
              name
              description
              price
              photo {
                image {
                  publicUrlTransformed
                }
              }
            }
          }
        `,
        variables: {
          searchTerm: query
        }
      })
    });

    const data = await response.json();
    console.log('Keystone response:', JSON.stringify(data));

    if (!response.ok || data.errors) {
      console.error('Keystone Error:', data.errors);
      return res.status(response.status).json({
        message: `Keystone API error: ${data.errors?.[0]?.message || 'Unknown error'}`
      });
    }

    const products = data.data?.allProducts || [];
    console.log(`Found ${products.length} products`);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: `Search failed: ${error.message}` });
  }
}
