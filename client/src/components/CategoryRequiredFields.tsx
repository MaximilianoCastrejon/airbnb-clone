import { InputEvent } from '../interfaces/input.interfaces';
import {
  Category,
  EntirePlaceFields,
  EntirePlaceInitialState,
  PrivateRoomFields,
  PrivateRoomInitialState,
  SharedRoomFields,
  SharedRoomInitialState
} from '../interfaces/listing.interfaces';
import { useState } from 'react';
import CategoryInput from './CategoryInput';

function CategoryRequiredFields({ category }: { category: Category | '' }) {
  const [entireEssentials, setEntireEssentials] = useState<EntirePlaceFields>(
    EntirePlaceInitialState
  );
  const [privateEssentials, setPrivateEssentials] = useState<PrivateRoomFields>(
    PrivateRoomInitialState
  );
  const [sharedEssentials, setSharedEssentials] = useState<SharedRoomFields>(
    SharedRoomInitialState
  );
  const handleInputChange = (e: InputEvent) => {
    const { name, value, type } = e.target;
    setPrivateEssentials((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.ariaChecked : value
    }));
  };

  const updateValue = <T,>(
    stateSetter: React.Dispatch<React.SetStateAction<any>>,
    field: keyof T,
    operation: 'increment' | 'decrement',
    incrementValue: number,
    minValue: number = 0,
    maxValue: number = 50
  ) => {
    stateSetter((prev: any) => {
      const newValue =
        operation === 'increment'
          ? Math.min(maxValue, prev[field] + incrementValue)
          : Math.max(minValue, prev[field] - incrementValue);

      return {
        ...prev,
        [field]: newValue
      };
    });
  };

  const update = {
    PrivateEssentials: (
      field: keyof PrivateRoomFields,
      operation: 'increment' | 'decrement'
    ) => {
      const unitaryChangeFields = ['bed_count', 'bedroom_count'];
      const nonNumericFields = ['lockOnEveryBedroom', 'encounterType'];
      if (field in nonNumericFields) return;
      const incrementValue = unitaryChangeFields.includes(field as string)
        ? 1
        : 0.5;
      updateValue(setPrivateEssentials, field, operation, incrementValue);
    },
    EntirePlaceEssentials: (
      field: keyof EntirePlaceFields,
      operation: 'increment' | 'decrement'
    ) => {
      const unitaryChangeFields = ['bed_count', 'bedroom_count'];
      const incrementValue = unitaryChangeFields.includes(field as string)
        ? 1
        : 0.5;
      updateValue(setEntireEssentials, field, operation, incrementValue);
    },
    SharedEssentials: (
      field: keyof SharedRoomFields,
      operation: 'increment' | 'decrement'
    ) => {
      const incrementValue = 1;
      updateValue(setSharedEssentials, field, operation, incrementValue);
    }
  };

  return (
    <>
      {category === 'Entire place' && (
        <div>
          <CategoryInput<EntirePlaceFields>
            field={'bedroom_count'}
            updateFunction={update.EntirePlaceEssentials}
            value={entireEssentials}
            label="Bedrooms"
          />
          <CategoryInput<EntirePlaceFields>
            field={'bed_count'}
            updateFunction={update.EntirePlaceEssentials}
            value={entireEssentials}
            label="Beds"
          />
          <CategoryInput<EntirePlaceFields>
            field={'bathrooms'}
            updateFunction={update.EntirePlaceEssentials}
            value={entireEssentials}
            label="Bathrooms"
          />
        </div>
      )}
      {category === 'Private room' && (
        <div>
          <CategoryInput<PrivateRoomFields>
            field={'bedroom_count'}
            updateFunction={update.PrivateEssentials}
            value={privateEssentials}
            label="Bedrooms"
          />
          <CategoryInput<PrivateRoomFields>
            field={'bed_count'}
            updateFunction={update.PrivateEssentials}
            value={privateEssentials}
            label="Beds"
          />

          <div className="mb-4 flex flex-row justify-center items-center align-middle">
            <label
              className="flex-1 text-gray-700 font-bold mb-2"
              htmlFor="lockOnEveryBedroom"
            >
              Lock on Every Bedroom
            </label>
            <input
              name="lockOnEveryBedroom"
              type="checkbox"
              checked={privateEssentials.lockOnEveryBedroom}
              onChange={handleInputChange}
              className="w-3 h-3 p-2 border rounded-lg"
            />
          </div>
          <CategoryInput<PrivateRoomFields>
            field={'private_bathroom_count'}
            updateFunction={update.PrivateEssentials}
            value={privateEssentials}
            label="Private Bathrooms"
            description="It’s connected to the guest’s room and is just for them."
          />
          <CategoryInput<PrivateRoomFields>
            field={'dedicated_bathroom_count'}
            updateFunction={update.PrivateEssentials}
            value={privateEssentials}
            label="Dedicated Bathrooms"
            description="It’s private, but accessed via a shared space, like a hallway."
          />
          <CategoryInput<PrivateRoomFields>
            field={'shared_bathroom_count'}
            updateFunction={update.PrivateEssentials}
            value={privateEssentials}
            label="Shared Bathrooms"
            description="It’s shared with other people."
          />
          <div className="mb-4 flex flex-row justify-center items-center align-middle">
            <label className="flex-1 text-gray-700 font-bold mb-2">
              Encounter Type
            </label>
            <select
              name="encounterType"
              value={privateEssentials.encounterType}
              onChange={handleInputChange}
              className="w-16 h-16 p-2 border rounded-lg"
            >
              <option value="host">Host</option>
              <option value="family">Family</option>
              <option value="other_guests">Other Guests</option>
              <option value="roommates">Roommates</option>
            </select>
          </div>
        </div>
      )}
      {category === 'Shared room' && (
        <div>
          <CategoryInput<SharedRoomFields>
            field={'bathrooms'}
            updateFunction={update.SharedEssentials}
            value={sharedEssentials}
            label="Bathrooms"
          />
          <CategoryInput<SharedRoomFields>
            field={'bed_count'}
            updateFunction={update.SharedEssentials}
            value={sharedEssentials}
            label="Beds"
          />
        </div>
      )}
    </>
  );
}

export default CategoryRequiredFields;
