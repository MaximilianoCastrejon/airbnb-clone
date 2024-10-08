import { InputEvent } from '../../../interfaces/input.interfaces';
import {
  EntirePlaceFields,
  Listing,
  PrivateRoomFields,
  SharedRoomFields,
  ReservationTypeNames
} from '../../../interfaces/listing.interfaces';
import ReservationTypeInput from './ReservationTypeInput';

// Bathrooms are counted as either half bathrooms or full ones
const HALF_STEP = 0.5;
const UNIT_STEP = 1;

interface Props<T extends ReservationTypeNames> {
  reservationType: T;
  state: Listing;
  stateSetter: React.Dispatch<React.SetStateAction<Listing>>;
}

function ReservationTypeForm<T extends ReservationTypeNames>({
  reservationType,
  state,
  stateSetter
}: Props<T>) {
  const handleInputChange = (e: InputEvent) => {
    const { name, value, type } = e.target;
    stateSetter((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.ariaChecked : value
    }));
  };
  const updateCounter =
    <T,>() =>
    (field: keyof T, stepInterval: number) => {
      const minValue: number = 0;
      const maxValue: number = 50;

      stateSetter((prev) => {
        const value = (prev[field as keyof Listing] as number) + stepInterval;
        const newValue =
          value > maxValue ? maxValue : value < minValue ? minValue : value;

        return {
          ...prev,
          [field]: newValue
        };
      });
    };

  const entirePlaceCounter = updateCounter<EntirePlaceFields>();
  const privateRoomCounter = updateCounter<PrivateRoomFields>();
  const sharedRoomCounter = updateCounter<SharedRoomFields>();

  return (
    <>
      {reservationType === 'Entire place' && (
        <div>
          <ReservationTypeInput
            onAdd={() => entirePlaceCounter('bedroom_count', UNIT_STEP)}
            onSubstract={() => entirePlaceCounter('bedroom_count', -UNIT_STEP)}
            value={state.bedroom_count}
            label="Bedrooms"
          />
          <ReservationTypeInput
            onAdd={() => entirePlaceCounter('bed_count', UNIT_STEP)}
            onSubstract={() => entirePlaceCounter('bed_count', -UNIT_STEP)}
            value={state.bed_count}
            label="Beds"
          />
          <ReservationTypeInput
            onAdd={() => entirePlaceCounter('bathrooms', HALF_STEP)}
            onSubstract={() => entirePlaceCounter('bathrooms', -HALF_STEP)}
            value={state.bathrooms}
            label="Bathrooms"
          />
        </div>
      )}
      {reservationType === 'Private room' && (
        <div>
          <ReservationTypeInput
            onAdd={() => privateRoomCounter('bedroom_count', UNIT_STEP)}
            onSubstract={() => privateRoomCounter('bedroom_count', -UNIT_STEP)}
            value={state.bedroom_count}
            label="Bedrooms"
          />
          <ReservationTypeInput
            onAdd={() => privateRoomCounter('bed_count', UNIT_STEP)}
            onSubstract={() => privateRoomCounter('bed_count', -UNIT_STEP)}
            value={state.bed_count}
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
              checked={state.lockOnEveryBedroom}
              onChange={handleInputChange}
              className="w-3 h-3 p-2 border rounded-lg"
            />
          </div>
          <ReservationTypeInput
            onAdd={() =>
              privateRoomCounter('private_bathroom_count', HALF_STEP)
            }
            onSubstract={() =>
              privateRoomCounter('private_bathroom_count', -HALF_STEP)
            }
            value={state}
            label="Private Bathrooms"
            description="It’s connected to the guest’s room and is just for them."
          />
          <ReservationTypeInput
            onAdd={() =>
              privateRoomCounter('dedicated_bathroom_count', HALF_STEP)
            }
            onSubstract={() =>
              privateRoomCounter('dedicated_bathroom_count', -HALF_STEP)
            }
            value={state.dedicated_bathroom_count}
            label="Dedicated Bathrooms"
            description="It’s private, but accessed via a shared space, like a hallway."
          />
          <ReservationTypeInput
            onAdd={() => privateRoomCounter('shared_bathroom_count', HALF_STEP)}
            onSubstract={() =>
              privateRoomCounter('shared_bathroom_count', -HALF_STEP)
            }
            value={state.shared_bathroom_count}
            label="Shared Bathrooms"
            description="It’s shared with other people."
          />
          <div className="mb-4 flex flex-row justify-center items-center align-middle">
            <label className="flex-1 text-gray-700 font-bold mb-2">
              Encounter Type
            </label>
            <select
              name="encounterType"
              value={state.encounter_type}
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
      {reservationType === 'Shared room' && (
        <div>
          <ReservationTypeInput
            onAdd={() => sharedRoomCounter('bathrooms', HALF_STEP)}
            onSubstract={() => sharedRoomCounter('bathrooms', -HALF_STEP)}
            value={state.bathrooms}
            label="Bathrooms"
          />
          <ReservationTypeInput
            onAdd={() => sharedRoomCounter('bed_count', UNIT_STEP)}
            onSubstract={() => sharedRoomCounter('bed_count', -UNIT_STEP)}
            value={state.bed_count}
            label="Beds"
          />
        </div>
      )}
    </>
  );
}

export default ReservationTypeForm;
