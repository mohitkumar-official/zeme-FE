const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropertySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
    },
    basic_information: {
        address: { type: String, required: true },
        unit: { type: Number },
        floor: { type: Number },
        bedrooms: { type: Number, required: true },
        bathrooms: { type: Number, required: true },
        square_feet: { type: Number },
        date_available: { type: Date, required: true }
    },
    economic_information: {
        gross_rent: { type: Number, required: true },
        security_deposit_amount: { type: Number, required: true },
        broker_fee: { type: Number, required: true },
        another_fee: {
            fee_name: { type: String },
            fee_amount: { type: Number },
            fee_type: { type: String, enum: ["monthly", "one-time"] }
        }
    },
    amenities: {
        parking: { type: Boolean },
        doorman: { type: Boolean },
        gym: { type: Boolean },
        roof_deck: { type: Boolean },
        elevator_building: { type: Boolean },
        pool: { type: Boolean },
        in_unit_dishwasher: { type: Boolean },
        laundromat: { type: Boolean },
        pet_friendly: { type: Boolean },
        in_unit_laundry: { type: Boolean },
        balcony: { type: Boolean },
        stainless_steel_appliances: { type: Boolean }
    },
    upload_document: {
        required_list: {
            photo_id: { type: Boolean },
            rental_history: { type: Boolean },
            credit_check: { type: Boolean },
            employment: { type: Boolean },
            household_information: { type: Boolean }
        },
        other_information: {
            bank_statement: { type: Boolean },
            tax_returns: { type: Boolean }
        }
    },
    property_images: {
        type: [{ image_url: { type: String, required: true } }],
        validate: {
            validator: function (images) {
                return images.length >= 5 && images.length <= 25;
            },
            message: "The property must have between 5 and 25 images."
        }
    }
}, { timestamps: true });

const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
