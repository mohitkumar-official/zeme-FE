import React, { useState, useEffect, useRef } from 'react';
import { BasicInformation } from './forms/steps/BasicInformation';
import { EconomicInformation } from './forms/steps/EconomicInformation';
import { AmenitiesSelection } from './forms/steps/AmenitiesSelection';
import { DocumentSelection } from './forms/steps/Documents';
import { ImageUpload } from './forms/steps/UploadImages';
import { toast } from 'react-toastify';
import { FormData } from '../types/property';
import { ChevronLeft, ChevronRight, Save, X } from 'lucide-react'; // Imported X for the close icon
import { useNavigate } from 'react-router-dom';
import PropertyPreviewModal from './PropertyPreviewModal';

interface MultiStepPropertyFormProps {
  onClose: () => void;
  editMode?: boolean;
  propertyData?: FormData;
}

export const MultiStepForm: React.FC<MultiStepPropertyFormProps> = ({ onClose, editMode = false, propertyData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(() => ({
    listingType: 'exclusive',
    status: 'draft',
    basic_information: {
      address: '',
      unit: '',
      floor: '',
      bedrooms: '',
      bathrooms: '',
      sqauare_feet: '',
      date_available: '',
    },
    economic_information: {
      gross_rent: '',
      security_deposit_amount: '',
      broker_fee: '',
      has_concession: false,
      has_another_fee: false,
      another_fee: {
        fee_name: '',
        fee_amount: '',
        fee_type: '',
      },
    },
    amenities: [],
    upload_document: {
      required_documents: [],
      optional_documents: [],
    },
    images: [],
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (editMode && propertyData) {
      setFormData(propertyData);
    }
  }, [editMode, propertyData]);

  const handleSubmit = async (saveAsDraft: boolean = false) => {
    console.log(saveAsDraft);
    try {
      setIsSaving(true);
      // If not saving as draft, validate all required fields
      if (!saveAsDraft && !validateAllSteps()) {
        toast.error('Please fill in all required fields before publishing');
        setIsSaving(false);
        return;
      }

      const submitData = {
        ...formData,
        status: saveAsDraft ? 'draft' : 'published'
      };

      let response;
      if (editMode && propertyData?._id) {
        // Update both property data and status for existing properties
        response = await fetch(`http://localhost:8000/api/property/${propertyData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token') || '',
          },
          body: JSON.stringify(submitData),
        });
      } else {
        // Use the add endpoint for new properties
        response = await fetch('http://localhost:8000/api/property/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('token') || '',
          },
          body: JSON.stringify(submitData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save property.');
      }

      toast.success(`Property ${saveAsDraft ? 'saved as draft' : 'published'} successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });

      onClose();
    } catch (error: any) {
      toast.error(error.message, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const validateAllSteps = (): boolean => {
    let isValid = true;
    let newErrors: Record<string, string> = {};

    // Basic Information validation
    const { address, bedrooms, bathrooms, date_available } = formData.basic_information;
    if (!address) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    if (!bedrooms) {
      newErrors.bedrooms = 'Bedrooms are required';
      isValid = false;
    }
    if (!bathrooms) {
      newErrors.bathrooms = 'Bathrooms are required';
      isValid = false;
    }
    if (!date_available) {
      newErrors.date_available = 'Availability date is required';
      isValid = false;
    }

    // Economic Information validation
    const { gross_rent, security_deposit_amount, broker_fee } = formData.economic_information;
    if (!gross_rent) {
      newErrors.gross_rent = 'Gross rent is required';
      isValid = false;
    }
    if (!security_deposit_amount) {
      newErrors.security_deposit_amount = 'Security deposit is required';
      isValid = false;
    }
    if (!broker_fee) {
      newErrors.broker_fee = 'Broker fee is required';
      isValid = false;
    }

    // Image validation
    if (formData.images.length < 5) {
      newErrors.images = 'At least 5 images are required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep = (): boolean => {
    let newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) {
      const { address, unit, bedrooms, bathrooms, date_available } = formData.basic_information;
      if (!address?.trim()) {
        newErrors.address = 'Address is required';
        isValid = false;
      }
      if (!unit || String(unit).trim() === '') {
        newErrors.unit = 'Unit number is required';
        isValid = false;
      }
      if (!bedrooms) {
        newErrors.bedrooms = 'Number of bedrooms is required';
        isValid = false;
      }
      if (!bathrooms) {
        newErrors.bathrooms = 'Number of bathrooms is required';
        isValid = false;
      }
      if (!date_available) {
        newErrors.date_available = 'Date available is required';
        isValid = false;
      }
    } else if (currentStep === 2) {
      const { gross_rent, security_deposit_amount, broker_fee } = formData.economic_information;
      if (!gross_rent || parseFloat(gross_rent) <= 0) {
        newErrors.gross_rent = 'Valid gross rent amount is required';
        isValid = false;
      }
      if (!security_deposit_amount || parseFloat(security_deposit_amount) <= 0) {
        newErrors.security_deposit_amount = 'Valid security deposit amount is required';
        isValid = false;
      }
      if (!broker_fee || parseFloat(broker_fee) <= 0) {
        newErrors.broker_fee = 'Valid broker fee is required';
        isValid = false;
      }
    } else if (currentStep === 5) {
      if (formData.images.length < 5) {
        newErrors.images = 'At least five images are required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    
    if (!isValid) {
      toast.error('Please fill in all required fields');
    }
    
    return isValid;
  };

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === 5) {
        if (validateAllSteps()) {
          setShowPreview(true);
        } else {
          toast.error('Please complete all required fields before previewing');
        }
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, 5));
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-[800px] h-[80vh] max-h-[80vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {editMode ? 'Edit Property' : 'Add New Property'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 rounded-full" />
              <div
                className="absolute left-0 right-0 top-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step < currentStep
                        ? 'bg-blue-600 text-white shadow-md'
                        : step === currentStep
                        ? 'bg-white border-2 border-blue-600 text-blue-600 shadow-md'
                        : 'bg-white border-2 border-gray-200 text-gray-400'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium transition-colors duration-200 ${
                      step === currentStep ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step === 1 && 'Basic Information'}
                    {step === 2 && 'Economic Information'}
                    {step === 3 && 'Select Amenities'}
                    {step === 4 && 'Documents'}
                    {step === 5 && 'Upload Images'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {currentStep === 1 && (
              <BasicInformation
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}
             {currentStep === 2 && (
              <EconomicInformation
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}
            {currentStep === 3 && (
              <AmenitiesSelection
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {currentStep === 4 && (
              <DocumentSelection
                formData={formData}
                setFormData={setFormData}
              />
            )}
            {currentStep === 5 && (
              <ImageUpload
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => handleSubmit(true)}
                className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Save className="w-5 h-5 mr-1" />
                Save as Draft
              </button>
              <button
                onClick={handleNext}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentStep === 5 ? 'Preview' : 'Next'}
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPreview && (
        <PropertyPreviewModal
          property={formData}
          onPublish={handleSubmit}
        />
      )}
    </>
  );
};

export default MultiStepForm;
