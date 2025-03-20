export const nycAreas = {
    boroughs: [
        'Manhattan, New York City',
        'Brooklyn, New York City',
        'Queens, New York City',
        'Bronx, New York City',
        'Staten Island, New York City'
    ],
    manhattan: [
        'Harlem, New York City',
        'Upper East Side, New York City',
        'Upper West Side, New York City',
        'Midtown Manhattan, New York City',
        'Downtown Manhattan, New York City',
        'Financial District, New York City',
        'Chinatown, New York City',
        'SoHo, New York City',
        'Tribeca, New York City',
        'Greenwich Village, New York City',
        'East Village, New York City',
        'Lower East Side, New York City',
        'Chelsea, New York City',
        'Flatiron District, New York City',
        'Times Square, New York City'
    ],
    brooklyn: [
        'Williamsburg, Brooklyn',
        'Park Slope, Brooklyn',
        'DUMBO, Brooklyn',
        'Brooklyn Heights, Brooklyn',
        'Downtown Brooklyn, Brooklyn',
        'Prospect Heights, Brooklyn',
        'Crown Heights, Brooklyn',
        'Bedford-Stuyvesant, Brooklyn',
        'Bushwick, Brooklyn',
        'Greenpoint, Brooklyn',
        'Bay Ridge, Brooklyn',
        'Coney Island, Brooklyn'
    ],
    queens: [
        'Long Island City, New York City',
        'Astoria, Queens',
        'Flushing, Queens',
        'Forest Hills, Queens',
        'Jackson Heights, Queens',
        'Sunnyside, Queens',
        'Woodside, Queens',
        'Elmhurst, Queens',
        'Corona, Queens',
        'Rego Park, Queens'
    ],
    bronx: [
        'South Bronx, Bronx',
        'Riverdale, Bronx',
        'Fordham, Bronx',
        'Mott Haven, Bronx',
        'University Heights, Bronx',
        'Morris Heights, Bronx',
        'Highbridge, Bronx'
    ],
    statenIsland: [
        'St. George, Staten Island',
        'New Dorp, Staten Island',
        'Great Kills, Staten Island',
        'Tottenville, Staten Island',
        'West New Brighton, Staten Island'
    ],
    nearbyCities: [
        'Yonkers, New York',
        'New Rochelle, New York',
        'White Plains, New York',
        'Jersey City, New Jersey',
        'Hoboken, New Jersey',
        'Newark, New Jersey'
    ]
};

// Helper function to get all areas as a flat array
export const getAllNYCAreas = (): string[] => {
    return [
        ...nycAreas.boroughs,
        ...nycAreas.manhattan,
        ...nycAreas.brooklyn,
        ...nycAreas.queens,
        ...nycAreas.bronx,
        ...nycAreas.statenIsland,
        ...nycAreas.nearbyCities
    ];
}; 