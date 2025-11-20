// data/locations.ts

export interface City {
  id: number;
  name: string;
}

export interface State {
  id: number;
  name: string;
  cities: City[];
}

export interface Country {
  id: number;
  name: string;
  code: string;
  flag: string;
  dial_code: string;
  states: State[];
}

export const locationData: Country[] = [
  /* -----------------------------------------------------------
    UNITED KINGDOM — Key African diaspora hubs
  ----------------------------------------------------------- */
  {
    id: 1,
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    dial_code: "+44",
    states: [
      {
        id: 1,
        name: "Greater London",
        cities: [
          { id: 1, name: "London" },
          { id: 2, name: "Brixton" },
          { id: 3, name: "Peckham" },
          { id: 4, name: "Stratford" },
          { id: 5, name: "Croydon" },
        ],
      },
      {
        id: 2,
        name: "Greater Manchester",
        cities: [
          { id: 6, name: "Manchester" },
          { id: 7, name: "Salford" },
          { id: 8, name: "Bolton" },
          { id: 9, name: "Oldham" },
        ],
      },
      {
        id: 3,
        name: "West Midlands",
        cities: [
          { id: 10, name: "Birmingham" },
          { id: 11, name: "Wolverhampton" },
          { id: 12, name: "Coventry" },
        ],
      },
      {
        id: 4,
        name: "West Yorkshire",
        cities: [
          { id: 13, name: "Leeds" },
          { id: 14, name: "Bradford" },
          { id: 15, name: "Huddersfield" },
        ],
      },
      {
        id: 5,
        name: "Merseyside",
        cities: [
          { id: 16, name: "Liverpool" },
          { id: 17, name: "Birkenhead" },
        ],
      },
    ],
  },

  /* -----------------------------------------------------------
    KENYA — Strong East African seller hubs
  ----------------------------------------------------------- */
  {
    id: 2,
    name: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    dial_code: "+254",
    states: [
      {
        id: 1,
        name: "Nairobi County",
        cities: [
          { id: 18, name: "Nairobi" },
          { id: 19, name: "Westlands" },
          { id: 20, name: "Kasarani" },
        ],
      },
      {
        id: 2,
        name: "Mombasa County",
        cities: [
          { id: 21, name: "Mombasa" },
          { id: 22, name: "Nyali" },
          { id: 23, name: "Likoni" },
        ],
      },
      {
        id: 3,
        name: "Kisumu County",
        cities: [{ id: 24, name: "Kisumu City" }],
      },
    ],
  },

  /* -----------------------------------------------------------
    NIGERIA — Largest African market with diaspora sellers
  ----------------------------------------------------------- */
  {
    id: 3,
    name: "Nigeria",
    code: "NG",
    flag: "🇳🇬",
    dial_code: "+234",
    states: [
      {
        id: 1,
        name: "Lagos State",
        cities: [
          { id: 25, name: "Ikeja" },
          { id: 26, name: "Lekki" },
          { id: 27, name: "Surulere" },
          { id: 28, name: "Ajah" },
        ],
      },
      {
        id: 2,
        name: "Federal Capital Territory (Abuja)",
        cities: [
          { id: 29, name: "Garki" },
          { id: 30, name: "Wuse" },
          { id: 31, name: "Maitama" },
        ],
      },
      {
        id: 3,
        name: "Rivers State",
        cities: [{ id: 32, name: "Port Harcourt" }],
      },
      {
        id: 4,
        name: "Oyo State",
        cities: [{ id: 33, name: "Ibadan" }],
      },
    ],
  },

  /* -----------------------------------------------------------
    GHANA — Strong West African food & goods exporters
  ----------------------------------------------------------- */
  {
    id: 4,
    name: "Ghana",
    code: "GH",
    flag: "🇬🇭",
    dial_code: "+233",
    states: [
      {
        id: 1,
        name: "Greater Accra",
        cities: [
          { id: 34, name: "Accra" },
          { id: 35, name: "Tema" },
          { id: 36, name: "Madina" },
        ],
      },
      {
        id: 2,
        name: "Ashanti Region",
        cities: [{ id: 37, name: "Kumasi" }],
      },
    ],
  },

  /* -----------------------------------------------------------
    UGANDA — Major East African sellers
  ----------------------------------------------------------- */
  {
    id: 5,
    name: "Uganda",
    code: "UG",
    flag: "🇺🇬",
    dial_code: "+256",
    states: [
      {
        id: 1,
        name: "Central Region",
        cities: [
          { id: 38, name: "Kampala" },
          { id: 39, name: "Entebbe" },
        ],
      },
      {
        id: 2,
        name: "Western Region",
        cities: [{ id: 40, name: "Mbarara" }],
      },
    ],
  },

  /* -----------------------------------------------------------
    TANZANIA — Rising East African export corridor
  ----------------------------------------------------------- */
  {
    id: 6,
    name: "Tanzania",
    code: "TZ",
    flag: "🇹🇿",
    dial_code: "+255",
    states: [
      {
        id: 1,
        name: "Dar es Salaam",
        cities: [{ id: 41, name: "Dar es Salaam" }],
      },
      {
        id: 2,
        name: "Arusha Region",
        cities: [{ id: 42, name: "Arusha" }],
      },
    ],
  },

  /* -----------------------------------------------------------
    RWANDA — Fast-growing business and food export sector
  ----------------------------------------------------------- */
  {
    id: 7,
    name: "Rwanda",
    code: "RW",
    flag: "🇷🇼",
    dial_code: "+250",
    states: [
      {
        id: 1,
        name: "Kigali",
        cities: [{ id: 43, name: "Kigali City" }],
      },
    ],
  },
];
