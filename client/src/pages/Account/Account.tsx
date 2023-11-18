import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import AccountOptionCard from '../../components/AccountOptionCard';

function Account() {
  const { userContext } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="md:max-w-2xl lg:max-w-5xl max-w-xl m-auto">
      <div className="my-12 ml-4">
        <h1 className="font-semibold text-3xl">Account</h1>
        <p>
          <span className="font-semibold">{userContext?.username}</span>,{' '}
          {userContext?.email} ·{' '}
          <span
            onClick={() => navigate('/profile')}
            className="font-semibold underline cursor-pointer"
          >
            Go to profile
          </span>
        </p>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center w-full">
        {options.map((option) => (
          <AccountOptionCard
            key={option.key}
            path={option.data.path}
            page={option.data.page}
            name={option.data.name}
            description={option.data.description}
          />
        ))}
      </div>
    </div>
  );
}

const options = [
  {
    key: 'personal_info',
    data: {
      path: 'M26 2a1 1 0 0 1 .92.61l.04.12 2 7a1 1 0 0 1-.85 1.26L28 11h-3v5h6v2h-2v13h-2v-2.54a3.98 3.98 0 0 1-1.73.53L25 29H7a3.98 3.98 0 0 1-2-.54V31H3V18H1v-2h5v-4a1 1 0 0 1 .88-1h.36L6.09 8.4l1.82-.8L9.43 11H12a1 1 0 0 1 1 .88V16h10v-5h-3a1 1 0 0 1-.99-1.16l.03-.11 2-7a1 1 0 0 1 .84-.72L22 2h4zm1 16H5v7a2 2 0 0 0 1.7 1.98l.15.01L7 27h18a2 2 0 0 0 2-1.85V18zm-16-5H8v3h3v-3zm14.24-9h-2.49l-1.43 5h5.35l-1.43-5z',
      page: '/account/personal-info',
      name: 'Personal Information',
      description: 'Provide personal details and how we can reach you'
    }
  },
  {
    key: 'login_and_secutirity',
    data: {
      path: 'm16 .8.56.37C20.4 3.73 24.2 5 28 5h1v12.5C29 25.57 23.21 31 16 31S3 25.57 3 17.5V5h1c3.8 0 7.6-1.27 11.45-3.83L16 .8zm-1 3a22.2 22.2 0 0 1-9.65 3.15L5 6.97V17.5c0 6.56 4.35 11 10 11.46zm2 0v25.16c5.65-.47 10-4.9 10-11.46V6.97l-.35-.02A22.2 22.2 0 0 1 17 3.8z',
      page: '/account/login-and-security',
      name: 'Login & Security',
      description: 'Update your password and secure your account'
    }
  },
  {
    key: 'payments_and_payouts',
    data: {
      path: 'M25 4a2 2 0 0 1 2 1.85V8h2.04c1.04 0 1.88.82 1.96 1.85V26c0 1.05-.8 1.92-1.81 2H6.96a1.98 1.98 0 0 1-1.95-1.85L5 26v-2H3a2 2 0 0 1-2-1.85V6a2 2 0 0 1 1.85-2H3zm2 18a2 2 0 0 1-1.85 2H7v2h22V10h-2zM25 6H3v16h22zm-3 12a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-8-8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
      page: '/account/payments/payment-methods',
      name: 'Payments & payouts',
      description: 'Review payments, payouts, coupons, and gift cards'
    }
  },
  {
    key: 'taxes',
    data: {
      path: 'M28.41 10 20 1.59A2.01 2.01 0 0 0 18.59 1H8a5 5 0 0 0-5 5v20a5 5 0 0 0 5 5h16a5 5 0 0 0 5-5V11.41a1.99 1.99 0 0 0-.59-1.41ZM19 3.41 26.59 11H22a3 3 0 0 1-3-3ZM27 26a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h9v5a5 5 0 0 0 5 5h5Z',
      page: '/account/taxes/taxpayers',
      name: 'Taxes',
      description: 'Manage taxpayer information and tax documents'
    }
  },
  {
    key: 'notifications',
    data: {
      path: 'M30.83 3.73a2 2 0 0 0-2.64-1.02L11.79 10H7a6 6 0 0 0-.26 12H11v7h2v-6.46l15.19 6.75A2 2 0 0 0 31 27.46V4.54a2.02 2.02 0 0 0-.17-.81ZM6.82 20A4 4 0 0 1 7 12h4v8H7.02ZM29 27.46l-16-7.1v-8.71l16-7.11Z',
      page: '/account/notifications',
      name: 'Notifications',
      description:
        'Choose notification preferences and how you want to be contacted'
    }
  },
  {
    key: 'privacy_and_sharing',
    data: {
      path: 'M16 27A15.57 15.57 0 0 1 1.48 16.94l-.1-.3.13-.51a15 15 0 0 1 28.98-.01l.14.53-.11.3A15.58 15.58 0 0 1 16 27zM3.47 16.53a13.5 13.5 0 0 0 25.06 0 13 13 0 0 0-25.06 0zM16 21a5 5 0 1 1 5-5 5 5 0 0 1-5 5zm0-8a3 3 0 1 0 3 3 3 3 0 0 0-3-3z',
      page: '/account/privacy-and-sharing',
      name: 'Privacy & sharing',
      description:
        'Manage your personal data, connected services, and data sharing settings'
    }
  },
  {
    key: 'global_preferences',
    data: {
      path: 'M24 31a7 7 0 0 0 0-14H8a7 7 0 0 0 0 14zm5-7a5 5 0 1 1-5-5 5 5 0 0 1 5 5zM3 24a5 5 0 0 1 5-5h11.11a6.98 6.98 0 0 0 0 10H8a5 5 0 0 1-5-5zM24 1H8a7 7 0 0 0 0 14h16a7 7 0 0 0 0-14zM3 8a5 5 0 1 1 5 5 5 5 0 0 1-5-5zm21 5H12.89a6.98 6.98 0 0 0 0-10H24a5 5 0 0 1 0 10z',
      page: '/account/preferences',
      name: 'Global preferences',
      description: 'Set your default language, currency, and timezone'
    }
  },
  {
    key: 'travel_for_work',
    data: {
      path: 'M26 2a1 1 0 0 1 .92.61l.04.12 2 7a1 1 0 0 1-.85 1.26L28 11h-3v5h6v2h-2v13h-2v-2.54a3.98 3.98 0 0 1-1.73.53L25 29H7a3.98 3.98 0 0 1-2-.54V31H3V18H1v-2h5v-4a1 1 0 0 1 .88-1h.36L6.09 8.4l1.82-.8L9.43 11H12a1 1 0 0 1 1 .88V16h10v-5h-3a1 1 0 0 1-.99-1.16l.03-.11 2-7a1 1 0 0 1 .84-.72L22 2h4zm1 16H5v7a2 2 0 0 0 1.7 1.98l.15.01L7 27h18a2 2 0 0 0 2-1.85V18zm-16-5H8v3h3v-3zm14.24-9h-2.49l-1.43 5h5.35l-1.43-5z',
      page: '/account/airbnb-for-work',
      name: 'Travel for work',
      description: 'Add a work email for business trip benefits'
    }
  },
  {
    key: 'professional_hosting_tools',
    data: {
      path: 'M27 5h-4a2 2 0 0 0-2 2v4h-4V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v8H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zM9 29H5V13h4zm6 0h-4V3h4zm6 0h-4V13h4zm6 0h-4V7h4z',
      page: '/account/professional-hosting',
      name: 'Professional hosting tools',
      description:
        'Get professional tools if you manage several properties on Airbnb'
    }
  },
  {
    key: 'referral',
    data: {
      path: 'M28 2a2 2 0 0 1 2 1.85V28a2 2 0 0 1-1.85 2H4a2 2 0 0 1-2-1.85V4a2 2 0 0 1 1.85-2H4zM13.59 17H4v11h11v-9.59l-4.3 4.3-1.4-1.42zM28 17h-9.59l4.3 4.3-1.42 1.4L17 18.42V28h11zM15 4H4v11h3.54a4 4 0 0 1 6.28-4.84c.29.28.68.85 1.18 1.74zm6 7c-.53 0-.98.17-1.42.6-.21.2-.63.87-1.22 1.98l-.25.47-.5.95H21a2 2 0 0 0 1.98-1.7l.01-.15L23 13a2 2 0 0 0-2-2zm7-7H17v7.9c.5-.89.89-1.46 1.18-1.74A4 4 0 0 1 24.46 15H28zm-17 7a2 2 0 0 0-2 2v.15A2 2 0 0 0 11 15h3.38l-.49-.95-.36-.69c-.54-.98-.91-1.58-1.1-1.76-.45-.43-.9-.6-1.43-.6z',
      page: '/account/refer',
      name: 'Referral credit & coupon',
      description: 'You have $0 MXN referral credits and coupon. Learn more.'
    }
  }
];

export default Account;
