export interface FormData {
  _id?: string;
  listingType: string;
  status: 'draft' | 'published';
  basic_information: {
    address: string;
    unit: string;
    floor: string;
    bedrooms: string;
    bathrooms: string;
    sqauare_feet: string;
    date_available: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
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
  images: {
    image_url: string;
  }[];
} 