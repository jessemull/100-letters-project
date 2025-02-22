// src/app/page.tsx

import { Header, Feed, Footer } from '../components';
import { Correspondence, LetterMedium, LetterStatus } from '../types';

const correspondence: Correspondence[] = [
  {
    id: 1,
    recipient: 'John Constantine',
    title: 'Can you help me with my demon problem?',
    letters: {
      received: [
        {
          attachments: ['image1.jpg'],
          date: '2025-02-01',
          id: 3,
          medium: LetterMedium.HOMING_PIGEON,
          recipient: 'You',
          sender: 'John Constantine',
          status: LetterStatus.RESPONDED,
          text: 'I will help you with your demon problem. Let’s discuss further.',
          title: 'Re: Can you help me with my demon problem?',
        },
      ],
      sent: [
        {
          date: '2025-01-15',
          id: 1,
          medium: LetterMedium.PHYSICAL_MAIL,
          recipient: 'John Constantine',
          sender: 'You',
          status: LetterStatus.RESPONDED,
          text: 'I have a demon problem and need your assistance.',
          title: 'Can you help me with my demon problem?',
        },
      ],
    },
  }
];

const HomePage = () => (
  <div>
    <Header />
    <Feed correspondence={correspondence} />
    <Footer />
  </div>
);

export default HomePage;
