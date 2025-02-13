import { Request, Response } from "express";
import { ApiResponse } from "../../models/api-response";
import { CardsService } from "../../services/cards-service";
import { isValid } from "../../utils/validation-util";
import { CardModelDto } from "../../models/card";

function similarityCheck(str1: string, str2: string) {
  const acceptableThreshold = 0.3;
  const len1 = str1.length;
  const len2 = str2.length;
  const dp = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));

  for (let i = 0; i <= len1; i++) {
    for (let j = 0; j <= len2; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1])) + 1;
      }
    }
  }
  const score = dp[len1][len2] / Math.max(len1, len2);
  return score <= acceptableThreshold;
}

type CreateCardBody = {
  category: string;
  english: string;
  hebrew: string;
  details?: string;
};
export const addCardPrecheckController = async (
  req: Request<null, ApiResponse, CreateCardBody>,
  res: Response<ApiResponse>
) => {
  if (!isValid(req, res)) return;
  try {
    const allCards = await CardsService.getCards();

    const similarCards: CardModelDto[] = [];
    for (const card of allCards) {
      const isSimilarHebrew = similarityCheck(card.hebrew, req.body.hebrew);
      const isSimilarEnglish = similarityCheck(card.english, req.body.english);
      isSimilarHebrew && isSimilarEnglish && similarCards.push(card);
    }

    if (similarCards.length) {
      res.status(400).json({
        isSuccess: false,
        error: {
          message: "Similar words were detected",
          code: "SimilarWordExists",
          data: similarCards,
        },
      });
      return;
    }

    res.status(200).json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      error: { message: "Failed to precheck the card", data: error },
    });
  }
};
