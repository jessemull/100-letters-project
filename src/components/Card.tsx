import { Correspondence } from '../types';
import { LetterMethod, LetterStatus, LetterType } from '../types';

interface CardProps {
  correspondence: Correspondence;
}

const Card: React.FC<CardProps> = ({ correspondence }) => {
  const {
    reason,
    status,
    title,
    letters,
    recipient,
    recipientId,
    createdAt,
    updatedAt,
  } = correspondence;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900">
        {title.toUpperCase()}
      </h2>
      <p className="text-sm text-gray-500 mt-1">Recipient ID: {recipientId}</p>
      <p className="text-sm text-gray-500">
        Created: {new Date(createdAt).toLocaleDateString()} | Updated:{' '}
        {new Date(updatedAt).toLocaleDateString()}
      </p>

      <div className="border border-gray-300 rounded-lg p-4 mt-4">
        <h3 className="text-xl font-semibold text-gray-900">Reason</h3>
        <p className="text-gray-700">
          <strong>Description:</strong> {reason.description}
        </p>
        <p className="text-gray-700">
          <strong>Domain:</strong> {reason.domain}
        </p>
        <p className="text-gray-700">
          <strong>Impact:</strong> {reason.impact}
        </p>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 mt-4">
        <h3 className="text-xl font-semibold text-gray-900">Status</h3>
        <p className="text-gray-700">{status}</p>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 mt-4">
        <h3 className="text-xl font-semibold text-gray-900">Recipient</h3>
        <p className="text-gray-700">
          <strong>Name:</strong> {recipient.firstName} {recipient.lastName}
        </p>
        {recipient.occupation && (
          <p className="text-gray-700">
            <strong>Occupation:</strong> {recipient.occupation}
          </p>
        )}
        {recipient.organization && (
          <p className="text-gray-700">
            <strong>Organization:</strong> {recipient.organization}
          </p>
        )}
        <p className="text-gray-700">
          <strong>Address:</strong> {recipient.address.street},{' '}
          {recipient.address.city}, {recipient.address.state},{' '}
          {recipient.address.postalCode}, {recipient.address.country}
        </p>
        {recipient.description && (
          <p className="text-gray-700">
            <strong>Description:</strong> {recipient.description}
          </p>
        )}
      </div>

      <div className="border border-gray-300 rounded-lg p-4 mt-4">
        <h3 className="text-xl font-semibold text-gray-900">Letters</h3>
        {letters.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {letters.map((letter) => (
              <li key={letter.letterId} className="py-3">
                <h4 className="text-lg font-medium text-gray-800">
                  {letter.title.toUpperCase()}
                </h4>
                <p className="text-gray-700">
                  <strong>Method:</strong> {LetterMethod[letter.method]}
                </p>
                <p className="text-gray-700">
                  <strong>Status:</strong> {LetterStatus[letter.status]}
                </p>
                <p className="text-gray-700">
                  <strong>Type:</strong> {LetterType[letter.type]}
                </p>
                {letter.sentAt && (
                  <p className="text-gray-700">
                    <strong>Sent At:</strong>{' '}
                    {new Date(letter.sentAt).toLocaleDateString()}
                  </p>
                )}
                {letter.receivedAt && (
                  <p className="text-gray-700">
                    <strong>Received At:</strong>{' '}
                    {new Date(letter.receivedAt).toLocaleDateString()}
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>Description:</strong>{' '}
                  {letter.description || 'No description available'}
                </p>
                <p className="text-gray-700">
                  <strong>Text:</strong> {letter.text}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No letters available.</p>
        )}
      </div>
    </div>
  );
};

export default Card;
