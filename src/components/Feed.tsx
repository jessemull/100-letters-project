'use client';
import Card from './Card';
import { Correspondence } from '../types';
import { CorrespondenceContext } from '../contexts';
import { useContext } from 'react';
import EnvelopeAnimation from './EnvelopeAnimation';
const Feed = () => {
  const { correspondences } = useContext(CorrespondenceContext);

  return (
    <main className="bg-gray-100 py-12 min-h-[calc(100vh-120px)] flex flex-col justify-between">
      <div className="container mx-auto flex-grow">
        <div className="space-y-8">
          <EnvelopeAnimation />
          {/* {correspondences.length === 0 ? (
            <>
              <p className="text-center text-xl text-gray-500 font-bold">
                Coming Soon...
              </p>
              <p className="text-center text-l text-gray-500 w-1/2 mx-auto">
                The <strong>100 Letters Project</strong> is driven by the desire
                to promote real world human interaction in an increasingly
                digital landscape and create meaningful connections through
                handwritten communication. Over the course of a year, I will
                write 100 letters to 100 individuals.
              </p>
              <p className="text-center text-l text-gray-500 w-1/2 mx-auto">
                This website will showcase these exchanges, offering a digital
                display of the letters with details about the recipients and the
                reasons behind their selection.
              </p>
            </>
          ) : (
            correspondences.map((item: Correspondence) => (
              <Card key={item.correspondenceId} correspondence={item} />
            ))
          )} */}
        </div>
      </div>
    </main>
  );
};

export default Feed;
