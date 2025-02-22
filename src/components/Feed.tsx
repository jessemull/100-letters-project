import Card from './Card';
import { Correspondence } from '../types';

interface LetterFeedProps {
  correspondence: Correspondence[];
}

const Feed = ({ correspondence }: LetterFeedProps) => (
  <main className="bg-gray-100 py-12">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Letters</h2>
      <div className="space-y-8">
      {correspondence.map((item) => (
        <Card key={item.id} correspondence={item} />
      ))}
      </div>
    </div>
  </main>
);

export default Feed;
