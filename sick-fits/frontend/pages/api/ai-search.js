// pages/api/ai-search.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    console.log("Sending request to OpenAI for query:", query);

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat", // DeepSeek model
          messages: [
            {
              role: "user",
              content: `
              You are a product search assistant.
              For the query: "${query}"
              - Set keyword to the main search term (remove any price mentions).
              - If a maximum price is mentioned (e.g., under $100), set maxPrice to that number.
              - If a minimum price is mentioned (e.g., over $50), set minPrice to that number.
              - Otherwise, set minPrice and maxPrice to null.
              Return ONLY valid JSON: {"keyword": "...", "minPrice": null, "maxPrice": null}
            `,
            },
          ],
        }),
      },
    );

    const data = await response.json();
    console.log("OpenAI response status:", response.status);
    console.log("OpenAI response data:", data);

    if (!response.ok) {
      throw new Error(
        `OpenAI API error: ${data.error?.message || "Unknown error"}`,
      );
    }

    const text = data.choices[0].message.content; // Correct response parsing
    console.log("AI response text:", text);
    const filters = JSON.parse(text);
    console.log("Parsed filters:", filters);
    res.status(200).json(filters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI processing failed" });
  }
}
