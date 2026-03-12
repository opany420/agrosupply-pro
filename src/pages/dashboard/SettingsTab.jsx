import React from 'react';
import { COMPANY } from '../../constants';

export default function SettingsTab() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Settings</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 max-w-2xl">
        {[
          { label: "Company Name", value: COMPANY.name },
          { label: "Email", value: COMPANY.email },
          { label: "Phone", value: COMPANY.phone },
          { label: "Address", value: COMPANY.postalFull },
        ].map(field => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <input type="text" defaultValue={field.value}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        ))}
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">Save Changes</button>
      </div>
    </div>
  );
}
