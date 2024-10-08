function PhotoDropzone({
  setPhoto,
  removePhoto,
  index,
  id,
  image
}: {
  setPhoto: (photo: File) => void;
  removePhoto: (photo: File) => void;
  index: number;
  id: string;
  image: File | null;
}) {
  return (
    <div
      className={`${
        id === 'dropzone-position-0'
          ? 'col-span-2 row-span-2'
          : 'col-span-1 row-span-1'
      } ${index === 0 ? 'h-[28rem]' : 'h-56'}`}
    >
      <label
        htmlFor={`${id}`}
        className="w-full h-full border-2 border-dashed hover:border-solid border-neutral-300 rounded-lg cursor-pointer flex flex-col justify-center items-center overflow-hidden"
      >
        {image ? (
          <div className="relative w-full h-full overflow-hidden">
            <img
              id="file_image"
              className="w-full h-full object-contain rounded-lg"
              src={URL.createObjectURL(image)}
              alt="item_image"
            ></img>
            <div className="flex absolute inset-0 items-center justify-center">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removePhoto(image);
                }}
                className="text-white hover:text-red-500 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 5.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 11-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <>
            <svg
              className="block h-8 w-8 text-neutral-400"
              viewBox="0 0 32 32"
              focusable={false}
            >
              <path
                fill={'rgb(163 163 163)'}
                d="M27 3a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM8.89 19.04l-.1.08L3 24.92V25a2 2 0 0 0 1.85 2H18.1l-7.88-7.88a1 1 0 0 0-1.32-.08zm12.5-6-.1.08-7.13 7.13L20.92 27H27a2 2 0 0 0 2-1.85v-5.73l-6.3-6.3a1 1 0 0 0-1.31-.08zM27 5H5a2 2 0 0 0-2 2v15.08l4.38-4.37a3 3 0 0 1 4.1-.14l.14.14 1.13 1.13 7.13-7.13a3 3 0 0 1 4.1-.14l.14.14L29 16.59V7a2 2 0 0 0-1.85-2zM8 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
              />
            </svg>
            <p className="mb-2 hidden md:inline lg:inline text-sm text-gray-400">
              Add more
            </p>
          </>
        )}
        <input
          id={`${id}`}
          name="image"
          onChange={(e) => {
            const selectedFile = e.target.files;
            if (selectedFile && selectedFile.length > 0) {
              setPhoto(selectedFile[0]);
            }
          }}
          type="file"
          key={`${id}`} // Ensure each input has a unique key
          disabled={!!image} // Disable if there is already an image selected
          className="hidden"
        />
      </label>
    </div>
  );
}

export default PhotoDropzone;
