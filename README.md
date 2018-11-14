# Malt Rate Micro Service

0. Edit `./config/sequelize-config.json` and `src/config/env/Development.ts` to match your database settings
1. Create database called `malt_micro`.<br />
Good tool for this is Sequel Pro
2. Run `npm run db:migrate`
3. Run `npm run db:seed`
4. Install PM2 `npm install pm2@latest -g`
5. Launch the service `./develop.sh`

✅ Tested on node version 10, 11
