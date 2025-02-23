export enum LetterMedium {
  EMAIL = 'EMAIL',
  HOMING_PIGEON = 'HOMING_PIGEON',
  OTHER = 'OTHER',
  PHYSICAL_MAIL = 'PHYSICAL_MAIL',
}

export enum LetterStatus {
  PENDING = 'PENDING',
  RESPONDED = 'RESPONDED',
  UNSENT = 'UNSENT',
}

export interface Letter {
  attachments?: string[];
  date: string;
  id: string;
  medium: LetterMedium;
  recipient: string;
  sender: string;
  status: LetterStatus;
  text: string;
  title: string; 
}

export interface Correspondence {
  id: string;
  letters: {
    received: Letter[];
    sent: Letter[];
  };
  recipient: string; 
  title: string;
}