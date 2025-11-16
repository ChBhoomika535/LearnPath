import axios from 'axios';

export async function generatePrerequisites(topic: string): Promise<string[]> {
  try {
    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('❌ OPENROUTER_API_KEY is not set in environment variables');
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('OPEN') || k.includes('API')));
      throw new Error('API key not configured. Please set OPENROUTER_API_KEY in your .env file.');
    }

    // Verify API key is not empty
    if (process.env.OPENROUTER_API_KEY.trim() === '') {
      console.error('❌ OPENROUTER_API_KEY is empty');
      throw new Error('API key is empty. Please set a valid OPENROUTER_API_KEY in your .env file.');
    }

    console.log('⏳ Asking GPT-4o via OpenRouter for topic:', topic);

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o',
        max_tokens: 100, // Reduced to avoid credit issues
        messages: [
          {
            role: 'user',
            content: `
You are an expert computer science curriculum designer.

A student wants to learn the topic: "${topic}".  
Your task is to return **only the essential prerequisite concepts** the student must clearly understand *before* learning it.

🔒 STRICT RULES:
- DO NOT include the topic "${topic}" or any of its subtopics (e.g., SQL for DBMS, CNN for Deep Learning).
- DO NOT include advanced or future concepts.
- DO NOT repeat vague/general concepts (like both "Math" and "Set Theory").
- DO NOT include explanations or descriptions — just topic names.
- DO NOT return fewer than 4 or more than 7 items.

✅ Focus only on foundational, truly required concepts that directly prepare a student to understand "${topic}".

📄 Output format:
1. Topic A  
2. Topic B  
3. Topic C  
...  
(Maximum 7 topics, Minimum 4 if fewer are needed)
`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const content: string = response.data.choices[0]?.message?.content ?? '';
    console.log('✅ GPT Response:', content);

    if (!content || content.trim().length === 0) {
      console.error('❌ Empty response from API');
      throw new Error('Empty response from API');
    }

    // Parse the response - handle various formats
    let list = content
      .split('\n')
      .map((line: string) => {
        // Remove numbering (1., 2., etc.)
        let cleaned = line.replace(/^\d+[\.\)]\s*/, '').trim();
        // Remove markdown formatting
        cleaned = cleaned.replace(/^[-*]\s*/, '').trim();
        // Remove any trailing punctuation that might be part of formatting
        cleaned = cleaned.replace(/^[:\-]\s*/, '').trim();
        return cleaned;
      })
      .filter((line: string) => {
        // Filter out empty lines and lines that are too short or look like formatting
        return line.length > 2 && 
               !line.match(/^(topic|prerequisite|concept)/i) &&
               !line.match(/^[⚠️❌✅🔒📄🧠📌]/);
      });

    // If we still don't have enough items, try a different parsing approach
    if (list.length < 4) {
      // Try splitting by common separators
      const altList = content
        .split(/[,;]/)
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 2);
      
      if (altList.length > list.length) {
        list = altList;
      }
    }

    if (list.length === 0) {
      console.error('❌ Could not parse prerequisites from response:', content);
      throw new Error('Could not parse prerequisites from API response');
    }

    console.log('✅ Parsed prerequisites:', list);
    return list;
  } catch (error: any) {
    console.error('❌ GPT API error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });

    // Provide more specific error messages
    if (error.message?.includes('API key')) {
      throw new Error('API key not configured. Please contact the administrator.');
    } else if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please contact the administrator.');
    } else if (error.response?.status === 402) {
      // Payment required - insufficient credits
      const errorMsg = error.response?.data?.error?.message || 'Insufficient API credits';
      throw new Error(`API credits insufficient: ${errorMsg}. Please upgrade your account or reduce max_tokens.`);
    } else if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    } else if (error.response?.data?.error) {
      throw new Error(`API error: ${error.response.data.error.message || error.response.data.error}`);
    } else {
      throw new Error(`Failed to generate prerequisites: ${error.message || 'Unknown error'}`);
    }
  }
}



///2nd version
// import axios from 'axios';

// export async function generatePrerequisites(topic: string): Promise<string[]> {
//   try {
//     console.log('⏳ Asking GPT-4o via OpenRouter for topic:', topic);

//     const response = await axios.post(
//       'https://openrouter.ai/api/v1/chat/completions',
//       {
//         model: 'openai/gpt-4o',
//         max_tokens: 200,
//         messages: [
//           {
//             role: 'user',
//             content: `
// You are an expert computer science curriculum designer.

// A student wants to learn the topic: "${topic}".  
// Your task is to identify **only the essential prerequisite concepts** that a student must clearly understand *before* learning this topic.

// 🧠 Think carefully — return only topics that are genuinely foundational and required for learning "${topic}".  
// Do NOT list the topic itself or any of its subtopics.

// 📌 Rules:
// - Return a list of 4 to 7 items, but only include what is truly relevant.
// - If fewer than 7 are valid, return fewer — do NOT invent or pad.
// - Do NOT include vague/general items like both "Math" and "Set Theory" (combine them if needed).
// - Do NOT explain the topics — just list the names.
// - Do NOT include future or internal topics like "SQL" for DBMS or "CNN" for ML.

// 📄 Output format:
// 1. Topic A  
// 2. Topic B  
// ...
// (Maximum 7 clean, relevant prerequisite topics only)
//  `,
//           },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const rawContent: string = response.data.choices[0]?.message?.content ?? '';
//     console.log('✅ GPT Response:\n', rawContent);

//     const initialList = rawContent
//       .split('\n')
//       .map((line: string) => line.replace(/^\d+\.?\s*/, '').split(':')[0].trim())
//       .filter(Boolean);

//     const topicLower = topic.toLowerCase();

//     const bannedSubtopics: Record<string, string[]> = {
//       'database management systems': ['sql', 'normalization', 'transactions'],
//       'theory of computation': ['automata', 'formal languages'],
//       'machine learning': ['cnn', 'rnn', 'deep learning'],
//     };

//     const banned = [
//       topicLower,
//       ...(bannedSubtopics[topicLower] || []),
//     ];

//     // Deduplicate + filter
//     const seen = new Set<string>();
//     const finalList = initialList.filter((item) => {
//       const clean = item.toLowerCase();
//       if (seen.has(clean)) return false;
//       seen.add(clean);
//       return !banned.some(b => clean.includes(b));
//     });

//     return finalList.length >= 4 ? finalList : finalList;
//   } catch (error: any) {
//     console.error('❌ GPT API error:\n', error?.response?.data || error.message);
//     return ['⚠️ Unable to generate prerequisites. Try another topic.'];
//   }
// }