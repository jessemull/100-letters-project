import React from 'react';
import { Correspondence } from '@ts-types/correspondence';

interface Props {
  correspondence: Correspondence;
}

const CorrespondenceDetails: React.FC<Props> = ({ correspondence }) => (
  <div>
    <h1 className="text-3xl font-bold">{correspondence.title}</h1>
    <p className="italic text-white/80">{correspondence.reason.description}</p>
    <p className="text-white/60">Domain: {correspondence.reason.domain}</p>
  </div>
);

export default CorrespondenceDetails;
