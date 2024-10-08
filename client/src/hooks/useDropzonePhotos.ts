import { ListingPhoto } from '../interfaces/photo.interfaces';
import { useEffect, useState } from 'react';

type DropzonePhotosProps = {
  user_id: string;
};

interface ImageDropzone {
  id: string;
  image: ListingPhoto | null;
}

const useDropzonePhotos = ({
  user_id
}: DropzonePhotosProps): [
  ListingPhoto[],
  (photo: File) => void,
  (photo: File) => void,
  ImageDropzone[]
] => {
  const [photos, setPhotos] = useState<ListingPhoto[]>([]);
  const [dropzoneLayout, setDropzoneLayout] = useState<ImageDropzone[]>([]);
  useEffect(() => {
    // Reasign photos
    const newDropzoneLayout: ImageDropzone[] = photos.map((photo, index) => ({
      id: `dropzone-position-${index}`,
      image: photo
    }));
    const minDropzones = 5;
    const numOfPhotos = photos.length;

    // Will always add an extra blank drozone
    let nextIndex = newDropzoneLayout.length;
    do {
      newDropzoneLayout.push({
        id: `dropzone-position-${nextIndex}`,
        image: null
      });
      nextIndex++;
    } while (
      newDropzoneLayout.length < minDropzones ||
      newDropzoneLayout.length <= numOfPhotos
    );

    setDropzoneLayout(newDropzoneLayout as ImageDropzone[]);
  }, [photos.length]);
  const addListingPhoto = (photo: File) => {
    const newPhotoAlbum = [...photos];
    const album_photo: ListingPhoto = {
      image_file: photo,
      listing_id: '', // ObjectId
      added_by_user: user_id, // ObjectId
      type: 'aditionals',
      placement: newPhotoAlbum.length,
      active: true
    };
    newPhotoAlbum.push(album_photo);
    setPhotos(newPhotoAlbum);
  };

  const removeListingPhoto = (delete_photo: File) => {
    const filteredPhotos = photos.filter(
      (photo) => photo.image_file != delete_photo
    );
    setPhotos(filteredPhotos);
  };
  return [photos, addListingPhoto, removeListingPhoto, dropzoneLayout];
};
export default useDropzonePhotos;
