import { Drawer, DrawerContent, DrawerTrigger } from '@components/Accordion';
import { Expand } from 'lucide-react';
import { Letter } from '@ts-types/letter';

interface Props {
  letter: Letter;
}

const LetterDrawer: React.FC<Props> = ({ letter }) => (
  <Drawer>
    <DrawerTrigger asChild>
      <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30">
        <Expand className="text-white" />
      </button>
    </DrawerTrigger>
    <DrawerContent>
      <div className="p-4 text-white space-y-2">
        <h2 className="text-xl font-bold">{letter.title}</h2>
        <p className="italic text-white/70">{letter.description}</p>
        <p>Status: {letter.status}</p>
        <p>Method: {letter.method}</p>
        <p>Sent: {letter.sentAt}</p>
        <p>Received: {letter.receivedAt}</p>
        <p>{letter.text}</p>
      </div>
    </DrawerContent>
  </Drawer>
);

export default LetterDrawer;
