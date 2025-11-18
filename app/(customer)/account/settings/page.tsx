"use client";

import { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";

// Helper component for the toggle switch
const ToggleSwitch = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-gray-700">{label}</span>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-800"></div>
    </label>
  </div>
);

// Main page component
export default function CommunicationSettingsPage() {
  const [orderSettings, setOrderSettings] = useState({
    push: true,
    emails: false,
    sms: false,
  });

  const [promoSettings, setPromoSettings] = useState({
    push: true,
    emails: true,
    sms: false,
  });

  const handleOrderChange = (
    key: keyof typeof orderSettings,
    checked: boolean
  ) => {
    setOrderSettings((prev) => ({ ...prev, [key]: checked }));
  };

  const handlePromoChange = (
    key: keyof typeof promoSettings,
    checked: boolean
  ) => {
    setPromoSettings((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <>
      <div className="card mb-6">
        <h2 className="text-lg font-semibold flex items-center">
          <IoNotificationsOutline className="text-orange-800 text-xl mr-2 mt-1" />
          Notification Setting
        </h2>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md"> 
        <section className="mb-8">
          <div className="flex items-start mb-2">
            <h3 className="text-xl font-medium text-gray-800">Order Status</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Receive notifications about the progress of your orders.
          </p>

          <div className="pl-4">
            <ToggleSwitch
              label="Push Notification"
              checked={orderSettings.push}
              onChange={(checked) => handleOrderChange("push", checked)}
            />
            <ToggleSwitch
              label="Emails"
              checked={orderSettings.emails}
              onChange={(checked) => handleOrderChange("emails", checked)}
            />
            <ToggleSwitch
              label="SMS"
              checked={orderSettings.sms}
              onChange={(checked) => handleOrderChange("sms", checked)}
            />
          </div>
        </section>

        <hr className="my-6 border-gray-200" />

        {/* Promotional Offers Section */}
        <section>
          <div className="flex items-start mb-2">
            {/* Using a placeholder for the "A" icon shown in the image */}
            <h3 className="text-xl font-medium text-gray-800">
              Promotional Offers
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            Be notified about exclusive deals and discounts.
          </p>

          <div className="pl-4">
            <ToggleSwitch
              label="Push Notification"
              checked={promoSettings.push}
              onChange={(checked) => handlePromoChange("push", checked)}
            />
            <ToggleSwitch
              label="Emails"
              checked={promoSettings.emails}
              onChange={(checked) => handlePromoChange("emails", checked)}
            />
            <ToggleSwitch
              label="SMS"
              checked={promoSettings.sms}
              onChange={(checked) => handlePromoChange("sms", checked)}
            />
          </div>
        </section>

        {/* Save and Cancel Buttons (as suggested by the hidden part of the image) */}
        <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
          <button className="btn btn-gray mr-4">
            Cancel
          </button>
          <button className="btn btn-orange">
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
