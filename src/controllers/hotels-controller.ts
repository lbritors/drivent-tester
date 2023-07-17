import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service.ts';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const hotels = await hotelsService.getHotels(userId);
    res.status(httpStatus.OK).send(hotels);
  } catch (err) {
    if (err.name === 'PaymentRequiredError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    if (err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelWithRooms(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const hotelId = req.params.hotelId;
    const hotel = await hotelsService.getHotelWithRooms(userId, Number(hotelId));
    if (!userId) return res.sendStatus(httpStatus.BAD_REQUEST);
    if (!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST);
    res.status(httpStatus.OK).send(hotel);
  } catch (err) {
    if (err.name === 'PaymentRequiredError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    if (err.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

const hotelsController = {
  getHotelWithRooms,
  getHotels,
};

export default hotelsController;
