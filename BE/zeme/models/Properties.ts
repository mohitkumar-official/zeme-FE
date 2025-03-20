import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the Property document
interface IProperty extends Document {
    user: mongoose.Types.ObjectId;
    status: 'draft' | 'published';
    basic_information: {
        address: string;
        unit?: number;
        floor?: number;
        bedrooms: number;
        bathrooms: number;
        square_feet?: number;
        date_available: Date;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    economic_information: {
        gross_rent: number;
        security_deposit_amount: number;
        broker_fee: number;
        has_another_fee: boolean;
        // another_fee?: {
        //     fee_name?: string;
        //     fee_amount?: number;
        //     fee_type?: "monthly" | "one-time";
        // };
    };
    amenities: string[];
    upload_document: {
        required_documents: string[];
        optional_documents: string[];
    }[];
    images: { image_url: string }[];
}

// Define the Property Schema
const PropertySchema: Schema<IProperty> = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // References the User model
            required: true
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
            required: true
        },
        basic_information: {
            address: { 
                type: String, 
                required: true // Always required for both draft and published
            },
            unit: { type: Number },
            floor: { type: Number },
            bedrooms: { 
                type: Number, 
                required: function(this: IProperty) {
                    return this.status === 'published';
                }
            },
            bathrooms: { 
                type: Number, 
                required: function(this: IProperty) {
                    return this.status === 'published';
                }
            },
            square_feet: { type: Number },
            date_available: { 
                type: Date, 
                required: function(this: IProperty) {
                    return this.status === 'published';
                }
            },
            coordinates: {
                lat: { type: Number },
                lng: { type: Number }
            }
        },
        economic_information: {
            gross_rent: { 
                type: Number, 
                required: function(this: IProperty) {
                    return this.status === 'published';
                }
            },
            security_deposit_amount: { 
                type: Number, 
                required: function(this: IProperty) {
                    return this.status === 'published';
                }
            },
            broker_fee: { 
                type: Number, 
                required: function(this: IProperty) {
                    return this.status === 'published';
                }
            },
            has_another_fee: { type: Boolean, default: false },
            // another_fee: {
            //     fee_name: { type: String },
            //     fee_amount: { type: Number },
            //     fee_type: { type: String, enum: ["monthly", "one-time"] },
            // }
        },
        amenities: {
            type: [String], // An array of strings
        },
        upload_document: [
            {
                required_documents: [{ type: String }],
                optional_documents: [{ type: String }],
            },
        ],
        images: {
            type: [{ 
                image_url: { 
                    type: String, 
                    required: function(this: any) {
                        // Get the parent document's status
                        const parentDoc = this.ownerDocument();
                        return parentDoc.status === 'published';
                    }
                } 
            }],
            validate: {
                validator: function(this: IProperty, images: { image_url: string }[]) {
                    if (this.status === 'published') {
                        return images.length >= 5 && images.length <= 25;
                    }
                    return true;
                },
                message: "Published properties must have between 5 and 25 images."
            },
        },
    },
    { timestamps: true }
);

// Create the Property model with the schema
const Property = mongoose.model<IProperty>("Property", PropertySchema);

export default Property;
