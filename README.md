# 📚 Epica - The AI Novelist

> *"The AI Architect of Worlds"*

**Epica** is an AI-powered novel generation platform that creates complete, beautifully formatted books with chapters, illustrations, and multiple visual themes. Built with React, TypeScript, and Google's Gemini AI.

## ✨ Features

### 🎨 **Visual Themes**
Choose from 5 stunning book themes:
- **Classic** - Timeless cream pages with elegant serif typography
- **Dark Academia** - Moody charcoal with vintage aesthetics
- **Cyberpunk** - Neon-lit dark pages with futuristic vibes
- **Vintage** - Aged parchment with antique styling
- **Minimalist** - Clean white with modern typography

### 📖 **Complete Book Generation**
- **12 Chapters** - Full story arc from setup to resolution
- **Smart Outline** - AI generates chapter structure with summaries
- **Contextual Writing** - Each chapter builds on previous events
- **Live Preview** - Watch your book being written in real-time

### 🖼️ **AI Illustrations**
- **6 Beautiful Images** - Generated for every other chapter
- **Context-Aware** - Images match chapter content and genre
- **Multiple Styles** - Oil painting, cinematic lighting, genre-specific aesthetics

### 📄 **Professional PDF Export**
- **A4 Format** - Print-ready with proper margins
- **Full Backgrounds** - Theme colors and textures print correctly
- **Typography** - Beautiful Crimson Pro and Cinzel fonts
- **Page Breaks** - Chapters properly separated for printing

### 🎭 **Genre & Style Options**
**Genres:**
- Science Fiction
- Fantasy
- Mystery / Thriller
- Romance
- Historical Fiction
- Cyberpunk
- Eldritch Horror

**Writing Styles:**
- Poetic & Descriptive
- Fast-paced & Action
- Dark & Psychological
- Witty & Humorous
- Classic & Formal

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Gemini API keys 

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd epica
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up API keys**
   
   Create or edit `.env.local` file:
   ```env
   GEMINI_API_KEY=your_text_generation_api_key_here
   ```

   Get your API keys from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`


## 🎯 How to Use

1. **Enter Book Details**
   - Title and author name
   - Choose a visual theme (carousel navigation)
   - Select genre and writing style
   - Write a brief synopsis (the seed)

2. **Watch the Magic**
   - AI generates a 12-chapter outline
   - Each chapter is written with context from previous chapters
   - Illustrations are generated for chapters 1, 3, 5, 7, 9, 11
   - Live preview shows writing in progress

3. **Read & Download**
   - Browse your completed book with beautiful formatting
   - Click "Download PDF" to save as A4 print-ready file
   - Share or print your AI-generated novel!

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini 2.0 Flash
- **Images:** Pollinations AI (free image generation)
- **Fonts:** Google Fonts (Crimson Pro, Cinzel, Inter)
- **Build Tool:** Vite
- **Icons:** Lucide React

## 📁 Project Structure

```
epica/
├── components/
│   ├── BookSetup.tsx      # Initial form for book details
│   ├── LiveWriter.tsx     # Real-time writing preview
│   ├── BookReader.tsx     # Final book display
│   ├── MetricsChart.tsx   # (Optional) Analytics
│   └── Waveform.tsx       # (Optional) Audio viz
├── services/
│   ├── ai.ts              # Gemini AI integration
│   ├── audioUtils.ts      # Audio utilities
│   └── themes.ts          # Visual theme definitions
├── App.tsx                # Main app component
├── types.ts               # TypeScript definitions
└── index.html             # HTML with print styles
```


## ⚙️ Configuration

### Rate Limiting
The app includes automatic retry logic with exponential backoff to handle API rate limits:
- 3s delay between chapter writes
- 2s delay between API calls
- Automatic retry on 429 errors

### Image Generation
Images are generated using Pollinations AI (free service):
- 1024x1024 resolution
- Oil painting style
- Genre-specific aesthetics
- 6 images per book (every other chapter)

### Customization
Edit `services/themes.ts` to add your own visual themes with custom:
- Colors and backgrounds
- Font combinations
- Border styles
- Background textures

## 🎨 Themes Preview

| Theme | Background | Accent | Font Style |
|-------|-----------|--------|------------|
| Classic | Cream | Gold | Serif |
| Dark Aarcoal | Amber | Vintage |
| Cyberpunk | Dark | Cyan | Futuristic |
| Vi| Parchment | Brown | Antique |
| Minimalist | White | Black | Modern |

## 📝 API Usage

### Text Generation (Gemini 2.0 Flash)
- Outline generation: ~1 request
- Chapter writing: 12 requests
- Chapter summaries: 12 requests
- Image prompts: 6 requests
- **Total:** ~31 requests per book

### Image Generation (Pollinations AI)
- 6 images per book
- Free, no API key required
- High-quality 1024x1024 images

## 🐛 Troubleshooting

**429 Rate Limit Errors:**
- **Daily Quota:** Free tier allows 200 requests/day (~6 books)
- **Per-minute limit:** 15 requests/minute
- Wait a few minutes between book generations
- The app will automatically retry with delays
- Consider using different API keys for high volume
- Upgrade to paid plan for higher limits

**Images Not Generating:**
- Check browser console for errors
- Pollinations AI is free but may have occasional downtime
- Images will be skipped if generation fails (book still completes)


**PDF Not Printing Backgrounds:**
- Enable "Background graphics" in print dialog
- Use Chrome or Edge for best results
- Check print preview before saving

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Add environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_IMAGE_API_KEY`
3. Deploy!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new visual themes
- Improve AI prompts
- Add new genres or writing styles
- Enhance the UI/UX
- Fix bugs

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Google Gemini** - Powerful AI for text generation
- **Pollinations AI** - Free image generation service
- **Tailwind CSS** - Beautiful styling framework
- **React** - Amazing UI library

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ and AI**

*Generate your next bestseller with Epica!* 📚✨
