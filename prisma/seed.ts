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
      name: "Boulangerie Patisserie by KR",
      content: `Sandwich`,
      lat: "48.8602276",
      lng: "2.3757439",
      address:
        "90, Boulevard Voltaire, Quartier de la Folie-Méricourt, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "Bombolo",
      content: `Pizza & Pasta`,
      lat: "48.8602276",
      lng: "2.3757439",
      address:
        "90, Boulevard Voltaire, Quartier de la Folie-Méricourt, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "Chez Colette",
      content: `Plats & Sandwich`,
      lat: "48.8611455",
      lng: "2.3778135",
      address:
        "Avenue Parmentier, Quartier Saint-Ambroise, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "Fresh Bagel & Juice",
      content: `Sandwich`,
      lat: "48.8565378",
      lng: "2.3733225",
      address:
        "1, Rue Froment, Quartier de la Roquette, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "Ten Belles Bread",
      content: `Sandwich`,
      lat: "48.8575489",
      lng: "2.3734779",
      address:
        "Ten Belles Bread, 17-19, Rue Bréguet, Quartier de la Roquette, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "Cafe des Anges",
      content: `Plats`,
      lat: "48.8554359",
      lng: "2.3744522",
      address:
        "Le Café des Anges, 66, Rue de la Roquette, Quartier de la Roquette, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "Ebisu",
      content: `Sushi`,
      lat: "48.8585125",
      lng: "2.3733329",
      address:
        "Poissonnerie EBISU, 30-34, Rue du Chemin Vert, Quartier de la Roquette, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "Pita Street Food",
      content: `Sandwich`,
      lat: "48.8543623",
      lng: "2.3716748",
      address:
        "34, Rue de la Roquette, Quartier de la Roquette, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "Chez Aline",
      content: `Plats & Sandwich`,
      lat: "48.8570961",
      lng: "2.3784567",
      address:
        "Chez Aline, 85, Rue de la Roquette, Quartier de la Roquette, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "Le Poulailler",
      content: `Plats`,
      lat: "48.8591081",
      lng: "2.3688621",
      address:
        "60, Rue Saint-Sabin, Quartier de la Roquette, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "La vache acrobate",
      content: `Plats`,
      lat: "48.8596492",
      lng: "2.3680697",
      address:
        "77, Rue Amelot, Quartier de la Folie-Méricourt, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
    {
      name: "Mokoloco",
      content: `Burger`,
      lat: "48.853432",
      lng: "2.3800126",
      address:
        "Mokoloco, 74, Rue de Charonne, Quartier Sainte-Marguerite, 11th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75011, France",
    },
  ];
}
