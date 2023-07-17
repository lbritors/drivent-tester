import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels() {
  return prisma.hotel.findMany();
}

async function getHotelsWithRooms(hotelId: number) {
  return prisma.hotel.findMany({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });
}
export default { getHotels, getHotelsWithRooms };
