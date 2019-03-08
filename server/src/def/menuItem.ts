export type menuItem = {
    name: string;
    priceCents: number;
    ingredients: {
        "name":string;
        "quantity":number;
        "unit":string;
    }[];
    options: string[];
};
