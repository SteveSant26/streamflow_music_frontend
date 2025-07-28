export interface UserProps {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export class User {
  private readonly _id: string;
  private readonly _email: string;
  private _token?: string;

  constructor(props: UserProps) {
    if (!props.email.includes("@")) throw new Error("Email inválido");
    this._id = props.id;
    this._email = props.email;
    this._token = props.token;
  }

  get id() {
    return this._id;
  }
  get email() {
    return this._email;
  }
  get token() {
    return this._token;
  }

  withToken(token: string) {
    this._token = token;
    return this;
  }
}
