import React from 'react';
import { Correspondence } from '@ts-types/correspondence';

interface Props {
  correspondence: Correspondence;
}

const RecipientDetails: React.FC<Props> = ({ correspondence }) => (
  <div className="bg-white/20 p-4 lg:p-5 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md">
    <h2 className="text-xl font-bold text-white mb-2">Recipient</h2>
    <p className="text-white/90 text-lg mb-1">
      {correspondence.recipient.firstName} {correspondence.recipient.lastName}
    </p>
    <p className="text-white/70 italic mb-1">
      {correspondence.recipient.occupation}
    </p>
    <p className="text-white/60 mb-2">
      {correspondence.recipient.organization}
    </p>
    <p className="mt-2 text-white/85 leading-relaxed">
      {correspondence.recipient.description}
    </p>
  </div>
);

export default RecipientDetails;
