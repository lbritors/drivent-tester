import { Room, Hotel } from '@prisma/client';
import ticketService from '../tickets-service';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import { paymentRequiredError } from '@/errors/payment-required-error';
import ticketsRepository from '@/repositories/tickets-repository';

async function getHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentRequiredError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();
  const hotels = await hotelsRepository.getHotels();
  if (!ticket || !hotels) throw notFoundError();

  return hotels;
}

async function getHotelWithRooms(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentRequiredError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();
  const hotelsWithRooms = await hotelsRepository.getHotelsWithRooms(hotelId);
  if (!ticket) throw notFoundError();
  if (!hotelsWithRooms || hotelsWithRooms.length === 0) throw notFoundError();
  return hotelsWithRooms;
}

const hotelsService = {
  getHotels,
  getHotelWithRooms,
};

export default hotelsService;
