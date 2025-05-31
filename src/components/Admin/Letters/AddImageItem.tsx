import React, {
  ChangeEvent,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Select, TextInput } from '@components/Form';
import { View } from '@ts-types/letter';
import { X } from 'lucide-react';

interface Props {
  caption: string;
  disableUploadButton: boolean;
  file: File | null;
  onSelectImage: (event: ChangeEvent<HTMLInputElement>) => void;
  resetAddNewImage: MouseEventHandler;
  setCaption: Dispatch<SetStateAction<string>>;
  setView: Dispatch<SetStateAction<View>>;
  uploadImage: () => Promise<void>;
  view: View;
  viewOptions: { label: string; value: View }[];
}

const AddImageItem = ({
  caption,
  disableUploadButton,
  file,
  onSelectImage,
  resetAddNewImage,
  setCaption,
  setView,
  uploadImage,
  view,
  viewOptions,
}: Props) => {
  return (
    <div className="p-4 backdrop-blur-md bg-white/10 border border-white rounded-xl transition-transform transform hover:scale-[1.01] cursor-pointer space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Add New Image</h2>
        <X
          data-testid="add-image-close-icon"
          color="white"
          onClick={resetAddNewImage}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <TextInput
            id="caption"
            label="Caption"
            onChange={({ target: { value } }) => setCaption(value)}
            placeholder="Caption"
            type="text"
            value={caption}
          />
          <div className="w-full md:w-1/2">
            <Select
              id="viewSelect"
              label="View"
              onChange={({ target: { value } }) => setView(value as View)}
              options={viewOptions}
              placeholder="Choose a view"
              value={view}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 items-center">
        <div className="w-full md:w-1/3">
          <label
            htmlFor="imageUpload"
            className="w-full h-12 text-base leading-[30px] rounded-[25px] border bg-[#111827] text-white border-white hover:bg-[#293E6A] cursor-pointer flex items-center justify-center"
          >
            Select Image +
          </label>
          <input
            data-testid="file-input"
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={onSelectImage}
            className="hidden"
          />
        </div>
        <div className="w-full truncate text-sm break-words text-white">{`${file ? file.name : 'Select an image file...'}`}</div>
      </div>
      <Button
        disabled={disableUploadButton}
        id="upload-image"
        onClick={uploadImage}
        value="Upload Image +"
      />
    </div>
  );
};

export default AddImageItem;
