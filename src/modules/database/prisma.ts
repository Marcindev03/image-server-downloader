import { PrismaClient } from "@prisma/client";

export class CustomPrismaClient {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!CustomPrismaClient.instance) {
      CustomPrismaClient.instance = new PrismaClient();
    }

    return CustomPrismaClient.instance;
  }
}
