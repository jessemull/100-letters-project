import React from 'react';
import { CorrespondenceCard } from '@ts-types/correspondence';

interface Props {
  correspondence: CorrespondenceCard;
}

const CorrespondenceDetails: React.FC<Props> = ({ correspondence }) => (
  <div>
    <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
      {correspondence?.title}
    </h1>
    <p className="italic text-white/80">
      {correspondence?.reason?.description}
    </p>
    <p className="text-white/60">
      Category: {correspondence?.reason?.category}
    </p>
  </div>
);

export default CorrespondenceDetails;
