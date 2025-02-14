const router = require('express').Router();
const Property = require('../models/Properties');
const fetchuser = require('../middleware/fetchuser');
const { data } = require('autoprefixer');
const User = require('../models/User');
const Favourite = require('../models/Favourite');


router.get("/fetch-properties", fetchuser, async (req, res) => {
    try {
        // Fetch properties for the logged-in user
        const properties = await Property.find();

        // Prepare the response data with a message and the fetched properties
        const data = {
            message: "Properties fetched successfully",
            properties: properties
        };

        res.status(200).send(data); // Send the data with the custom message
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" }); // Send a structured error response
    }
});


router.post("/add", fetchuser, async (req, res) => {
    try {
        const property = new Property(req.body);
        property.user = req.user.id;
        await property.save();
        res.status(201).send(property);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});

router.post('/add-to-favourites', fetchuser, async (req, res) => {
    const userId  = req.user.id;
    const { propertyId } = req.body; // { propertyId: 'property_id' }


    try {
        // Validate if the user exists (optional)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate if the property exists (optional)
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Find if the user already has a favourites record
        let favourite = await Favourite.findOne({ userId: userId });

        if (favourite) {
            // Check if the property is already in the saved list
            const propertyIndex = favourite.propertyIds.indexOf(propertyId);

            if (propertyIndex === -1) {
                // If the property is not found, add it
                favourite.propertyIds.push(propertyId);
                await favourite.save();
                return res.status(200).json({ message: 'Property added to favourites', favourite });
            } else {
                // If the property is already in the list, remove it
                favourite.propertyIds.splice(propertyIndex, 1);
                await favourite.save();
                return res.status(200).json({ message: 'Property removed from favourites', favourite });
            }
        } else {
            // If no favourite record exists, create one and add the property
            favourite = new Favourite({
                userId:userId,
                propertyIds: [propertyId] // Add the first property to the list
            });

            // Save the new favourite record
            await favourite.save();

            return res.status(200).json({ message: 'Property added to favourites', favourite });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;