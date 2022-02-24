import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getPlaces().map((place) => {
      return db.place.create({ data: place });
    })
  );
}

seed();

function getPlaces() {
  return [
    {
      name: "Boulangerie Saint Ambroise",
      content: `Sandwich`,
    },
    {
      name: "Bombolo",
      content: `Pizza & Pasta`,
    },
    {
      name: "Chez Colette",
      content: `Plats & Sandwich`,
    },
    {
      name: "Fresh Bagel & Juice",
      content: `Sandwich`,
    },
    {
      name: "Ten Belles Bread",
      content: `Sandwich`,
    },
    {
      name: "Cafe des Anges",
      content: `Plats`,
    },
    {
      name: "Ebisu",
      content: `Sushi`,
    },
    {
      name: "Le Grand Breguet",
      content: `Plats`,
    },
    {
      name: "Pita Street Food",
      content: `Sandwich`,
    },
    {
      name: "Chez Aline",
      content: `Plats & Sandwich`,
    },
    {
      name: "Le Poulailler",
      content: `Plats`,
    },
    {
      name: "La vache acrobate",
      content: `Plats`,
    },
    {
      name: "Mokoloco",
      content: `Burger`,
    },
  ];
}
