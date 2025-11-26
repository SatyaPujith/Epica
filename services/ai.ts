
import { GoogleGenAI, Type } from "@google/genai";
import { Book, Chapter } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const imageAI = new GoogleGenAI({ apiKey: process.env.IMAGE_API_KEY });

// Helper function to add delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry API calls with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 2000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (i > 0) {
        const waitTime = initialDelay * Math.pow(2, i - 1);
        console.log(`⏳ Rate limited. Waiting ${waitTime / 1000}s before retry ${i}/${maxRetries}...`);
        await delay(waitTime);
      }
      return await fn();
    } catch (error: any) {
      lastError = error;
      const is429 = error?.message?.includes('429') || error?.status === 429;
      const is503 = error?.message?.includes('503') || error?.status === 503;
      
      if ((is429 || is503) && i < maxRetries - 1) {
        console.warn(`⚠️ Rate limit hit (attempt ${i + 1}/${maxRetries})`);
        continue;
      }
      throw error;
    }
  }
  
  throw lastError;
}

// -- 1. The Architect: Generates the Table of Contents --
export async function generateOutline(
  title: string, 
  synopsis: string, 
  genre: string, 
  style: string
): Promise<{ chapters: Chapter[], quote: string }> {
  const prompt = `
    Act as a master novelist and editor. I need a detailed chapter outline for a book.
    
    Title: ${title}
    Genre: ${genre}
    Writing Style: ${style}
    Premise: ${synopsis}
    
    Requirements:
    - Create exactly 12 chapters.
    - The story must have a strong arc: Setup, Inciting Incident, Rising Action, Climax, Resolution.
    - Ensure high suspense and emotional depth.
    - Generate a profound, poetic quote that captures the theme of this book (it can be a fake quote from a fictional character in the book or a made-up philosopher).
    - Return strictly JSON.
  `;

  const response = await retryWithBackoff(() => 
    ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Creative title for the chapter" },
                  summary: { type: Type.STRING, description: "A 2-sentence summary of what happens in this chapter." }
                },
                required: ["title", "summary"]
              }
            },
            quote: {
              type: Type.STRING,
              description: "A thematic quote representing the soul of the book."
            }
          },
          required: ["chapters", "quote"]
        }
      }
    })
  );

  const data = JSON.parse(response.text || "{}");
  const chapters = (data.chapters || []).map((item: any, index: number) => ({
    number: index + 1,
    title: item.title,
    content: "",
    summary: item.summary,
    isFinished: false
  }));

  return {
    chapters,
    quote: data.quote || `"${title} is a journey into the unknown."`
  };
}

// -- 2. The Author: Writes a single chapter based on context --
export async function writeChapter(
  book: Book, 
  chapterIndex: number, 
  previousChapterSummary: string
): Promise<{ content: string; newSummary: string }> {
  
  const currentChapter = book.chapters[chapterIndex];
  
  const prompt = `
    You are an award-winning author writing a masterpiece. Write Chapter ${currentChapter.number}: "${currentChapter.title}".
    
    **Book Context:**
    Title: ${book.title}
    Genre: ${book.genre}
    Style: ${book.style} (Maintain this voice strictly!)
    
    **Plot Context:**
    The story so far: ${previousChapterSummary || "This is the beginning of the story."}
    
    **Chapter Goal:**
    ${currentChapter.summary}
    
    **Requirements:**
    - Write approximately 800-1000 words.
    - Use "Show, Don't Tell". Focus on sensory details, dialogue, and internal monologue.
    - Maintain a poetic and immersive tone.
    - End the chapter with a hook or emotional resonance.
    - Format with Markdown (use **bold** for emphasis, *italics* for thoughts/emphasis).
    - CRITICAL: Do NOT output the chapter title, chapter number, or any headers (like # Chapter X) at the start. Start directly with the story text.
  `;

  // Add longer delay before each chapter write to avoid rate limits
  await delay(3000);

  const response = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: prompt,
    })
  );

  let content = response.text || "";

  // CLEANUP: Remove duplicated headers if the AI generates them despite instructions
  const cleanPatterns = [
    /^#+\s*Chapter\s*\d+.*$/gim,
    /^\*\*Chapter\s*\d+.*\*\*$/gim,
    /^Chapter\s*\d+.*$/gim,
    new RegExp(`^#+\\s*${currentChapter.title}.*$`, 'gim'),
    new RegExp(`^${currentChapter.title}$`, 'gim')
  ];

  for (const pattern of cleanPatterns) {
    content = content.replace(pattern, '').trim();
  }

  // Add longer delay before summary request
  await delay(2000);

  // Ask AI to summarize what it just wrote to pass to the next iteration
  const summaryResponse = await retryWithBackoff(() =>
    ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Summarize the following chapter in 3 sentences, focusing on plot progression and character emotional state. \n\n ${content}`
    })
  );

  return {
    content: content,
    newSummary: summaryResponse.text || currentChapter.summary
  };
}

// -- 3. The Illustrator: Generates an image for the chapter --
export async function generateIllustration(
  chapterContent: string, 
  genre: string
): Promise<string | undefined> {
  console.log("🎨 Starting image generation...");
  
  try {
    // 1. Extract a scene description first using text AI
    const promptExtract = `Describe a single, highly visual, cinematic scene from this text that would make a beautiful book illustration. Keep it under 40 words. Focus on lighting and mood. Genre: ${genre}. Text: ${chapterContent.substring(0, 2000)}`;
    
    await delay(2000);
    
    const extractRes = await retryWithBackoff(() =>
      ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: promptExtract
      })
    );
    
    const imagePrompt = extractRes.text || "A mysterious scene with dramatic lighting";
    console.log("📝 Image prompt:", imagePrompt);

    // 2. Generate the image using Pollinations AI (free, reliable image generation)
    const fullPrompt = encodeURIComponent(
      `${imagePrompt}. Art style: Highly detailed, oil painting, cinematic lighting, ${genre} aesthetic, professional book illustration, dramatic composition`
    );
    
    console.log("🖼️ Generating image with Pollinations AI...");
    
    await delay(2000);
    
    // Use Pollinations AI - a free, reliable text-to-image API
    const imageUrl = `https://image.pollinations.ai/prompt/${fullPrompt}?width=1024&height=1024&seed=${Date.now()}&nologo=true&enhance=true`;
    
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      console.error("❌ Image generation failed:", response.status);
      return undefined;
    }

    // Convert image to base64
    const blob = await response.blob();
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data:image/png;base64, prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(blob);
    });
    
    if (base64) {
      console.log("✅ Image generated successfully!");
      return base64;
    } else {
      console.warn("⚠️ Failed to convert image to base64");
      return undefined;
    }
    
  } catch (err: any) {
    console.error("❌ Image generation failed:", err.message || err);
    return undefined;
  }
}
