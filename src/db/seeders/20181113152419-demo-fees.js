'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('fees', [
      {
        name: 'spain or repeat',
        rate: 8,
        restrictions: '{"@and":[{"@mission.duration":{"gt":"2months"}},{"@commercialrelation.duration":{"gt":"2months"}}],"@client.location":{"country":"ES"},"@freelancer.location":{"country":"ES"}}'
      },
      {
        name: 'russia and croatia',
        rate: 11,
        restrictions: '{"@and":[{"@mission.duration":{"ge":"6months"}},{"@commercialrelation.duration":{"ge":"3months"}}],"@client.location":{"country":"RU"},"@freelancer.location":{"country":"HR"}}'
      },
      {
        name: 'france and new and long',
        rate: 12,
        restrictions: '{"@and":[{"@mission.duration":{"ge":"6months"}}, {"@or": [{"@client.location":{"country":"FN"}}, {"@client.location":{"country":"DE"}}]}],"@freelancer.location":{"country":"FN"}}'
      },
      {
        name: 'young relationship',
        rate: 20,
        restrictions: '{"@commercialrelation.duration":{"le":"3months"}}'
      }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('fees', null, {});
  }
};
