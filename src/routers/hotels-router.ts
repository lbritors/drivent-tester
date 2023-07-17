import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotelWithRooms, getHotels } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.use(authenticateToken);
hotelsRouter.get('/', getHotels);
hotelsRouter.get('/:hotelId', getHotelWithRooms);

export default hotelsRouter;
