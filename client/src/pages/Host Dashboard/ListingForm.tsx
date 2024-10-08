import {
  Address,
  AddressState,
  PlaceState
} from '../../interfaces/address.interfaces';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import ReservationTypeForm from '../../components/listing/form/ReservationTypeForm';
import GoogleMapComponent from '../../components/GoogleMap';
import FloatingLabelInput from '../../components/listing/form/FloatingLabelInput';
import { getGeocoderAddressComponents } from '../../utils/geocoderAddressComponents';
import { InputEvent } from '../../interfaces/input.interfaces';
import PhotoDropzone from '../../components/listing/form/PhotoDropzone';
import Input from '../../components/listing/form/Input';
import useDropzonePhotos from '../../hooks/useDropzonePhotos';
import {
  Currency,
  Listing,
  ListingInitial,
  ListingSubCategory,
  ReservationType
} from '../../interfaces/listing.interfaces';
import { DiscountCodePreview } from '../../interfaces/discount.interfaces';
import useCustomError from '../../hooks/useError';
import axiosInstance from '../../api/axios.instance';

function ListingForm() {
  const navigate = useNavigate();
  const [fetchError, setFetchError] = useCustomError();
  const [isSubmitting, setiSSubmitting] = useState(false);
  const [address, setAddress] = useState<Address>(AddressState);
  const [listingDetails, setListingDetails] = useState<Listing>(ListingInitial);
  const [listingOptions, setlistingOptions] = useState<OptionsType | null>(
    null
  );

  const { userContext } = useAuth();
  if (userContext === null) {
    navigate('/');
    return null;
  }
  const [photos, addPhoto, removePhoto, layout] = useDropzonePhotos({
    user_id: userContext.id
  });

  useEffect(() => {
    fetchListingOptions()
      .then((options) => setlistingOptions(options))
      .catch((error) => setFetchError(error));
  }, []);

  const handleSetAddress = (place: PlaceState) => {
    const components = place.address_components;

    let processedAddressComponents = getGeocoderAddressComponents(components);

    setAddress((prev) => ({
      ...prev,
      ...processedAddressComponents,
      latitude: place.lat,
      longitude: place.lng,
      place_id: place.place_id
    }));
  };
  const setAddressCoords = ({ lat, lng }: { lat: number; lng: number }) => {
    setAddress((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const ReservationTypeFields = useMemo(() => {
    const reservationTypeMatch = listingOptions?.reservationTypes.find(
      (reservationType) =>
        reservationType._id === listingDetails.reservation_type._id
    );

    const reservationTypeName = reservationTypeMatch?.name || '';
    return (
      reservationTypeName && (
        //TODO: Divide into three components
        <ReservationTypeForm
          reservationType={reservationTypeName}
          state={listingDetails}
          stateSetter={setListingDetails}
        />
      )
    );
  }, [listingDetails.reservation_type]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    const newValue = type === 'number' ? parseInt(value, 10) : value;
    if (address) {
      setAddress({
        ...address,
        [id]: newValue
      });
    }
  };

  const handleListingChange = useCallback((e: InputEvent) => {
    const { name, value, type } = e.target;
    let checked = (e.target as HTMLInputElement).checked;

    setListingDetails((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSubmit = async () => {
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
      const updatedPhotos = photos.map((photo) => ({
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
            type="text"
            value={listingDetails.title}
            onChange={handleListingChange}
            className={''}
          />
          <Input
            label={'Description'}
            name={'description'}
            type={'text'}
            value={listingDetails.description}
            onChange={handleListingChange}
            className={''}
          />
          <Input
            label={'Reservation Type'}
            name={'reservation_type'}
            type={'select'}
            value={listingDetails.reservation_type.name}
            onChange={handleListingChange}
            className={''}
            options={[
              { value: '', text: 'Select a reservation type' },
              ...(listingOptions?.reservationTypes?.map((type) => ({
                value: type._id,
                text: type.name as string
              })) ?? [])
            ]}
          />
          {ReservationTypeFields}
          <Input
            label={'Subcategory'}
            name={'subcategory'}
            type={'select'}
            value={listingDetails.subcategory}
            onChange={handleListingChange}
            className={''}
            options={[
              { value: '', text: 'Select a subcategory' },
              ...(listingOptions?.subCategories?.map((subCategory) => ({
                value: subCategory._id,
                text: subCategory.name as string
              })) ?? [])
            ]}
          />
          <GoogleMapComponent
            coords={setAddressCoords}
            getDetails={handleSetAddress}
          ></GoogleMapComponent>
          {address && (
            <div
              id="address-form"
              className="
                py-4
                rounded-lg overflow-hidden 
                border-neutral-300 
                [&>*:first-child]:rounded-t-lg 
                [&>*:last-child]:rounded-b-lg [&>*:last-child]:border-b-2 
                [&>*]:border-t-2 [&>*]:border-x-2"
            >
              <FloatingLabelInput
                label="Street Address"
                id="street_name"
                value={address.street_name}
                onChange={handleAddressChange}
              />
              <FloatingLabelInput
                label="Street Number"
                id="street_number"
                type="number"
                value={address.street_number || ''}
                onChange={handleAddressChange}
              />
              <FloatingLabelInput
                label="Apartment, room, etc. (if it applies)"
                id="accomodation_local_id"
                type="number"
                value={address.accomodation_local_id || ''}
                onChange={handleAddressChange}
              />
              <FloatingLabelInput
                label="Postal Code"
                id="postal_code"
                type="number"
                value={address.postal_code || ''}
                onChange={handleAddressChange}
              />
              <FloatingLabelInput
                label="City"
                id="city"
                value={address.city}
                onChange={handleAddressChange}
              />
              <FloatingLabelInput
                label="Municipality"
                id="municipality"
                value={address.municipality}
                onChange={handleAddressChange}
              />
              <FloatingLabelInput
                label="State"
                id="state"
                value={address.state}
                onChange={handleAddressChange}
              />
              <FloatingLabelInput
                label="Sublocality"
                id="sublocality"
                value={address.sublocality}
                onChange={handleAddressChange}
              />
              <FloatingLabelInput
                label="Country"
                id="country"
                value={address.country}
                onChange={handleAddressChange}
              />
            </div>
          )}

          <Input
            label={'Price per Night'}
            name={'price_per_night'}
            type={'number'}
            value={listingDetails.price_per_night}
            onChange={handleListingChange}
          />
          <Input
            label={'Price Currency'}
            name={'price_currency'}
            type={'select'}
            value={listingDetails.show_exact_location}
            onChange={handleListingChange}
            options={[
              { value: '', text: 'Select a currency' },
              ...(listingOptions?.currencies?.map((currency) => ({
                value: currency._id,
                text: currency.name + '-' + currency.iso_code
              })) ?? [])
            ]}
          />
          <Input
            label={'Show Exact Location'}
            name={'show_exact_location'}
            type={'checkbox'}
            value={listingDetails.show_exact_location}
            onChange={handleListingChange}
          />

          <Input
            label={'Accommodates Count'}
            name={'accomodates_count'}
            type={'number'}
            value={listingDetails.accomodates_count}
            onChange={handleListingChange}
          />

          <Input
            label={'Availability Type'}
            name={'availability_type'}
            type={'select'}
            value={listingDetails.availability_type}
            onChange={handleListingChange}
            options={[
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
            onChange={handleListingChange}
            options={[
              { value: 'immediate', text: 'Immediate' },
              { value: 'under_approval', text: 'Under Approval' }
            ]}
          />

          <Input
            label={'Minimum Stay Duration'}
            name={'minimum_stay_duration'}
            type={'number'}
            value={listingDetails.minimum_stay_duration}
            onChange={handleListingChange}
          />
          <Input
            label={'Maximum Stay Duration'}
            name={'maximum_stay_duration'}
            type={'number'}
            value={listingDetails.maximum_stay_duration}
            onChange={handleListingChange}
          />
          <Input
            label={'Accepted Guest Type'}
            name={'accepted_guest_type'}
            type={'select'}
            value={listingDetails.accepted_guest_type}
            onChange={handleListingChange}
            options={[
              { value: 'Any', text: 'Any' },
              { value: 'Experienced', text: 'Experienced' }
            ]}
          />
          <Input
            label={'Security Cameras'}
            name={'security_cameras'}
            type={'checkbox'}
            value={listingDetails.security_cameras}
            onChange={handleListingChange}
          />
          <Input
            label={'Weapons Around'}
            name={'weapons_around'}
            type={'checkbox'}
            value={listingDetails.weapons_around}
            onChange={handleListingChange}
          />
          <Input
            label={'Dangerous Animals Around'}
            name={'dangerous_animals_around'}
            type={'checkbox'}
            value={listingDetails.dangerous_animals_around}
            onChange={handleListingChange}
          />

          <div className="w-full grid grid-cols-2 auto-rows-max gap-4 my-32">
            <p className="text-lg font-inter font-semibold">Listing Photos</p>
            {layout.map((dropzone, index) => (
              <PhotoDropzone
                key={dropzone.id}
                index={index}
                setPhoto={addPhoto}
                removePhoto={removePhoto}
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

type OptionsType = {
  reservationTypes: ReservationType[];
  subCategories: ListingSubCategory[];
  currencies: Currency[];
  discounts: DiscountCodePreview[];
  checkinMethods: string[];
};
const fetchListingOptions = async (): Promise<OptionsType> => {
  const options: OptionsType = {
    reservationTypes: [],
    subCategories: [],
    currencies: [],
    discounts: [],
    checkinMethods: []
  };
  try {
    const [
      reservationTypesRes,
      subcategoriesRes,
      currenciesRes,
      checkinMethodsRes,
      discountsRes
    ] = await Promise.all([
      axiosInstance.get<ReservationType[]>(
        '/listings/reservation-types?query={"active":true}'
      ),
      axiosInstance.get<ListingSubCategory[]>(
        '/listings/sub-categories?query={"active":true}'
      ),
      axiosInstance.get<Currency[]>(
        '/finance/currencies?query={"active":true}'
      ),
      axiosInstance.get<string[]>('/listing/check-in-methods'),
      axiosInstance.get<DiscountCodePreview[]>(
        `/discount/code/docs?numeriFilters="expirationDate>${new Date()},startDate<${new Date()}"&populate="name,code,discount,_id,max_number_of_uses,current_uses"`
      )
    ]);
    const discountsAvailable: DiscountCodePreview[] = discountsRes.data.filter(
      (discount) => discount.max_number_of_uses < discount.current_uses
    );
    options.reservationTypes = reservationTypesRes.data;
    options.subCategories = subcategoriesRes.data;
    options.currencies = currenciesRes.data;
    options.checkinMethods = checkinMethodsRes.data;
    options.discounts = discountsAvailable;
  } catch (err) {
    throw err;
  }

  return { ...options };
};
