import { Room, Hotel } from '@prisma/client';
import ticketService from '../tickets-service';
import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import { paymentRequiredError } from '@/errors/payment-required-error';
import ticketsRepository from '@/repositories/tickets-repository';
import { badRequestError } from '@/errors/bad-request-error';

async function getHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket === null) throw notFoundError();
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID') {
    throw paymentRequiredError();
  }
  const hotels = await hotelsRepository.getHotels();
  if (!hotels || hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelWithRooms(userId: number, hotelId: number) {
  if (hotelId <= 0 || typeof hotelId === 'string') throw badRequestError();
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket === null) throw notFoundError();
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID') {
    throw paymentRequiredError();
  }
  const hotelsWithRooms = await hotelsRepository.getHotelsWithRooms(hotelId);
  if (!hotelsWithRooms || hotelsWithRooms === null) throw notFoundError();
  return hotelsWithRooms;
}

const hotelsService = {
  getHotels,
  getHotelWithRooms,
};

export default hotelsService;
