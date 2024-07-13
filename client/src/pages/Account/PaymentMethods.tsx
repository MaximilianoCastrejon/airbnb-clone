import { useEffect } from 'react';

function PaymentMethods() {
  useEffect(() => {
    console.log('loaded...');
  }, []);

  return <div>PaymentMethods</div>;
}

export default PaymentMethods;
