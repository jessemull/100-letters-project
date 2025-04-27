export type Address = {
  city: string;
  country: string;
  postalCode: string;
  state: string;
  street: string;
};

export type Recipient = {
  address: Address;
  description?: string;
  firstName: string;
  lastName: string;
  occupation?: string;
  organization?: string;
  recipientId: string;
};

export type RecipientCreateInput = {
  address: Address;
  description?: string;
  firstName: string;
  lastName: string;
  occupation?: string;
  organization?: string;
};

export type RecipientUpdateInput = {
  address: Address;
  description?: string;
  firstName: string;
  lastName: string;
  occupation?: string;
  organization?: string;
  recipientId: string;
};

export type GetRecipientsResponse = {
  data: Recipient[];
  lastEvaluatedKey: string;
};

export type GetRecipientByIdResponse = {
  data: Recipient;
};

export type RecipientFormResponse = {
  message: string;
};

export type DeleteRecipientResponse = {
  message: string;
};

export type RecipientParams = {
  recipientId: string;
};
