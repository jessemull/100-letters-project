import { Correspondence } from '@ts-types/correspondence';
import React from 'react';

interface Props {
  correspondence: Correspondence;
}

const RecipientDetails: React.FC<Props> = ({ correspondence }) => (
  <div className="bg-white/10 p-4 rounded-xl">
    <h2 className="text-xl font-semibold">Recipient</h2>
    <p>
      {correspondence.recipient.firstName} {correspondence.recipient.lastName}
    </p>
    <p className="text-white/70 italic">
      {correspondence.recipient.occupation}
    </p>
    <p className="text-white/60">{correspondence.recipient.organization}</p>
    <p className="mt-2 text-white/80">{correspondence.recipient.description}</p>
  </div>
);

export default RecipientDetails;
