export type BoxStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface Box {
  id: string;
  name: string;
  code: string; // e.g., "A-101", "B-205"
  floor: number;
  zone: string;
  area: number; // in square meters
  monthlyRent: number;
  status: BoxStatus;
  boutiqueId?: string;
  boutiqueName?: string;
  features: string[];
  coordinates?: BoxCoordinates;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoxCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoxAssignment {
  id: string;
  boxId: string;
  boutiqueId: string;
  startDate: Date;
  endDate?: Date;
  monthlyRent: number;
  isActive: boolean;
  createdAt: Date;
}

export interface BoxFilter {
  floor?: number;
  zone?: string;
  status?: BoxStatus;
  minArea?: number;
  maxArea?: number;
  minRent?: number;
  maxRent?: number;
}

export interface CreateBoxData {
  name: string;
  code: string;
  floor: number;
  zone: string;
  area: number;
  monthlyRent: number;
  features?: string[];
  coordinates?: BoxCoordinates;
}

export interface AssignBoxData {
  boutiqueId: string;
  startDate: Date;
  endDate?: Date;
  monthlyRent?: number;
}
