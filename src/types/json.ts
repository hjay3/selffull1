export interface CharacterProfile {
  Self: {
    Map: string;
    Name: string;
    Age: number;
    Gender: string;
    "Racial Attributes": {
      Nationality: string;
      "Attachment Strength": string;
    };
    Family: {
      Relationship: string;
      Rating: string;
    };
    "Morals / Ethics / Values / Philosophy": {
      Values: string[];
      Rating: string;
    };
    "Sexual Identity": {
      Identity: string;
      Rating: string;
    };
    "Religious Beliefs": {
      Faith: string;
      Rating: string;
    };
    "Vocation / Job": {
      Title: string;
      Fulfillment: string;
      Rating: string;
    };
    [key: string]: any;
  };
}