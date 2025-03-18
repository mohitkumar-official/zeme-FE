import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EconomicInformationProps {
  formData: {
    economic_information: {
      gross_rent: string | null;
      has_concession: boolean | null;
      security_deposit_amount: string | null;
      broker_fee: string | null;
      has_another_fee: boolean | null;
    };
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: {
    gross_rent?: string;
    security_deposit_amount?: string;
    broker_fee?: string;
  };
}

export function EconomicInformation({ formData, setFormData, errors }: EconomicInformationProps) {
  // Helper function to get safe string value
  const getSafeValue = (value: string | null): string => value || '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev:EconomicInformationProps['formData']) => ({
      ...prev,
      economic_information: {
        ...prev.economic_information,
        [name]: type === 'checkbox' ? checked : value,
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Enter some economic information</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            GROSS RENT<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="gross_rent"
            value={getSafeValue(formData.economic_information.gross_rent)}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="$2,000"
            required
          />
          {errors.gross_rent && <p className="text-red-500 text-sm mt-1">{errors.gross_rent}</p>}
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            Does this listing include a concession? <HelpCircle className="h-4 w-4 text-gray-400" />
          </label>
          <div className="mt-2 flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="has_concession"
                checked={formData.economic_information.has_concession === true}
                onChange={() => setFormData((prev:EconomicInformationProps['formData']) => ({ 
                  ...prev, 
                  economic_information: { 
                    ...prev.economic_information, 
                    has_concession: true 
                  }
                }))}
                className="text-blue-500"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="has_concession"
                checked={formData.economic_information.has_concession === false}
                onChange={() => setFormData((prev:EconomicInformationProps['formData']) => ({ 
                  ...prev, 
                  economic_information: { 
                    ...prev.economic_information, 
                    has_concession: false 
                  }
                }))}
                className="text-blue-500"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Upfront Costs</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SECURITY DEPOSIT AMOUNT<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="security_deposit_amount"
                value={getSafeValue(formData.economic_information.security_deposit_amount)}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="$2,000"
                required
              />
              {errors.security_deposit_amount && <p className="text-red-500 text-sm mt-1">{errors.security_deposit_amount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                BROKER FEE<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="broker_fee"
                value={getSafeValue(formData.economic_information.broker_fee)}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="$2,000"
                required
              />
              {errors.broker_fee && <p className="text-red-500 text-sm mt-1">{errors.broker_fee}</p>}
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            Would you like to add another fee?
          </label>
          <div className="mt-2 flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="has_another_fee"
                checked={formData.economic_information.has_another_fee === true}
                onChange={() => setFormData((prev:EconomicInformationProps['formData']) => ({
                  ...prev,
                  economic_information: { 
                    ...prev.economic_information, 
                    has_another_fee: true 
                  }
                }))}
                className="text-blue-500"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="has_another_fee"
                checked={formData.economic_information.has_another_fee === false}
                onChange={() => setFormData((prev:EconomicInformationProps['formData']) => ({
                  ...prev,
                  economic_information: { 
                    ...prev.economic_information, 
                    has_another_fee: false 
                  }
                }))}
                className="text-blue-500"
              />
              <span>No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
