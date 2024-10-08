import { HTTPErrorInterface } from '../interfaces/error.interfaces';

async function handleHttpError(
  response: Response,
  context?: string
): Promise<never> {
  const contentType = response.headers.get('content-type');
  let errorDetails: any;
  const url = response.url;

  if (contentType?.includes('application/json')) {
    errorDetails = await response.json();
  } else if (contentType?.includes('text/html')) {
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const errorTitle = doc.querySelector('title')?.innerText || 'Unknown Error';

    errorDetails = { htmlError: errorTitle, rawHTML: html };
  } else if (contentType?.includes('text/plain')) {
    errorDetails = await response.text();
  } else {
    errorDetails = 'Unknown error format';
  }
  throw {
    type: 'HTTPError',
    context,
    error: {
      status: response.status,
      statusText: response.statusText,
      errorDetails: errorDetails,
      url
    }
  } as HTTPErrorInterface;
}
export default handleHttpError;

/*      USE CASE EXAMPLE
const [fetchError, setFetchError] = useCustomError()
async function fetchData(url: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      await handleHttpError(response, context);
    }

    const data = await response.json(); // If successful, process the response data
    return data;
  } catch (error) {
    console.error('Error caught:', error);

    // You can now access the properties of the thrown object
    console.log('Error type:', error.type);           // 'HTTPError'
    console.log('Status:', error.error.status);             // e.g., 404
    console.log('Status text:', error.error.statusText);    // e.g., 'Not Found'
    console.log('Error details:', error.error.errorDetails);     // Additional details based on content type
    console.log('URL:', error.error.url);                   // URL that caused the error

    // If you want to specify that 
    setFetchError(error)
  }
}
*/
