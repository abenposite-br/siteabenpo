import { Users, Video, GraduationCap, Calendar } from "lucide-react";

export interface Event {
  id: string;
  type: "Presencial" | "Online" | "Workshop";
  title: string;
  date: string;
  time: string;
  location: string;
  mapsLink: string;
  description: string;
  createdAt?: string;
}

export function getEventIcon(type: string) {
  switch (type) {
    case "Presencial":
      return Users;
    case "Online":
      return Video;
    case "Workshop":
      return GraduationCap;
    default:
      return Calendar;
  }
}
