import { GeocoderAddressComponent } from '@interfaces/maps.interfaces';
import { Address } from '../interfaces/address.interfaces';
// TODO: Modify in order to accomodate to multiple forms of matching the type to the field
// Example sublocality_level_1 is not always the first index in the types array
export const getGeocoderAddressComponents = (
  addressComponents: GeocoderAddressComponent[]
): Address => {
  let extractedData: Partial<Address> = {};

  console.log(addressComponents);
  addressComponents.map((component) => {
    switch (component.types[0]) {
      case 'street_number':
        extractedData.street_number = parseInt(component.long_name, 10);
        break;
      case 'route':
        extractedData.street_name = component.long_name;
        break;
      case 'postal_code':
        extractedData.postal_code = parseInt(component.long_name, 10);
        break;
      case 'neighborhood':
        extractedData.neighbourhood_description = component.long_name;
        break;
      case 'sublocality_level_1':
        extractedData.sublocality = component.long_name;
        break;
      case 'country':
        extractedData.country = component.short_name;
        break;
      case 'administrative_area_level_1':
        extractedData.state = component.short_name;
        break;
      case 'administrative_area_level_2':
        extractedData.municipality = component.long_name;
        break;
      case 'locality':
        extractedData.city = component.long_name;
        break;
      default:
        break;
    }
  });

  return extractedData as Address;
};
