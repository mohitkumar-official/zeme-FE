export interface FormData {
    listingType: string;
    basic_information: {
      address: string;
      unit: string;
      floor: string;
      bedrooms: string;
      bathrooms: string;
      sqauare_feet: string;
      date_available: string;
    };
    economic_information: {
      gross_rent: string;
      security_deposit_amount: string;
      broker_fee: string;
      has_concession: boolean;
      has_another_fee: boolean;
      another_fee: {
        fee_name: string;
        fee_amount: string;
        fee_type: string;
      };
    };
    amenities: string[];
    upload_document: {
      required_documents: string[];
      optional_documents: string[];
    };
    images: { image_url: string }[];
  }
  
  export interface StepProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    errors?: Record<string, string>;
  }