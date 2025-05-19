'use client';

import Image from 'next/image';
import {
  Accordion,
  AccordionItem,
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@components/Accordion';
import { Correspondence } from '@ts-types/correspondence';
import { Expand } from 'lucide-react';
import { LetterType } from '@ts-types/letter';
import { useState } from 'react';

const CorrespondenceDetails = ({
  correspondence,
}: {
  correspondence: Correspondence;
}) => {
  const [selectedLetterIndex, setSelectedLetterIndex] = useState(0);
  const selectedLetter = correspondence.letters[selectedLetterIndex];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-4">
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
          <Image
            src={selectedLetter.imageURLs[0]?.urlThumbnail || ''}
            alt="Selected letter"
            fill
            className="object-cover"
          />
          <Drawer>
            <DrawerTrigger asChild>
              <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30">
                <Expand className="text-white" />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4 text-white space-y-2">
                <h2 className="text-xl font-bold">{selectedLetter.title}</h2>
                <p className="italic text-white/70">
                  {selectedLetter.description}
                </p>
                <p>Status: {selectedLetter.status}</p>
                <p>Method: {selectedLetter.method}</p>
                <p>Sent: {selectedLetter.sentAt}</p>
                <p>Received: {selectedLetter.receivedAt}</p>
                <p>{selectedLetter.text}</p>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {correspondence.letters.map((letter, idx) => (
            <button
              key={letter.letterId}
              onClick={() => setSelectedLetterIndex(idx)}
              className={`relative w-24 h-24 flex-shrink-0 border rounded overflow-hidden ${
                idx === selectedLetterIndex ? 'ring-2 ring-white' : ''
              }`}
            >
              <Image
                src={letter.imageURLs[0]?.urlThumbnail || ''}
                alt={`Thumbnail ${idx}`}
                fill
                className="object-cover"
              />
              <span className="absolute bottom-1 left-1 bg-black/60 text-xs px-1 rounded">
                {LetterType[letter.type]}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6 text-white">
        <div>
          <h1 className="text-3xl font-bold">{correspondence.title}</h1>
          <p className="italic text-white/80">
            {correspondence.reason.description}
          </p>
          <p className="text-white/60">
            Domain: {correspondence.reason.domain}
          </p>
          <p className="text-white/60">Status: {correspondence.status}</p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl">
          <h2 className="text-xl font-semibold">Recipient</h2>
          <p>
            {correspondence.recipient.firstName}{' '}
            {correspondence.recipient.lastName}
          </p>
          <p className="text-white/70 italic">
            {correspondence.recipient.occupation}
          </p>
          <p className="text-white/60">
            {correspondence.recipient.organization}
          </p>
          <p className="mt-2 text-white/80">
            {correspondence.recipient.description}
          </p>
        </div>

        <Accordion collapsible className="w-full">
          {correspondence.letters.map((letter, idx) => (
            <AccordionItem
              value={`letter-${idx}`}
              key={letter.letterId}
              label={letter.title}
            >
              <div>{letter.text}</div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default CorrespondenceDetails;
