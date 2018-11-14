export interface ConfigDatabase {
  database: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

export interface ConfigSession {
  keys: string[];
}

export interface ConfigType {
  env: string;
  ipStackApiKey: string;
  db: ConfigDatabase;
  session: ConfigSession;
}
