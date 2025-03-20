interface Location {
    area: string;
    address: string;
    coordinates: {
        lat: number;
        long: number;
    };
    type: string;
    importance: number;
    boundingbox: string[];
}

interface LocationConfig {
    [key: string]: Location[];
}

export const nycLocations: LocationConfig = {
    manhattan: [
        {
            area: "Harlem, New York City",
            address: "Harlem, Manhattan, New York City, New York, United States",
            coordinates: { lat: 40.8116, long: -73.9465 },
            type: "neighbourhood",
            importance: 0.8,
            boundingbox: ["40.8016", "40.8216", "-73.9565", "-73.9365"]
        },
        {
            area: "Upper East Side, New York City",
            address: "Upper East Side, Manhattan, New York City, New York, United States",
            coordinates: { lat: 40.7731, long: -73.9592 },
            type: "neighbourhood",
            importance: 0.8,
            boundingbox: ["40.7631", "40.7831", "-73.9692", "-73.9492"]
        },
        {
            area: "Upper West Side, New York City",
            address: "Upper West Side, Manhattan, New York City, New York, United States",
            coordinates: { lat: 40.7870, long: -73.9754 },
            type: "neighbourhood",
            importance: 0.8,
            boundingbox: ["40.7770", "40.7970", "-73.9854", "-73.9654"]
        },
        {
            area: "Midtown Manhattan, New York City",
            address: "Midtown Manhattan, New York City, New York, United States",
            coordinates: { lat: 40.7549, long: -73.9840 },
            type: "neighbourhood",
            importance: 0.9,
            boundingbox: ["40.7449", "40.7649", "-73.9940", "-73.9740"]
        },
        {
            area: "Downtown Manhattan, New York City",
            address: "Downtown Manhattan, New York City, New York, United States",
            coordinates: { lat: 40.7075, long: -74.0113 },
            type: "neighbourhood",
            importance: 0.9,
            boundingbox: ["40.6975", "40.7175", "-74.0213", "-74.0013"]
        }
    ],
    brooklyn: [
        {
            area: "Williamsburg, Brooklyn",
            address: "Williamsburg, Brooklyn, New York City, New York, United States",
            coordinates: { lat: 40.7081, long: -73.9571 },
            type: "neighbourhood",
            importance: 0.8,
            boundingbox: ["40.6981", "40.7181", "-73.9671", "-73.9471"]
        },
        {
            area: "Park Slope, Brooklyn",
            address: "Park Slope, Brooklyn, New York City, New York, United States",
            coordinates: { lat: 40.6721, long: -73.9859 },
            type: "neighbourhood",
            importance: 0.8,
            boundingbox: ["40.6621", "40.6821", "-73.9959", "-73.9759"]
        },
        {
            area: "DUMBO, Brooklyn",
            address: "DUMBO, Brooklyn, New York City, New York, United States",
            coordinates: { lat: 40.7033, long: -73.9872 },
            type: "neighbourhood",
            importance: 0.7,
            boundingbox: ["40.6933", "40.7133", "-73.9972", "-73.9772"]
        }
    ],
    queens: [
        {
            area: "Long Island City, New York City",
            address: "Long Island City, Queens, New York City, New York, United States",
            coordinates: { lat: 40.7447, long: -73.9485 },
            type: "neighbourhood",
            importance: 0.8,
            boundingbox: ["40.7347", "40.7547", "-73.9585", "-73.9385"]
        },
        {
            area: "Astoria, Queens",
            address: "Astoria, Queens, New York City, New York, United States",
            coordinates: { lat: 40.7720, long: -73.9307 },
            type: "neighbourhood",
            importance: 0.8,
            boundingbox: ["40.7620", "40.7820", "-73.9407", "-73.9207"]
        }
    ],
    bronx: [
        {
            area: "South Bronx, Bronx",
            address: "South Bronx, Bronx, New York City, New York, United States",
            coordinates: { lat: 40.8189, long: -73.8908 },
            type: "neighbourhood",
            importance: 0.7,
            boundingbox: ["40.8089", "40.8289", "-73.9008", "-73.8808"]
        },
        {
            area: "Riverdale, Bronx",
            address: "Riverdale, Bronx, New York City, New York, United States",
            coordinates: { lat: 40.9034, long: -73.9146 },
            type: "neighbourhood",
            importance: 0.7,
            boundingbox: ["40.8934", "40.9134", "-73.9246", "-73.9046"]
        }
    ],
    statenIsland: [
        {
            area: "St. George, Staten Island",
            address: "St. George, Staten Island, New York City, New York, United States",
            coordinates: { lat: 40.6438, long: -74.0766 },
            type: "neighbourhood",
            importance: 0.7,
            boundingbox: ["40.6338", "40.6538", "-74.0866", "-74.0666"]
        }
    ],
    nearbyCities: [
        {
            area: "Yonkers, New York",
            address: "Yonkers, Westchester County, New York, United States",
            coordinates: { lat: 40.9312, long: -73.8987 },
            type: "city",
            importance: 0.6,
            boundingbox: ["40.9212", "40.9412", "-73.9087", "-73.8887"]
        },
        {
            area: "Jersey City, New Jersey",
            address: "Jersey City, Hudson County, New Jersey, United States",
            coordinates: { lat: 40.7178, long: -74.0431 },
            type: "city",
            importance: 0.6,
            boundingbox: ["40.7078", "40.7278", "-74.0531", "-74.0331"]
        }
    ]
};

// Helper function to get all locations as a flat array
export const getAllNYCLocations = (): Location[] => {
    return Object.values(nycLocations).flat();
}; 