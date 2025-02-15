export interface RepeatOrderDetails {
  label: string;
  description: string;
  image: string;
  ingredients: string[];
  price: number;
  name: string;
  userData: {
      email: string;
      empId: string;
      upiId: string;
  }
}