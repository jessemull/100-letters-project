import React from 'react';
import { CorrespondenceCard } from '@ts-types/correspondence';

interface Props {
  correspondence: CorrespondenceCard;
}

const CorrespondenceDetails: React.FC<Props> = ({ correspondence }) => (
  <div className="space-y-2">
    <div className="flex flex-col justify-center flex-wrap gap-2">
      <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
        {correspondence?.title}
      </h1>
      <p className="italic text-white/90">
        {correspondence?.reason?.description}
      </p>
    </div>
  </div>
);

export default CorrespondenceDetails;
