import { PaymentMethodEnum } from "$root/enums/PaymentMethodEnum";
import { Types } from "mongoose";

export interface ITransaction {
  customerId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  paymentMethod: PaymentMethodEnum;
  status: string;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  dob: string;
  phone?: string;
  isActive: boolean;
  firstTimeLogin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: string;
}

export interface Therapist {
  _id: string;
  accountId: User;
  specialization: string[];
  certification: Certification[];
  experience: string;
  __v: number;
}

export interface Slot {
  _id: string;
  slotNum: number;
  startTime: string;
  endTime: string;
  __v: number;
}

export interface Service {
  _id: string;
  serviceName: string;
  description: string;
  price: number;
  isActive: boolean;
  image: string;
}

export interface Appointment {
  _id: string;
  therapistId: Therapist;
  customerId: string;
  slotsId: Slot;
  serviceId: Service;
  checkInImage: string;
  checkOutImage: string;
  notes: string;
  amount: number;
  status: string;
}

export interface Payment {
  _id: string;
  customerId: User;
  appointmentId: Appointment;
  paymentMethod: string;
  status: string;
}
