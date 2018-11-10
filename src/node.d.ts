declare namespace NodeJS {
  export interface Global {
    sequelize: any;
  }
}

declare var Process : {
  env: {
    NODE_ENV: string,
  }
}
