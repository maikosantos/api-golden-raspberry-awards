import fs from "fs";
import csv from "csv-parser";
import path from "path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function readCSVAndSaveToDb() {
  await clearDatabase();

  const filePath = path.resolve("api/data/movielist.csv");
  const movies = [];

  fs.createReadStream(filePath)
    .pipe(csv({ separator: ";" }))
    .on("data", (data) => {
      movies.push({
        year: parseInt(data.year),
        title: data.title,
        studios: data.studios,
        producers: data.producers,
        winner: data.winner,
      });
    })
    .on("end", async () => {
      try {
        await insertDatabase(movies);
        console.log("CSV file data successfully saved to SQLite.");
      } catch (error) {
        console.error("Failed to save data: ", error);
      }
    })
    .on("error", (error) => {
      console.error("Failed to read CSV file: ", error);
    });
}

async function insertDatabase(movies) {
  try {
    await prisma.movie.createMany({
      data: movies,
    });
  } catch (error) {
    console.error("Error while saving data: ", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function clearDatabase() {
  try {
    await prisma.movie.deleteMany();
  } catch (error) {
    console.error("Error while deleting data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export { readCSVAndSaveToDb };
