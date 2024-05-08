export interface IUser {
  user: string;
  password: string;
  name: string;
  id: string;
  create_at: string;
  user_type_id: string;
  owner: {
    token: string;
  };
}
