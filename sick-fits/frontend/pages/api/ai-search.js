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

    console.log('Processing AI search for query:', query);

    // Step 1: Use DeepSeek to parse the natural language query into filters
    console.log('Calling DeepSeek to parse query...');
    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `You are a product search assistant. Parse this search query: "${query}"
            
            Extract:
            - keyword: the main search term (e.g., "shirts", "shoes") - remove any price mentions
            - minPrice: minimum price if mentioned (e.g., "over $50" -> 50), otherwise null
            - maxPrice: maximum price if mentioned (e.g., "under $100" -> 100), otherwise null
            
            Return ONLY valid JSON: {"keyword": "...", "minPrice": null, "maxPrice": null}`
          }
        ]
      })
    });

    const deepseekData = await deepseekResponse.json();
    console.log('DeepSeek response:', JSON.stringify(deepseekData));

    if (!deepseekResponse.ok || deepseekData.errors) {
      console.error('DeepSeek Error:', deepseekData.error);
      return res.status(500).json({ message: 'Failed to parse search query' });
    }

    const parsedText = deepseekData.choices[0].message.content;
    console.log('Parsed text:', parsedText);

    const filters = JSON.parse(parsedText);
    console.log('Extracted filters:', filters);

    // Step 2: Query Keystone with the parsed filters
    const keystoneUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    const graphqlEndpoint = `${keystoneUrl}/api/graphql`;

    // Build the where clause based on filters
    const whereConditions = [];

    if (filters.keyword) {
      whereConditions.push({
        OR: [{ name_contains_i: filters.keyword }, { description_contains_i: filters.keyword }]
      });
    }

    if (filters.minPrice !== null && filters.minPrice !== undefined) {
      whereConditions.push({ price_gte: filters.minPrice * 100 });
    }

    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      whereConditions.push({ price_lte: filters.maxPrice * 100 });
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    console.log('Keystone where clause:', JSON.stringify(where));

    const keystoneResponse = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          query SearchProducts($where: ProductWhereInput!) {
            allProducts(where: $where, first: 10) {
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
        variables: { where }
      })
    });

    const keystoneData = await keystoneResponse.json();
    console.log('Keystone response:', JSON.stringify(keystoneData));

    if (!keystoneResponse.ok || keystoneData.errors) {
      console.error('Keystone Error:', keystoneData.errors);
      return res.status(keystoneResponse.status).json({
        message: `Keystone API error: ${keystoneData.errors?.[0]?.message || 'Unknown error'}`
      });
    }

    const products = keystoneData.data?.allProducts || [];
    console.log(`Found ${products.length} products matching filters`);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: `Search failed: ${error.message}` });
  }
}
