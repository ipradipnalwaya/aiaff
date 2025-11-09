import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ContentGenerationParams {
  productName: string;
  productDescription: string;
  affiliateUrls: string[];
  resourceContent: string;
  tone: string;
  targetAudience?: string;
  wordCount: string;
}

export async function generateAffiliateContent(params: ContentGenerationParams): Promise<{ plainText: string; html: string }> {
  const {
    productName,
    productDescription,
    affiliateUrls,
    resourceContent,
    tone,
    targetAudience,
    wordCount,
  } = params;

  const systemPrompt = `You are an expert SEO content writer and affiliate marketer. Your task is to create compelling, profit-driven blog content that converts readers into customers. Focus on persuasive writing that follows proven marketing frameworks.

Key requirements:
- Write in a ${tone} tone
- Target approximately ${wordCount} words
- Create content that drives action and conversions
- Use natural, engaging language that builds trust
- Incorporate SEO best practices
- Make affiliate links feel organic, not forced`;

  const userPrompt = `Create a comprehensive affiliate blog post about: ${productName}

Product Description:
${productDescription}

${targetAudience ? `Target Audience: ${targetAudience}` : ''}

Source Material/Research:
${resourceContent}

Affiliate Links to integrate naturally:
${affiliateUrls.join('\n')}

Structure your content with these sections:
1. Attention-grabbing headline and introduction
2. What it is - Clear explanation of the product
3. Why it matters - Benefits and value proposition  
4. How it works - Features and functionality
5. Who it's for - Ideal customer profile
6. Use cases - Real-world applications
7. Pros & Cons - Honest balanced review
8. Alternatives - Brief comparison with competitors
9. FAQs - Address common questions
10. Strong conclusion with clear call-to-action

Important guidelines:
- Make the content genuinely helpful, not just promotional
- Integrate affiliate links naturally (2-4 times throughout)
- Use compelling headlines and subheadings
- Include specific details and examples
- End with an urgent but authentic call-to-action
- Write with personality and authentic voice

Provide TWO versions:
1. PLAIN TEXT - Clean, readable format with markdown-style headings (#, ##)
2. HTML - Properly formatted HTML with semantic tags, affiliate links with target="_blank" and rel="nofollow"

Format your response as:
---PLAINTEXT---
[plain text version here]
---HTML---
[html version here]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{
        role: "user",
        parts: [{ text: userPrompt }]
      }],
      config: {
        systemInstruction: {
          role: "system",
          parts: [{ text: systemPrompt }]
        },
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    // Extract text from response
    let fullText = "";
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        fullText = candidate.content.parts
          .map((part: any) => part.text || "")
          .join("");
      }
    }
    
    if (!fullText) {
      throw new Error("No content generated from Gemini API");
    }
    
    // Parse the response to separate plain text and HTML
    const plainTextMatch = fullText.match(/---PLAINTEXT---\s*([\s\S]*?)\s*---HTML---/);
    const htmlMatch = fullText.match(/---HTML---\s*([\s\S]*?)$/);
    
    const plainText = plainTextMatch ? plainTextMatch[1].trim() : fullText;
    const html = htmlMatch ? htmlMatch[1].trim() : "";

    return {
      plainText,
      html: html || formatPlainTextToHtml(plainText),
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Fallback function to convert plain text to basic HTML if Gemini doesn't provide HTML
function formatPlainTextToHtml(plainText: string): string {
  return plainText
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return `<h1>${trimmed.substring(2)}</h1>`;
      } else if (trimmed.startsWith('## ')) {
        return `<h2>${trimmed.substring(3)}</h2>`;
      } else if (trimmed.startsWith('### ')) {
        return `<h3>${trimmed.substring(4)}</h3>`;
      } else if (trimmed.startsWith('- ')) {
        return `<li>${trimmed.substring(2)}</li>`;
      } else if (trimmed === '') {
        return '<br>';
      } else {
        return `<p>${trimmed}</p>`;
      }
    })
    .join('\n');
}
