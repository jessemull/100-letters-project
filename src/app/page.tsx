// src/app/page.tsx

import { Correspondence } from '../types';
import { CorrespondenceFactory } from '@/factories';
import { Header, Feed, Footer } from '../components';

const correspondence: Correspondence[] = CorrespondenceFactory.buildList(3);

const HomePage = () => (
  <div>
    <Header />
    <Feed correspondence={correspondence} />
    <Footer />
  </div>
);

export default HomePage;
