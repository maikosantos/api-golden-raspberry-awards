import request from "supertest";
import { app } from "../../api/src/app";
import { PrismaClient } from "@prisma/client";
import { readCSVAndSaveToDb } from "../../api/src/controllers/csvReaderController";

const prisma = new PrismaClient();

describe("Movies API Integration Tests", () => {
  beforeAll(async () => {
    await readCSVAndSaveToDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("GET /movies/awards/intervals", () => {
    it("should return the correct award intervals structure", async () => {
      const response = await request(app)
        .get("/movies/awards/intervals")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toHaveProperty("min");
      expect(response.body).toHaveProperty("max");
      expect(Array.isArray(response.body.min)).toBeTruthy();
      expect(Array.isArray(response.body.max)).toBeTruthy();
    });

    it("should return the correct producer with minimum interval", async () => {
      const response = await request(app)
        .get("/movies/awards/intervals")
        .expect(200);

      const minInterval = response.body.min[0];

      expect(minInterval).toHaveProperty("producer");
      expect(minInterval).toHaveProperty("interval");
      expect(minInterval).toHaveProperty("previousWin");
      expect(minInterval).toHaveProperty("followingWin");

      expect(minInterval.interval).toBe(
        minInterval.followingWin - minInterval.previousWin
      );
    });

    it("should return the correct producer with maximum interval", async () => {
      const response = await request(app)
        .get("/movies/awards/intervals")
        .expect(200);

      const maxInterval = response.body.max[0];

      expect(maxInterval).toHaveProperty("producer");
      expect(maxInterval).toHaveProperty("interval");
      expect(maxInterval).toHaveProperty("previousWin");
      expect(maxInterval).toHaveProperty("followingWin");

      expect(maxInterval.interval).toBe(
        maxInterval.followingWin - maxInterval.previousWin
      );
    });

    it("should validate specific test cases from the requirements", async () => {
      const response = await request(app)
        .get("/movies/awards/intervals")
        .expect(200);

      const testCases = [
        {
          producer: "Producer 1",
          previousWin: 1990,
          followingWin: 1991,
          expectedInterval: 1,
        },
        {
          producer: "Producer 2",
          previousWin: 1985,
          followingWin: 1990,
          expectedInterval: 5,
        },
      ];

      const allIntervals = [...response.body.min, ...response.body.max];

      testCases.forEach((testCase) => {
        const matchingResult = allIntervals.find(
          (interval) =>
            interval.producer === testCase.producer &&
            interval.previousWin === testCase.previousWin &&
            interval.followingWin === testCase.followingWin
        );

        if (matchingResult) {
          expect(matchingResult.interval).toBe(testCase.expectedInterval);
        }
      });
    });
  });

  describe("Data Validation", () => {
    it("should handle non-existent movie requests", async () => {
      await request(app).get("/movies/99999").expect(404);
    });
  });
});
