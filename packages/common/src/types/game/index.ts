export type Player = {
  id: string;
  clientId: string;
  connected: boolean;
  username: string;
  points: number;
  avatarId: number;
};

export type Answer = {
  playerId: string;
  answerId: number;
  points: number;
};

export type Quizz = {
  subject: string;
  background?: string;
  typeface?: string;
  questions: {
    question: string;
    image?: string;
    background?: string;
    typeface?: string;
    answers: string[];
    solution: number;
    cooldown: number;
    time: number;
  }[];
};

export type QuizzWithId = Quizz & { id: string };

export type GameUpdateQuestion = {
  current: number;
  total: number;
  background?: string;
  typeface?: string;
};
