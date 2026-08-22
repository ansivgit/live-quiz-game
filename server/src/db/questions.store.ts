import type { Question } from '@/types';

export class QuestionsStore {
  questions: Question[];
  
  constructor() {
    this.questions = [];
  }
  
  getQuestionsList() {
    return this.questions;
  }
  
  add(questions: Question[]): void {
    this.questions = [...this.questions, ...questions];
  }
}

export const dbQuestions = new QuestionsStore();
