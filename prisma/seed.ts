import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const demoUser = await db.user.create({
    data: {
      username: "demo",
      // hashed version of "demo1234!"
      passwordHash:
        "$2a$10$B7XncGDCzQ85zjGg6dRCJeW.vzs4J9tyFf4o956fcs8Zn.YRlqtYW",
    },
  });
  await Promise.all(
    getPlaces().map((place) => {
      const data = { userId: demoUser.id, ...place };
      return db.place.create({ data });
    })
  );
}

seed();

function getPlaces() {
  return [
    {
      name: "Boulangerie Saint Ambroise",
      content: `Sandwich`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Bombolo",
      content: `Pizza & Pasta`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Chez Colette",
      content: `Plats & Sandwich`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Fresh Bagel & Juice",
      content: `Sandwich`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Ten Belles Bread",
      content: `Sandwich`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Cafe des Anges",
      content: `Plats`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Ebisu",
      content: `Sushi`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Le Grand Breguet",
      content: `Plats`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Pita Street Food",
      content: `Sandwich`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Chez Aline",
      content: `Plats & Sandwich`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Le Poulailler",
      content: `Plats`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "La vache acrobate",
      content: `Plats`,
      lat: "",
      lng: "",
      address: "",
    },
    {
      name: "Mokoloco",
      content: `Burger`,
      lat: "",
      lng: "",
      address: "",
    },
  ];
}
