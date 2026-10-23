
export type Room = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  available: number;
};

export type Hotel = {
  id: string;
  name: string;
  location: string;
  rating: number;
  rooms: Room[];
};

export const hotels: Hotel[] = [
  {
    id: "H12",
    name: "Levwell Nairobi",
    location: "Nairobi",
    rating: 3.63,
    rooms: [
      {
        id: "H12-STD",
        name: "Standard Room",
        price: 12500,
        capacity: 2,
        available: 8,
      },
      {
        id: "H12-DLX",
        name: "Deluxe Room",
        price: 18500,
        capacity: 2,
        available: 5,
      },
    ],
  },
  {
    id: "H23",
    name: "Levwell Mombasa",
    location: "Mombasa",
    rating: 3.98,
    rooms: [
      {
        id: "H23-STD",
        name: "Standard Room",
        price: 14500,
        capacity: 2,
        available: 10,
      },
      {
        id: "H23-SUITE",
        name: "Executive Suite",
        price: 28000,
        capacity: 4,
        available: 3,
      },
    ],
  },
  {
    id: "H31",
    name: "Levwell Kisumu",
    location: "Kisumu",
    rating: 4.47,
    rooms: [
      {
        id: "H31-STD",
        name: "Standard Room",
        price: 11000,
        capacity: 2,
        available: 12,
      },
      {
        id: "H31-DLX",
        name: "Deluxe Room",
        price: 16500,
        capacity: 2,
        available: 6,
      },
    ],
  },
];

export const formatKES = (amount: number) =>
  `KSh ${amount.toLocaleString("en-KE")}`;
