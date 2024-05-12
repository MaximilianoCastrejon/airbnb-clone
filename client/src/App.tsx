import AuthProvider from './context/AuthProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import * as page from './pages';
import Layout from './Layout';
import UserHeader from './components/UserHeader';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<page.HomePage />} />
            <Route path="/:id" element={<page.Listing />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<UserHeader />}>
              <Route path="/trips" element={<page.Trips />} />
              <Route path="/account" element={<page.Account />} />
              <Route
                path="/account/personal-info"
                element={<page.PersonalInfo />}
              />
              <Route
                path="/account/login-and-security"
                element={<page.LoginAndSecurity />}
              />
              <Route
                path="/account/payments/payment-methods"
                element={<page.PaymentMethods />}
              />
              <Route
                path="/account/taxes/taxpayers"
                element={<page.Taxpayers />}
              />
              <Route path="/notifications" element={<page.Notifications />} />
              <Route
                path="/account/privacy-and-sharing"
                element={<page.PrivacyAndSharing />}
              />
              <Route
                path="/account/preferences"
                element={<page.Preferences />}
              />
              <Route
                path="/account/airbnb-for-work"
                element={<page.AirbnbForWork />}
              />
              <Route
                path="/account/professional-hosting"
                element={<page.ProfHosting />}
              />
              <Route path="/invite" element={<page.Invite />} />
              <Route path="/messages" element={<page.Messages />} />
              <Route path="/wishlist" element={<page.WishList />} />
              <Route path="/profile/:id" element={<page.Profile />} />
              <Route path="/settings" element={<page.Settings />} />
              <Route path="/inbox" element={<page.Inbox />} />
            </Route>

            <Route path="/airbnb-your-home" element={<page.YourHome />} />
            <Route path="/host/homes" element={<page.HostHome />} />
            <Route path="/become-a-host" element={<page.BecomeAHost />} />
            <Route path="/refer" element={<page.Refer />} />
            <Route path="/gift-card" element={<page.GiftCard />} />
            <Route path="/help-center" element={<page.HelpCenter />} />
          </Route>
          <Route path="/*" element={<page.NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
