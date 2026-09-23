export type Associate = {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  active: boolean;
  createdAt: string;
};

export type AssociatePublic = Omit<Associate, "password">;
