import { AddressState, PlaceState } from '../../interfaces/address.interfaces';
import { ListingPhoto } from '../../interfaces/photo.interfaces';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import CategoryRequiredFields from '../../components/CategoryRequiredFields';
import GoogleMapComponent from '../../components/GoogleMap';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { getGeocoderAddressComponents } from '../../utils/geocoderAddressComponents';
import { InputEvent } from '../../interfaces/input.interfaces';
import PhotoDropzone from '../../components/PhotoDropzone';
import Input from '../../components/Input';
import useListingState from '../../hooks/useListingState';

interface ImageDropzone {
  id: string;
  image: ListingPhoto | null;
}

function ListingForm() {
  const navigate = useNavigate();
  const {
    photoAlbum,
    setPhotoAlbum,
    listingAddress,
    setAddress,
    listingDetails,
    setListingDetails,
    categories,
    subCategories,
    currencies,
    discounts,
    setDiscounts,
    checkinMethods,
    setCheckinMethods,
    submittingStatus,
    setSubmittingStatus
  } = useListingState();
  const { userContext } = useAuth();

  const [dropzoneLayout, setDropzoneLayout] = useState<ImageDropzone[]>([]);
  useEffect(() => {
    // Reasign photos
    const newDropzoneLayout: ImageDropzone[] = photoAlbum.map(
      (photo, index) => ({
        id: `dropzone-position-${index}`,
        image: photo
      })
    );
    const minDropzones = 5;
    const numOfPhotos = photoAlbum.length;

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
  }, [photoAlbum.length]);

  useEffect(() => {
    console.log(listingAddress);
  }, [listingAddress]);
  const addListingPhoto = (photo: File) => {
    if (!userContext) return;
    const newPhotoAlbum = [...photoAlbum];
    const album_photo: ListingPhoto = {
      image_file: photo,
      listing_id: '', // ObjectId
      added_by_user: userContext?.id, // ObjectId
      type: 'aditionals',
      placement: newPhotoAlbum.length,
      active: true
    };
    newPhotoAlbum.push(album_photo);
    setPhotoAlbum(newPhotoAlbum);
  };

  const removeListingPhoto = (delete_photo: File) => {
    const filteredPhotos = photoAlbum.filter(
      (photo) => photo.image_file != delete_photo
    );
    setPhotoAlbum(filteredPhotos);
  };

  const handleAddressFieldChange = (id: string, value: string | number) => {
    if (listingAddress) {
      setAddress({
        ...listingAddress,
        [id]: value
      });
    }
  };

  const setPlaceDetails = {
    FullAddress: (place: PlaceState) => {
      const components = place.address_components;

      let processedAddressComponents = getGeocoderAddressComponents(components);

      setAddress((prev) => ({
        ...AddressState,
        ...processedAddressComponents,
        latitude: place.lat,
        longitude: place.lng,
        place_id: place.place_id
      }));
    },
    LatLng: (LatLng: { lat: number; lng: number }) => {
      setAddress((prev) => ({
        ...(prev || AddressState), // Use AddressState if prev is undefined
        latitude: LatLng.lat, // Update the latitude
        longitude: LatLng.lng // Update the longitude
      }));
    }
  };

  const categoryRequiredFieldsComponent = useMemo(() => {
    const categoryMatch = categories.find(
      (category) => category._id === listingDetails.category
    );

    const categoryName = categoryMatch ? categoryMatch.name : ''; // Check if category exists to avoid errors
    return <CategoryRequiredFields category={categoryName} />;
  }, [listingDetails.category]);

  const handleListingFieldChange = (e: InputEvent) => {
    const { name, value, type } = e.target;
    let checked = (e.target as HTMLInputElement).checked;

    setListingDetails((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? !checked : value
    }));
  };
  const handleSubmit = async () => {
    if (!userContext) return;
    setListingDetails((prev) => ({ ...prev, host_id: userContext.id }));

    try {
      // Step 1: Submit the listing to get the listing ID
      const listingResponse = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingDetails)
      });
      const newListing = await listingResponse.json();

      // Step 2: Update photos with the listing ID
      const updatedPhotos = photoAlbum.map((photo) => ({
        ...photo,
        listing_id: newListing.id
      }));

      // Step 3: Submit the photos
      const photoPromises = updatedPhotos.map((photo) =>
        fetch('/api/listing-photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(photo)
        })
      );
      await Promise.all(photoPromises);

      // Optionally: Clear state or show success message
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="max-w-[630px] flex mx-auto mt-8 justify-center">
      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <Input
            label={'Title'}
            name={'title'}
            type={'text'}
            value={listingDetails.title}
            onChange={handleListingFieldChange}
            className={''}
          />
          <Input
            label={'Description'}
            name={'description'}
            type={'text'}
            value={listingDetails.description}
            onChange={handleListingFieldChange}
            className={''}
          />
          <Input
            label={'Category'}
            name={'category'}
            type={'select'}
            value={listingDetails.category}
            onChange={handleListingFieldChange}
            className={''}
            select_options={[
              { value: '', text: 'Select a category' },
              ...categories.map((category) => ({
                value: category._id,
                text: category.name
              }))
            ]}
          />
          {categoryRequiredFieldsComponent}
          <Input
            label={'Subcategory'}
            name={'subcategory'}
            type={'select'}
            value={listingDetails.subcategory}
            onChange={handleListingFieldChange}
            className={''}
            select_options={[
              { value: '', text: 'Select a subcategory' },
              ...subCategories.map((subcategory) => ({
                value: subcategory._id,
                text: subcategory.name
              }))
            ]}
          />
          {/* TODO: Give option to choose current location or mark on map */}
          <GoogleMapComponent
            setPlaceDetails={setPlaceDetails}
          ></GoogleMapComponent>
          {listingAddress && (
            <>
              <FloatingLabelInput
                label="Street Address"
                id="street_name"
                value={listingAddress.street_name}
                onChange={handleAddressFieldChange}
              />
              <FloatingLabelInput
                label="Street Number"
                id="street_number"
                type="number"
                value={
                  listingAddress.street_number === 0
                    ? ''
                    : listingAddress.street_number
                }
                onChange={handleAddressFieldChange}
              />
              <FloatingLabelInput
                label="Apartment, room, etc. (if it applies)"
                id="accomodation_local_id"
                type="number"
                value={listingAddress.accomodation_local_id}
                onChange={handleAddressFieldChange}
              />
              <FloatingLabelInput
                label="Postal Code"
                id="postal_code"
                type="number"
                value={listingAddress.postal_code}
                onChange={handleAddressFieldChange}
              />
              <FloatingLabelInput
                label="City / Municipality"
                id="municipality"
                value={listingAddress.city}
                onChange={handleAddressFieldChange}
              />
              <FloatingLabelInput
                label="State"
                id="state"
                value={listingAddress.state}
                onChange={handleAddressFieldChange}
              />
              <FloatingLabelInput
                label="Sublocality"
                id="sublocality"
                value={listingAddress.sublocality}
                onChange={handleAddressFieldChange}
              />
              <FloatingLabelInput
                label="Country"
                id="country"
                value={listingAddress.country}
                onChange={handleAddressFieldChange}
              />
            </>
          )}

          <Input
            label={'Price per Night'}
            name={'price_per_night'}
            type={'number'}
            value={listingDetails.price_per_night}
            onChange={handleListingFieldChange}
            className={''}
          />
          <Input
            label={'Price Currency'}
            name={'price_currency'}
            type={'select'}
            value={listingDetails.show_exact_location}
            onChange={handleListingFieldChange}
            className={''}
            select_options={[
              { value: '', text: 'Select a currency' },
              ...currencies.map((currency) => ({
                value: currency._id,
                text: currency.name + '-' + currency.iso_code
              }))
            ]}
          />
          <Input
            label={'Show Exact Location'}
            name={'show_exact_location'}
            type={'checkbox'}
            value={listingDetails.show_exact_location}
            onChange={handleListingFieldChange}
            className={''}
          />

          <Input
            label={'Accommodates Count'}
            name={'accomodates_count'}
            type={'number'}
            value={listingDetails.accomodates_count}
            onChange={handleListingFieldChange}
            className={''}
          />

          <Input
            label={'Availability Type'}
            name={'availability_type'}
            type={'select'}
            value={listingDetails.availability_type}
            onChange={handleListingFieldChange}
            className={''}
            select_options={[
              { value: 'AVAILABLE', text: 'Available' },
              { value: 'BLOCKED', text: 'Blocked' },
              { value: 'UNDER_MAINTENANCE', text: 'Under Maintenance' }
            ]}
          />
          <Input
            label={'Booking Acceptance Type'}
            name={'booking_acceptance_type'}
            type={'select'}
            value={listingDetails.booking_acceptance_type}
            onChange={handleListingFieldChange}
            className={''}
            select_options={[
              { value: 'immediate', text: 'Immediate' },
              { value: 'under_approval', text: 'Under Approval' }
            ]}
          />

          <Input
            label={'Minimum Stay Duration'}
            name={'minimum_stay_duration'}
            type={'number'}
            value={listingDetails.minimum_stay_duration}
            onChange={handleListingFieldChange}
            className={''}
          />
          <Input
            label={'Maximum Stay Duration'}
            name={'maximum_stay_duration'}
            type={'number'}
            value={listingDetails.maximum_stay_duration}
            onChange={handleListingFieldChange}
            className={''}
          />
          <Input
            label={'Accepted Guest Type'}
            name={'accepted_guest_type'}
            type={'select'}
            value={listingDetails.accepted_guest_type}
            onChange={handleListingFieldChange}
            className={''}
            select_options={[
              { value: 'Any', text: 'Any' },
              { value: 'Experienced', text: 'Experienced' }
            ]}
          />
          <Input
            label={'Security Cameras'}
            name={'security_cameras'}
            type={'checkbox'}
            value={listingDetails.security_cameras}
            onChange={handleListingFieldChange}
            className={''}
          />
          <Input
            label={'Weapons Around'}
            name={'weapons_around'}
            type={'checkbox'}
            value={listingDetails.weapons_around}
            onChange={handleListingFieldChange}
            className={''}
          />
          <Input
            label={'Dangerous Animals Around'}
            name={'dangerous_animals_around'}
            type={'checkbox'}
            value={listingDetails.dangerous_animals_around}
            onChange={handleListingFieldChange}
            className={''}
          />

          <div className="w-full grid grid-cols-2 auto-rows-max gap-4 my-32">
            <p className="text-lg font-inter font-semibold">Listing Photos</p>
            {dropzoneLayout.map((dropzone, index) => (
              <PhotoDropzone
                key={dropzone.id}
                index={index}
                setPhoto={addListingPhoto}
                removePhoto={removeListingPhoto}
                image={
                  dropzone?.image?.image_file ? dropzone.image.image_file : null
                }
                id={dropzone.id}
              />
            ))}
          </div>
          <button type="submit"></button>
        </form>
      </div>
    </div>
  );
}

export default ListingForm;
