import type { WebSocketServer } from 'ws';
import { broadcast } from '@/websocket/broadcasts/broadcast';
import type { Question } from '@/types';
import { COMMAND_TYPES } from '@/constants';

interface QuestionPayload extends Omit<Question, 'correctIndex'> {
  questionNumber: number;
  totalQuestions: number;
}

export const sendQuestionUpdate = (wss: WebSocketServer, questions: Question[] = [], currentQuestion: number = 0): void => {
  try {
    const resData: QuestionPayload = {
      questionNumber: currentQuestion + 1,
      totalQuestions: questions.length,
      text: questions[currentQuestion].text,
      options: questions[currentQuestion].options,
      timeLimitSec: questions[currentQuestion].timeLimitSec,
    };
    
    broadcast(wss, {
      type: COMMAND_TYPES.QUESTION,
      data: resData,
      id: 0,
    });
  } catch {
    console.error('Question error');
    return;
  }
};
