import faker from '@faker-js/faker';
import supertest from 'supertest';

describe('GET /hotels', () => {
  it('should return 200 when hotels are sent', async () => {
    const name = faker.company.companyName();
    const image = faker.image.business();
    const roomName = faker.address.buildingNumber();
    const roomCapacity = faker.datatype.number({ min: 1, max: 10 });
  });
});
