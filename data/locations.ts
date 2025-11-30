// data/locations.ts

export interface City {
  id: number;
  name: string;
  zip: string;
}

export interface State {
  id: number;
  name: string;
  short_name: string;
  cities: City[];
}

export interface Country {
  id: number;
  name: string;
  short_name: string;
  code: string;
  flag: string;
  dial_code: string;
  states: State[];
}

export const locationData: Country[] = [
  /* ==========================================================
     UNITED KINGDOM
     ========================================================== */
  {
    id: 1,
    name: "United Kingdom",
    short_name: "UK",
    code: "GB",
    flag: "🇬🇧",
    dial_code: "+44",
    states: [
      {
        id: 1,
        name: "Greater London",
        short_name: "LDN",
        cities: [
          { id: 1, name: "London", zip: "EC1A" },
          { id: 2, name: "Brixton", zip: "SW9" },
          { id: 3, name: "Peckham", zip: "SE15" },
          { id: 4, name: "Stratford", zip: "E15" },
          { id: 5, name: "Croydon", zip: "CR0" },
        ],
      },
      {
        id: 2,
        name: "Greater Manchester",
        short_name: "MAN",
        cities: [
          { id: 6, name: "Manchester", zip: "M1" },
          { id: 7, name: "Salford", zip: "M3" },
          { id: 8, name: "Bolton", zip: "BL1" },
          { id: 9, name: "Oldham", zip: "OL1" },
        ],
      },
      {
        id: 3,
        name: "West Midlands",
        short_name: "WMD",
        cities: [
          { id: 10, name: "Birmingham", zip: "B1" },
          { id: 11, name: "Wolverhampton", zip: "WV1" },
          { id: 12, name: "Coventry", zip: "CV1" },
        ],
      },
      {
        id: 4,
        name: "West Yorkshire",
        short_name: "WY",
        cities: [
          { id: 13, name: "Leeds", zip: "LS1" },
          { id: 14, name: "Bradford", zip: "BD1" },
          { id: 15, name: "Huddersfield", zip: "HD1" },
        ],
      },
      {
        id: 5,
        name: "Merseyside",
        short_name: "MSD",
        cities: [
          { id: 16, name: "Liverpool", zip: "L1" },
          { id: 17, name: "Birkenhead", zip: "CH41" },
        ],
      },
    ],
  },

  /* ==========================================================
     KENYA
     ========================================================== */
  {
    id: 2,
    name: "Kenya",
    short_name: "KE",
    code: "KE",
    flag: "🇰🇪",
    dial_code: "+254",
    states: [
      {
        id: 1,
        name: "Nairobi County",
        short_name: "NBO",
        cities: [
          { id: 18, name: "Nairobi", zip: "00100" },
          { id: 19, name: "Westlands", zip: "00800" },
          { id: 20, name: "Kasarani", zip: "00600" },
        ],
      },
      {
        id: 2,
        name: "Mombasa County",
        short_name: "MSA",
        cities: [
          { id: 21, name: "Mombasa", zip: "80100" },
          { id: 22, name: "Nyali", zip: "80118" },
          { id: 23, name: "Likoni", zip: "80110" },
        ],
      },
      {
        id: 3,
        name: "Kisumu County",
        short_name: "KSM",
        cities: [{ id: 24, name: "Kisumu City", zip: "40100" }],
      },
    ],
  },

  /* ==========================================================
     NIGERIA
     ========================================================== */
  {
    id: 3,
    name: "Nigeria",
    short_name: "NG",
    code: "NG",
    flag: "🇳🇬",
    dial_code: "+234",
    states: [
      {
        id: 1,
        name: "Lagos State",
        short_name: "LOS",
        cities: [
          { id: 25, name: "Ikeja", zip: "100271" },
          { id: 26, name: "Lekki", zip: "105102" },
          { id: 27, name: "Surulere", zip: "101283" },
          { id: 28, name: "Ajah", zip: "106104" },
        ],
      },
      {
        id: 2,
        name: "Federal Capital Territory (Abuja)",
        short_name: "FCT",
        cities: [
          { id: 29, name: "Garki", zip: "900108" },
          { id: 30, name: "Wuse", zip: "900281" },
          { id: 31, name: "Maitama", zip: "900271" },
        ],
      },
      {
        id: 3,
        name: "Rivers State",
        short_name: "RIV",
        cities: [{ id: 32, name: "Port Harcourt", zip: "500001" }],
      },
      {
        id: 4,
        name: "Oyo State",
        short_name: "OYO",
        cities: [{ id: 33, name: "Ibadan", zip: "200212" }],
      },
    ],
  },

  /* ==========================================================
     GHANA
     ========================================================== */
  {
    id: 4,
    name: "Ghana",
    short_name: "GH",
    code: "GH",
    flag: "🇬🇭",
    dial_code: "+233",
    states: [
      {
        id: 1,
        name: "Greater Accra",
        short_name: "GA",
        cities: [
          { id: 34, name: "Accra", zip: "00233" },
          { id: 35, name: "Tema", zip: "00233" },
          { id: 36, name: "Madina", zip: "GA107" },
        ],
      },
      {
        id: 2,
        name: "Ashanti Region",
        short_name: "AS",
        cities: [{ id: 37, name: "Kumasi", zip: "AK000" }],
      },
    ],
  },

  /* ==========================================================
     SOUTH AFRICA
     ========================================================== */
  {
    id: 5,
    name: "South Africa",
    short_name: "SA",
    code: "ZA",
    flag: "🇿🇦",
    dial_code: "+27",
    states: [
      {
        id: 1,
        name: "Gauteng",
        short_name: "GT",
        cities: [
          { id: 38, name: "Johannesburg", zip: "2000" },
          { id: 39, name: "Pretoria", zip: "0001" },
        ],
      },
      {
        id: 2,
        name: "Western Cape",
        short_name: "WC",
        cities: [{ id: 40, name: "Cape Town", zip: "8000" }],
      },
    ],
  },

  /* ==========================================================
     MOROCCO
     ========================================================== */
  {
    id: 6,
    name: "Morocco",
    short_name: "MA",
    code: "MA",
    flag: "🇲🇦",
    dial_code: "+212",
    states: [
      {
        id: 1,
        name: "Casablanca-Settat",
        short_name: "CAS",
        cities: [{ id: 41, name: "Casablanca", zip: "20000" }],
      },
      {
        id: 2,
        name: "Rabat-Salé-Kénitra",
        short_name: "RSK",
        cities: [{ id: 42, name: "Rabat", zip: "10000" }],
      },
    ],
  },

  /* ==========================================================
     UGANDA
     ========================================================== */
  {
    id: 7,
    name: "Uganda",
    short_name: "UG",
    code: "UG",
    flag: "🇺🇬",
    dial_code: "+256",
    states: [
      {
        id: 1,
        name: "Central Region",
        short_name: "CR",
        cities: [
          { id: 43, name: "Kampala", zip: "256" },
          { id: 44, name: "Entebbe", zip: "256" },
        ],
      },
      {
        id: 2,
        name: "Western Region",
        short_name: "WR",
        cities: [{ id: 45, name: "Mbarara", zip: "256" }],
      },
    ],
  },

  /* ==========================================================
     TANZANIA
     ========================================================== */
  {
    id: 8,
    name: "Tanzania",
    short_name: "TZ",
    code: "TZ",
    flag: "🇹🇿",
    dial_code: "+255",
    states: [
      {
        id: 1,
        name: "Dar es Salaam",
        short_name: "DES",
        cities: [{ id: 46, name: "Dar es Salaam", zip: "11101" }],
      },
      {
        id: 2,
        name: "Arusha Region",
        short_name: "ARU",
        cities: [{ id: 47, name: "Arusha", zip: "23100" }],
      },
    ],
  },

  /* ==========================================================
     RWANDA
     ========================================================== */
  {
    id: 9,
    name: "Rwanda",
    short_name: "RW",
    code: "RW",
    flag: "🇷🇼",
    dial_code: "+250",
    states: [
      {
        id: 1,
        name: "Kigali",
        short_name: "KGL",
        cities: [{ id: 48, name: "Kigali City", zip: "250" }],
      },
    ],
  },
];
