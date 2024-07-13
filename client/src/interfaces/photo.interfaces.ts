export interface ListingPhoto {
  image_file?: File | null;
  listing_id?: string; // ObjectId as string
  added_by_user: string; // ObjectId as string
  type: 'aditionals' | 'bathroom' | 'bedroom';
  placement: number;
  active: boolean;
}

export const InitialListingPhotoState: ListingPhoto[] = [
  {
    image_file: null,
    listing_id: '',
    added_by_user: '',
    type: 'aditionals',
    placement: 0,
    active: true
  },
  {
    image_file: null,
    listing_id: '',
    added_by_user: '',
    type: 'aditionals',
    placement: 1,
    active: true
  },
  {
    image_file: null,
    listing_id: '',
    added_by_user: '',
    type: 'aditionals',
    placement: 2,
    active: true
  },
  {
    image_file: null,
    listing_id: '',
    added_by_user: '',
    type: 'aditionals',
    placement: 3,
    active: true
  },
  {
    image_file: null,
    listing_id: '',
    added_by_user: '',
    type: 'aditionals',
    placement: 4,
    active: true
  }
];
