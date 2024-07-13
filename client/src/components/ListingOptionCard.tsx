import { ListingSubCategory } from '../interfaces/listing.interfaces';

function ListingOptionCard({ option }: { option: ListingSubCategory }) {
  return (
    <div key={option._id} className="border border-neutral-200 rounded-xl">
      <div className="p-4">
        <div className="w-full block justify-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="block fill-current w-6 h-6 "
          >
            <path d={option.icon_svg}></path>
          </svg>
        </div>
        <span className="block text-start ">{option.name}</span>
      </div>
    </div>
  );
}

export default ListingOptionCard;
