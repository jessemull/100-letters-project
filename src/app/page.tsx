// src/app/page.tsx

import { Correspondence } from '../types';
import { CorrespondenceFactory } from '@/factories';
import { Header, Feed, Footer } from '../components';

const correspondence: Correspondence[] = CorrespondenceFactory.buildList(3);

const HomePage = () => {
  const correspondences = JSON.parse(process.env.CORRESPONDENCES || '{}');
  const letter = JSON.parse(process.env.LETTERS || '{}');
  const recipient = JSON.parse(process.env.RECIPIENTS || '{}');
  console.log(correspondences);
  console.log(letter);
  console.log(recipient);
  return (
    <div>
      <Header />
      <Feed correspondence={correspondence} />
      <Footer />
    </div>
  );
};

export default HomePage;
