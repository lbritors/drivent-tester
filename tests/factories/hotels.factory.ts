import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel(name: string, image: string) {
  return prisma.hotel.create({
    data: {
      name: name,
      image: image,
      Rooms: {
        create: { name: faker.name.firstName(), capacity: faker.datatype.number() },
      },
    },
    include: {
      Rooms: true,
    },
  });
}
