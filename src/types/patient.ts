// types/patient.ts
export interface Patient {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: Date;
  appointmentCount: number | null;
  image: string | null;
}

export interface PaginatedResponse {
  items: Patient[];
  nextCursor: number | null;
}