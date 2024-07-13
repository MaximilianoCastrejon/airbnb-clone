import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios.instance'; // adjust the import according to your project structure
import {
  Currency,
  Listing,
  ListingCategory,
  ListingInitialState,
  ListingSubCategory
} from '../interfaces/listing.interfaces';
import { Address } from '../interfaces/address.interfaces';
import { ListingPhoto } from '../interfaces/photo.interfaces';
import axios from 'axios';

const useListingState = () => {
  const [photoAlbum, setPhotoAlbum] = useState<ListingPhoto[]>([]);
  const [listingAddress, setAddress] = useState<Address>();
  const [listingDetails, setListingDetails] =
    useState<Listing>(ListingInitialState);
  const [categories, setCategories] = useState<ListingCategory[]>([]);
  const [subCategories, setSubCategories] = useState<ListingSubCategory[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [discounts, setDiscounts] = useState<string[]>(); // Array of IDs for new promotion, and host discounts
  const [checkinMethods, setCheckinMethods] = useState<string[]>();
  const [submittingStatus, setSubmittingStatus] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [categoriesRes, subcategoriesRes, currenciesRes] =
          await Promise.all([
            axiosInstance.get<ListingCategory[]>('/listings/categories'),
            axiosInstance.get<ListingSubCategory[]>('/listings/sub-categories'),
            axiosInstance.get<Currency[]>('/finance/currencies')
          ]);

        const currencyOptions = currenciesRes.data.filter(
          (currency) => currency.status
        );
        const categoryOptions = categoriesRes.data.filter(
          (currency) => currency.active
        );
        const subcategoryOptions = subcategoriesRes.data.filter(
          (currency) => currency.active
        );
        console.log(categoryOptions);
        setCategories(categoryOptions);
        setSubCategories(subcategoryOptions);
        setCurrencies(currencyOptions);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log('ERROR: ', {
            message: err.message,
            source: err.request.responseURL,
            response: err.response?.data
          });
          // console.log('Message:', err.message);
          // console.log('Source:', err.request.responseURL);
          // console.log('Response:', err.response?.data);
        } else {
          console.log('Error fetching data:', err);
        }
      }
    };

    fetchOptions();
  }, []);

  return {
    photoAlbum,
    setPhotoAlbum,
    listingAddress,
    setAddress,
    listingDetails,
    setListingDetails,
    categories,
    setCategories,
    subCategories,
    setSubCategories,
    currencies,
    setCurrencies,
    discounts,
    setDiscounts,
    checkinMethods,
    setCheckinMethods,
    submittingStatus,
    setSubmittingStatus
  };
};

export default useListingState;
