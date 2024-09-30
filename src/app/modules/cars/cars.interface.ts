export type TCars = {
  _id: any;
  name: string;
  image: string;
  description: string;
  color: string;
  isElectric: boolean;
  features: string[];
  pricePerHour: number;
  status: 'available' | 'unavailable';
  location: string;
  startDate: string;
  endDate: string;
  isDeleted?: boolean;
  carType: string; 
  customerReviews: string[]; 
  createdAt: Date;
  updatedAt: Date;
};
