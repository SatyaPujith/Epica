
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  synopsis: string;
  style: string;
  themeId: string; // Visual theme ID
  createdAt: string;
  chapters: Chapter[];
  status: 'planning' | 'writing' | 'completed' | 'failed';
  totalChapters: number;
  currentChapterIndex: number;
  quote?: string;
}

export interface Chapter {
  number: number;
  title: string;
  content: string;
  summary: string;
  illustration?: string;
  illustrationPrompt?: string;
  isFinished: boolean;
}

export interface GenerationProgress {
  stage: string;
  percent: number;
  currentAction: string;
}

export enum ViewState {
  SETUP,
  WRITING,
  READING
}
