import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

const validUserData = { email: 'aaa@aa.ru', password: 'qwerty' };
const nonValidUserData = { email: 'aaa@aa.ru', password: '1' };

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app).post('/users/register').send(nonValidUserData);
		expect(res.statusCode).toBe(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app).post('/users/login').send(validUserData);
		expect(res.body.token).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app).post('/users/login').send(nonValidUserData);
		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app).post('/users/login').send(validUserData);
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.token}`);
		expect(res.body.email).toBe('aaa@aa.ru');
	});

	it('Info - error', async () => {
		const res = await request(application.app).get('/users/info').set('Authorization', `Bearer 1`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
