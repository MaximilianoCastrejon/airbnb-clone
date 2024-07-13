import React, { useState } from 'react';

function FileUpload({
  label,
  onChange,
  id
}: {
  label: string;
  onChange: Function;
  id: number;
}) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files;
    if (!selectedFile) return;
    setFile(selectedFile[0]);
    onChange(selectedFile, id);
  };

  return (
    <div
      className={`rounded-lg border border-gray-300 p-4 ${
        id === 0 ? 'mb-4' : 'mb-2'
      } ${id === 0 ? 'lg:w-full' : 'lg:w-1/2 md:w-1/2'} ${
        id > 0 ? 'lg:ml-4' : ''
      }`}
    >
      <label htmlFor={`file-upload-${id}`} className="cursor-pointer block">
        <div className="flex items-center justify-center mb-2">
          <span className="text-lg font-semibold">{label}</span>
        </div>
        <input
          id={`file-upload-${id}`}
          type="file"
          className="hidden"
          onChange={(e) => handleFileChange(e)}
        />
        <div className="flex items-center justify-center w-full h-32 bg-gray-100 border border-dashed border-gray-300 rounded-lg">
          {file ? (
            <span className="text-gray-600">{file.name}</span>
          ) : (
            <span className="text-gray-400">
              Drop files here or click to upload
            </span>
          )}
        </div>
      </label>
    </div>
  );
}

export default FileUpload;
