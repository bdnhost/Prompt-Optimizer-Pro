export interface OptimizationResult {
  scratchpad: string;
  analysis: string;
  optimizedPrompt: string;
  keyImprovements: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface PromptInput {
  originalPrompt: string;
  evaluationCriteria: string;
}

export interface WordPressConfig {
  url: string;
  username: string;
  appPassword: string;
}

export interface GeneratedContent {
  title: string;
  content: string;
}