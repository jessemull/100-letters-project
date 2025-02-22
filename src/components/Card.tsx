import { Correspondence } from '../types';

interface CardProps {
  correspondence: Correspondence;
}

const Card: React.FC<CardProps> = ({ correspondence }) => {
  const { recipient, title, letters } = correspondence;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <p className="text-lg text-gray-600 mt-2">Corresponding with: {recipient}</p>
      <div className="mt-4">
        <h3 className="text-xl font-medium text-gray-800">Sent Letter</h3>
        {letters.sent.length > 0 ? (
          letters.sent.map((sentLetter) => (
            <div key={sentLetter.id} className="bg-gray-100 p-4 mt-2 rounded-lg">
              <p className="font-semibold text-gray-700">Date Sent: {sentLetter.date}</p>
              <p className="mt-2">{sentLetter.text}</p>
              <p className="text-gray-600 mt-2">Medium: {sentLetter.medium}</p>
              <p className="text-gray-600">Status: {sentLetter.status}</p>
            </div>
          ))
        ) : (
          <p>No sent letters available.</p>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-medium text-gray-800">Received Letter</h3>
        {letters.received.length > 0 ? (
          letters.received.map((receivedLetter) => (
            <div key={receivedLetter.id} className="bg-gray-100 p-4 mt-2 rounded-lg">
              <p className="font-semibold text-gray-700">Date Received: {receivedLetter.date}</p>
              <p className="mt-2">{receivedLetter.text}</p>
              <p className="text-gray-600 mt-2">Medium: {receivedLetter.medium}</p>
              <p className="text-gray-600">Status: {receivedLetter.status}</p>
            </div>
          ))
        ) : (
          <p>No received letters available.</p>
        )}
      </div>
    </div>
  );
};

export default Card;
