'use client';
import Card from './Card';
import { Correspondence } from '../types';
import { CorrespondenceContext } from '../contexts';
import { useContext } from 'react';

const Feed = () => {
  const { correspondences } = useContext(CorrespondenceContext);
  return (
    <main className="bg-gray-100 py-12">
      <div className="container mx-auto">
        <div className="space-y-8">
          {correspondences.map((item: Correspondence) => (
            <Card key={item.correspondenceId} correspondence={item} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Feed;
