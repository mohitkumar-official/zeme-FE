// Define type for amenity and document options
type Option = {
  id: string;
  label: string;
  icon: string;
};

// Define Bedroom and Bathroom options as strings
export const BEDROOM_OPTIONS: string[] = ['Studio', '1', '2', '3', '4', '5'];
export const BATHROOM_OPTIONS: string[] = ['1', '1.5', '2', '2.5', '3', '3.5'];

// Define Amenity options with the Option type
export const AMENITY_OPTIONS: Option[] = [
  { id: 'parking', label: 'Parking', icon: '🅿️' },
  { id: 'doorman', label: 'Doorman', icon: '👨' },
  { id: 'gym', label: 'GYM', icon: '💪' },
  { id: 'roofDeck', label: 'Roof Deck', icon: '🏠' },
  { id: 'elevator', label: 'Elevator Building', icon: '🛗' },
  { id: 'pool', label: 'Pool', icon: '🏊' },
  { id: 'dishwasher', label: 'In-Unit Dishwasher', icon: '🍽️' },
  { id: 'laundromat', label: 'Laundromat', icon: '🧺' },
  { id: 'petFriendly', label: 'Pet Friendly', icon: '🐾' },
  { id: 'inUnitLaundry', label: 'In-unit Laundry', icon: '👕' },
  { id: 'balcony', label: 'Balcony', icon: '🏗️' },
  { id: 'stainlessSteel', label: 'Stainless Steel Appliances', icon: '🍳' }
];

// Define Required Documents using the Option type
export const REQUIRED_DOCUMENTS: Option[] = [
  { id: 'photoId', label: 'Photo ID', icon: '🪪' },
  { id: 'rentalHistory', label: 'Rental History', icon: '📋' },
  { id: 'employment', label: 'Employment', icon: '💼' },
  { id: 'creditCheck', label: 'Credit Check', icon: '💳' },
  { id: 'householdInfo', label: 'Household Information', icon: '👥' }
];

// Define Optional Documents using the Option type
export const OPTIONAL_DOCUMENTS: Option[] = [
  { id: 'bankStatements', label: 'Bank Statements', icon: '🏦' },
  { id: 'taxReturns', label: 'Tax Returns', icon: '📑' }
];
