import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_INDIAN_CITIES = [
  { city: 'Mumbai', pincode: '400001', state: 'Maharashtra' },
  { city: 'Bengaluru', pincode: '560038', state: 'Karnataka' },
  { city: 'Delhi NCR', pincode: '110001', state: 'Delhi' },
  { city: 'Hyderabad', pincode: '500081', state: 'Telangana' },
  { city: 'Chennai', pincode: '600001', state: 'Tamil Nadu' },
  { city: 'Kolkata', pincode: '700001', state: 'West Bengal' },
  { city: 'Pune', pincode: '411001', state: 'Maharashtra' },
  { city: 'Ahmedabad', pincode: '380001', state: 'Gujarat' },
  { city: 'Jaipur', pincode: '302001', state: 'Rajasthan' },
  { city: 'Lucknow', pincode: '226001', state: 'Uttar Pradesh' },
  { city: 'Chandigarh', pincode: '160001', state: 'Punjab' },
  { city: 'Kochi', pincode: '682001', state: 'Kerala' },
];

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { deliveryLocation, updateDeliveryLocation } = useShop();
  const [customPincode, setCustomPincode] = useState('');
  const [customCity, setCustomCity] = useState('');

  if (!isOpen) return null;

  const handleSelectCity = (city: string, pincode: string) => {
    updateDeliveryLocation(city, pincode);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPincode.length >= 6) {
      updateDeliveryLocation(customCity || 'Custom Location', customPincode);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              Choose Delivery Location
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-500">
            Select your city to check product stock, delivery timelines, and special local deals.
          </p>

          {/* Custom Pin Code Form */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={customPincode}
              onChange={(e) => setCustomPincode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter 6-digit Indian PIN Code"
              className="flex-1 px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={customPincode.length < 6}
              className="px-4 py-2 bg-orange-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Apply
            </button>
          </form>

          {/* Popular Cities Grid */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Popular Cities & Metros
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
              {POPULAR_INDIAN_CITIES.map((item) => {
                const isCurrent =
                  deliveryLocation.city.toLowerCase() === item.city.toLowerCase();
                return (
                  <button
                    key={item.pincode}
                    onClick={() => handleSelectCity(item.city, item.pincode)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'border-orange-500 bg-orange-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {item.city}
                      </span>
                      {isCurrent && <Check className="w-3 h-3 text-orange-600" />}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {item.pincode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
