import { useEffect, useState } from "react";
import { useGetCards } from "../hooks/useGetCards";
import { GetCardsFilters } from "../models/api";

export const CardsPage = () => {
  const [filters, setFilters] = useState<GetCardsFilters>({});
  const { data } = useGetCards(filters);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return <h1>Cards</h1>;
};
