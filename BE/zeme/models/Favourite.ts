import mongoose, { Document, Schema } from 'mongoose';

interface IFavourite extends Document {
    userId: mongoose.Types.ObjectId;
    propertyIds: mongoose.Types.ObjectId[];
    savedAt: Date;
}

const favouriteSchema: Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Store userId as ObjectId
        required: true,
    },
    propertyIds: {
        type: [mongoose.Schema.Types.ObjectId],  // Array of ObjectIds for multiple properties
        required: true,  // Make sure propertyIds is required
    },
    savedAt: {
        type: Date,
        default: Date.now  // Store the timestamp of when the property is added
    }
});

const Favourite = mongoose.model<IFavourite>('Favourite', favouriteSchema);

export default Favourite;
