import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import storage from 'node-persist';
import app from '../index.js'; // Assuming the app is exported from index.js

jest.mock('node-persist', () => ({
    init: jest.fn(),
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    keys: jest.fn(),
}));

describe('API Tests', () => {
    beforeAll(async () => {
        await storage.init();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /firebase-config', () => {
        it('should return Firebase configuration', async () => {
            const response = await request(app).get('/firebase-config');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                apiKey: process.env.FIREBASE_API_KEY,
                authDomain: process.env.FIREBASE_AUTH_DOMAIN,
                projectId: process.env.FIREBASE_PROJECT_ID,
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.FIREBASE_APP_ID,
                measurementId: process.env.FIREBASE_MEASUREMENT_ID,
            });
        });
    });

    describe('POST /save', () => {
        it('should save data successfully', async () => {
            const key = 'testKey';
            const product = { name: 'Test Product', category: 'mens' };
            storage.setItem.mockResolvedValue();

            const response = await request(app).post('/save').send({ key, product });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Data saved' });
            expect(storage.setItem).toHaveBeenCalledWith(key, product);
        });

        it('should return 400 if key or product is missing', async () => {
            const response = await request(app).post('/save').send({});
            expect(response.status).toBe(400);
            expect(response.text).toBe('missing key or value');
        });
    });

    describe('GET /get/:key', () => {
        it('should return the value for a given key', async () => {
            const key = 'testKey';
            const value = { name: 'Test Product' };
            storage.getItem.mockResolvedValue(value);

            const response = await request(app).get(`/get/${key}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ key, value });
        });

        it('should return 404 if key is not found', async () => {
            const key = 'nonExistentKey';
            storage.getItem.mockResolvedValue(undefined);

            const response = await request(app).get(`/get/${key}`);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Key not found' });
        });
    });

    describe('GET /delete/:key', () => {
        it('should delete the key and return success message', async () => {
            const key = 'testKey';
            storage.removeItem.mockResolvedValue(true);

            const response = await request(app).get(`/delete/${key}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'key deleted' });
        });

        it('should return 404 if key is not found', async () => {
            const key = 'nonExistentKey';
            storage.removeItem.mockResolvedValue(undefined);

            const response = await request(app).get(`/delete/${key}`);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Key not found' });
        });
    });

    describe('GET /getAll', () => {
        it('should return all stored products', async () => {
            const keys = ['key1', 'key2'];
            const values = [{ name: 'Product1' }, { name: 'Product2' }];
            storage.keys.mockResolvedValue(keys);
            storage.getItem.mockImplementation((key) =>
                key === 'key1' ? values[0] : values[1]
            );

            const response = await request(app).get('/getAll');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                { key: 'key1', value: values[0] },
                { key: 'key2', value: values[1] },
            ]);
        });
    });

    describe('GET /getMens', () => {
        it('should return all mens products', async () => {
            const keys = ['key1', 'key2'];
            const values = [
                { name: 'Product1', category: 'mens' },
                { name: 'Product2', category: 'womens' },
            ];
            storage.keys.mockResolvedValue(keys);
            storage.getItem.mockImplementation((key) =>
                key === 'key1' ? values[0] : values[1]
            );

            const response = await request(app).get('/getMens');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ key: 'key1', value: values[0] }]);
        });
    });

    describe('GET /getWomens', () => {
        it('should return all womens products', async () => {
            const keys = ['key1', 'key2'];
            const values = [
                { name: 'Product1', category: 'mens' },
                { name: 'Product2', category: 'womens' },
            ];
            storage.keys.mockResolvedValue(keys);
            storage.getItem.mockImplementation((key) =>
                key === 'key1' ? values[0] : values[1]
            );

            const response = await request(app).get('/getWomens');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ key: 'key2', value: values[1] }]);
        });
    });

    describe('GET /getUnisex', () => {
        it('should return all unisex products', async () => {
            const keys = ['key1', 'key2'];
            const values = [
                { name: 'Product1', category: 'unisex' },
                { name: 'Product2', category: 'mens' },
            ];
            storage.keys.mockResolvedValue(keys);
            storage.getItem.mockImplementation((key) =>
                key === 'key1' ? values[0] : values[1]
            );

            const response = await request(app).get('/getUnisex');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ key: 'key1', value: values[0] }]);
        });
    });

    describe('GET /getProduct/:key', () => {
        it('should return the product for a given key', async () => {
            const key = 'testKey';
            const value = { name: 'Test Product' };
            storage.getItem.mockResolvedValue(value);

            const response = await request(app).get(`/getProduct/${key}`);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ key, value });
        });

        it('should return 404 if product is not found', async () => {
            const key = 'nonExistentKey';
            storage.getItem.mockResolvedValue(undefined);

            const response = await request(app).get(`/getProduct/${key}`);
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Product not found' });
        });
    });
});