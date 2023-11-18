import { Link } from 'react-router-dom';

function Settings() {
  return (
    <div>
      <h2>Settings</h2>
      <ul>
        <li>
          <Link to="/settings/general">General Settings</Link>
        </li>
        <li>
          <Link to="/settings/account">Account Settings</Link>
        </li>
        {/* Add more links for other sections if needed */}
      </ul>
    </div>
  );
}

export default Settings;
