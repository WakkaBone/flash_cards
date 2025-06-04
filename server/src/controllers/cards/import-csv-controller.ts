import { Request, RequestHandler } from "express";
import csvParser from "csv-parser";
import fs from "fs";
import { CardsService, UsersService } from "../../services";
import { mapCsvEntryToCardModel } from "../../utils/mappers-util";

export const importCsvController: RequestHandler = (req, res) => {
  const userId = UsersService.getUserFromToken(req as any).id;

  const file = (req as Request & { file: Express.Multer.File }).file;

  if (!file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  const results: Record<string, string>[] = [];

  fs.createReadStream(file.path)
    .pipe(
      csvParser({
        separator: ",",
        mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, ""),
      })
    )
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      fs.unlinkSync(file.path);

      try {
        for (const card of results) {
          const newCard = await mapCsvEntryToCardModel(card, userId);
          await CardsService.addCard(newCard);
        }

        res.status(200).json({ isSuccess: true, data: results });
      } catch (error) {
        res.status(400).json({
          isSuccess: false,
          error: {
            message: `Failed to import CSV file: ${(error as Error).message}`,
          },
        });
      }
    })
    .on("error", (err) => {
      console.error("CSV parsing error:", err);
      res
        .status(500)
        .json({ isSuccess: false, error: "Failed to parse CSV file" });
    });
};
