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