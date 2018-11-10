import { ConfigType } from '@types';


function getConfig(): ConfigType {
  return {
    env: 'development',
    ipStackAPIKEY: "0be6a17d7bd7269e16a0a51bc32ddfa5",
    db: {
      database: 'malt_micro',
      host: 'localhost',
      port: 33065,
      user: 'root',
      password: 'option123',
    },
    session: {
      keys: [
        'ecd8cFF7naT6JZwmCd7RsNBTrUZU5Kzwp9kcvenCZ72qWrCNchSXraSa46aa4UzdCXaM8VYHE7cu7u2JZcZsdfTKxpTJUt2MtbxXSK9rJf5EpDhMUS6nQS95B3E9F9v48Fe9fMfqBVkQusKBu3CE49UF3mN2YaY843W85KECZXJjMbxb787Mmv8cBbkRRKH6Wz9qBcuYM97x2BYDMfrjE962B4WengPbScA3haQGt58ETfPEns7UX5pBpBQMnqjG',
        'nX52c6F59hZpG28n9Yt7HUf4mxUJaudc7aKTcUwXN64TMxGWCS2vBEdSkVRYZENhDX8S8JMbt67Msupebd7eMn5fw4aKT8sEV7PF8nJCCmcB96QgqKr8asY3uzuZ4XrC7up2UtSBMZBkWzaMfKEbffBH9WJJp9AQ34kUDrqMhFEecBvRS2579aEMT4ZTajCK9qB7j35cnbQRcXBcKEFbnSzWBU9YaC9fr2YBxE8sdN39mexQF3Z8Pqc6r5UjpMv7',
        'vwEut7CRC5rUEBfXdZ4Gsc6pFeMeW249MsnU99Y8ax5KfPBQ8qfx5Y8cnHN89Q4smMEUqQtb2EBhZX943aBRcnWnMbqdJ98njsmEDgNUSS8BrV2TFBZpMe7YX6CzKmTUEArJccKaQczb3WSeUH7T586uS7xKJfhGX9MKVz9MFv7CBBtj3Cpar3M4XuN2bbC6p2d3SuWauwncZMYZcF4pR8a7ScT7BDvaar9BfkjkPYhJE7F2956qfTE5dkxKZUJ7'
      ],
    },
  }
}

export default getConfig();
