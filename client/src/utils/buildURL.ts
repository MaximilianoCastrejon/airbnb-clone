import { QueryFields } from '../interfaces/query.interfaces';
import { API_URL } from '../config';
//TODO: Set params indepently according to values in function
const buildURL = ({
  endPoint,
  count,
  query,
  numericFields
}: QueryFields): URL => {
  const url = new URL(`${API_URL}${endPoint}`);

  if (numericFields && numericFields?.length > 0) {
    const joinedNumericFields = numericFields
      .map((param) => Object.values(param).join(''))
      .join(',');
    url.searchParams.append(
      'numericFields',
      JSON.stringify(joinedNumericFields)
    );
  }
  url.searchParams.append('query', JSON.stringify(query));
  url.searchParams.append('count', JSON.stringify(count));

  return url;
};

export default buildURL;
