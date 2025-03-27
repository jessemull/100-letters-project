'use client';
import Card from './Card';
import { Correspondence } from '../types';
import { CorrespondenceContext } from '../contexts';
import { useContext, useRef, MutableRefObject } from 'react';
import EnvelopeAnimation from './EnvelopeAnimation';
const Feed = () => {
  const { correspondences } = useContext(CorrespondenceContext);
  const containerRef = useRef<HTMLDivElement | null>(null);
  return (
    <main
      ref={containerRef}
      className="bg-gray-100 min-h-[calc(100vh-120px)] flex flex-col items-center justify-center"
    >
      <EnvelopeAnimation
        containerRef={containerRef as MutableRefObject<HTMLElement>}
      />
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
    </main>
  );
};

export default Feed;
