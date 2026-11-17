import { beforeAll, afterAll } from "vitest";
import prisma from "@/lib/prisma";

beforeAll(async () => {
  // Ensure database is ready
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});
