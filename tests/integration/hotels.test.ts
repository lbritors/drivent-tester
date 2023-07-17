import faker from '@faker-js/faker';
import supertest from 'supertest';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const api = supertest(app);
describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const hotels = await api.get('/hotels');
    expect(hotels.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('when token is valid', () => {
  it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
    const token = await generateValidToken();

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 when user doesnt have a ticket yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 402 when ticket is not PAID', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'RESERVED');

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 when ticket is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 when ticket does not include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const hotels = await api.get('/hotels/1');
    expect(hotels.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('when token is valid', () => {
  it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
    const token = await generateValidToken();

    const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 404 when user doesnt have a ticket yet', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);

    const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it('should respond with status 402 when ticket is not PAID', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'RESERVED');

    const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 when ticket is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should respond with status 402 when ticket does not include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });
  it('should responde with status 400 when id is invalid number', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    const response = await api.get('/hotels/-1').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });
});
