export interface ListingComponentProps {
  name: string;
  selectedDrink?: {
    name?: string;
    description?: string;
    image?: string;
    ingredients?: string[];
    label?: string;
    price?: number;
  };
  details: { label: string };
  onDrinkSelected: ({name}: {name: string}) => void;
}
