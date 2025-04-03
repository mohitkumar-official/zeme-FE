import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MultiStepPropertyForm from './MultiStepForm';
import { FormData } from '../types/property';
import { Pencil } from 'lucide-react';

interface Property extends FormData {
    updatedAt: string;
}

const DraftProperties: React.FC = () => {
    const [drafts, setDrafts] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);

    const fetchDrafts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/property/drafts', {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch drafts');
            }

            const data = await response.json();
            console.log('Fetched drafts:', data.drafts); // Debug log
            setDrafts(data.drafts);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Add this function to fetch complete property data
    const handleContinueEditing = async (draft: Property) => {
        try {
            const response = await fetch(`http://localhost:8000/api/property/${draft._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch property details');
            }

            const data = await response.json();
            setEditingProperty(data.property);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    if (loading) {
        return <div>Loading drafts...</div>;
    }

    if (drafts.length === 0) {
        return <div>No draft properties found.</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Draft Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {drafts.map((draft) => (
                    <div key={draft._id} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="relative aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
                            {draft.images && draft.images[0] ? (
                                <img
                                    src={`http://localhost:8000${draft.images[0].image_url}`}
                                    alt="Property"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    No Image
                                </div>
                            )}
                            <button
                                onClick={() => handleContinueEditing(draft)}
                                className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                                title="Continue Editing"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-medium">
                                {draft.basic_information?.address || 'Address not set'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {editingProperty && (
                <MultiStepPropertyForm
                    onClose={() => {
                        setEditingProperty(null);
                        fetchDrafts(); // Refresh the drafts list after closing
                    }}
                    editMode={true}
                    propertyData={editingProperty}
                />
            )}
        </div>
    );
};

export default DraftProperties; 