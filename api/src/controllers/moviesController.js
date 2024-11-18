import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getProducersWithAwardIntervals() {
  try {
    const winners = await prisma.movie.findMany({
      where: { winner: "yes" },
      select: { producers: true, year: true },
    });

    const separatedWinners = winners.flatMap((winner) => {
      const individualProducers = winner.producers
        .split(/, and | and | And | & |,/)
        .map((producer) => producer.trim());

      return individualProducers.map((producer) => ({
        ...winner,
        producers: producer,
      }));
    });

    //console.log(separatedWinners);

    const sortedWinners = separatedWinners.sort((a, b) => {
      if (a.producers < b.producers) return -1;
      if (a.producers > b.producers) return 1;
      return a.year - b.year;
    });

    const intervalsYears = [];
    let { lastProducer = "", lastYear = 0 } = {};
    let interval;
    sortedWinners.forEach(({ producers, year }) => {
      if (lastProducer === producers) {
        interval = year - lastYear;

        intervalsYears.push({
          producer: producers,
          interval: interval,
          previousWin: lastYear,
          followingWin: year,
        });
      }

      lastProducer = producers;
      lastYear = year;
    });

    const min = intervalsYears.reduce((minInterval, current) => {
      return current.interval < minInterval.interval ? current : minInterval;
    }, intervalsYears[0]);

    const max = intervalsYears.reduce((minInterval, current) => {
      return current.interval > minInterval.interval ? current : minInterval;
    }, intervalsYears[0]);

    //console.log({ min: [min], max: [max] });

    return { min: [min], max: [max] };
  } catch (error) {
    console.error("Failed to calculate award intervals: ", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export { getProducersWithAwardIntervals };
