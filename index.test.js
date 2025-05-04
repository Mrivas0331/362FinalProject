import request from 'supertest';
import app from './index.js';

describe('Product API', () => {
    const testKey = 'jest-product-key';
    const testProduct = {
        name: 'Jest Test Shirt',
        price: 19.99,
        desc: 'A testing product used in Jest tests.',
        img: 'https://via.placeholder.com/150',
        category: 'Mens'
    };

    afterAll(async () => {
        await request(app).get(`/delete/${testKey}`);
        await request(app).get('/delete/extra-womens-key');
        await request(app).get('/delete/extra-unisex-key');
    });

    test('POST /save saves a product correctly', async () => {
        const res = await request(app).post('/save').send({ key: testKey, product: testProduct });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Data saved');
    });

    test('POST /save returns 400 for missing data', async () => {
        const res = await request(app).post('/save').send({});
        expect(res.statusCode).toBe(400);
    });

    test('GET /get/:key retrieves the product', async () => {
        const res = await request(app).get(`/get/${testKey}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.value.name).toBe(testProduct.name);
    });

    test('GET /getProduct/:key returns full product data', async () => {
        const res = await request(app).get(`/getProduct/${testKey}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.value.category).toBe("Mens");
    });

    test('GET /delete/:key deletes the product', async () => {
        const key = "to-delete-key";
        const product = { ...testProduct, name: "DeleteMe" };
        await request(app).post('/save').send({ key, product });
        const res = await request(app).get(`/delete/${key}`);
        expect(res.statusCode).toBe(200);
    });

    test('GET /getAll returns list of products', async () => {
        const res = await request(app).get('/getAll');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /getMens returns mens category products', async () => {
        const res = await request(app).get('/getMens');
        expect(res.statusCode).toBe(200);
        expect(res.body.some(item => item.value.category.toLowerCase() === "mens")).toBe(true);
    });

    test('GET /getWomens returns womens category products', async () => {
        await request(app).post('/save').send({
            key: "extra-womens-key",
            product: { ...testProduct, name: "Womens Product", category: "Womens" }
        });
        const res = await request(app).get('/getWomens');
        expect(res.statusCode).toBe(200);
        expect(res.body.some(p => p.value.category.toLowerCase() === "womens")).toBe(true);
    });

    test('GET /getUnisex returns unisex products', async () => {
        await request(app).post('/save').send({
            key: "extra-unisex-key",
            product: { ...testProduct, name: "Unisex Product", category: "Unisex" }
        });
        const res = await request(app).get('/getUnisex');
        expect(res.statusCode).toBe(200);
        expect(res.body.some(p => p.value.category.toLowerCase() === "unisex")).toBe(true);
    });

    test('GET /search returns matching results', async () => {
        const res = await request(app).get('/search?q=jest');
        expect(res.statusCode).toBe(200);
        expect(res.body.some(p => p.product.name.toLowerCase().includes('jest'))).toBe(true);
    });

    test('GET /search returns 400 on empty query', async () => {
        const res = await request(app).get('/search');
        expect(res.statusCode).toBe(400);
    });

    test('GET /firebase-config returns config keys', async () => {
        const res = await request(app).get('/firebase-config');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('apiKey');
    });
    describe('Product API Extended Tests', () => {
        const testKey = 'jest-product-key';
        const testProduct = {
            name: 'Jest Test Shirt',
            price: 19.99,
            desc: 'A testing product used in Jest tests.',
            img: 'https://via.placeholder.com/150',
            category: 'Mens'
        };
    
        const extraKeys = [
            'extra-womens-key',
            'extra-unisex-key',
            'extra-mens-key',
            'extra-shoes-key',
            'extra-accessory-key'
        ];
    
        // Clean up extra test keys
        afterAll(async () => {
            for (const key of extraKeys) {
                await request(app).get(`/delete/${key}`);
            }
            await request(app).get(`/delete/${testKey}`);
        });
    
        // Testing for missing or incorrect parameters on saving a product
        test('POST /save returns 400 for missing key', async () => {
            const res = await request(app).post('/save').send({ product: testProduct });
            expect(res.statusCode).toBe(400);
        });
    
        test('POST /save returns 400 for missing product data', async () => {
            const res = await request(app).post('/save').send({ key: testKey });
            expect(res.statusCode).toBe(400);
        });
        // Testing that the product is saved
        test('POST /save saves a new product', async () => {
            const res = await request(app).post('/save').send({ key: testKey, product: testProduct });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Data saved');
        });
    
        // Testing invalid GET requests
        test('GET /get/:key returns 404 for non-existent key', async () => {
            const res = await request(app).get('/get/invalid-key');
            expect(res.statusCode).toBe(404);
        });
    
        test('GET /getProduct/:key returns 404 for non-existent product', async () => {
            const res = await request(app).get('/getProduct/invalid-key');
            expect(res.statusCode).toBe(404);
        });
    
        // Fetch all products after saving some
        test('GET /getAll returns all products', async () => {
            await request(app).post('/save').send({ key: 'extra-mens-key', product: testProduct });
            const res = await request(app).get('/getAll');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    
        // Test for products in different categories
        test('GET /getMens returns mens category', async () => {
            await request(app).post('/save').send({ key: 'extra-mens-key', product: { ...testProduct, category: 'Mens' } });
            const res = await request(app).get('/getMens');
            expect(res.statusCode).toBe(200);
            expect(res.body.some(item => item.value.category.toLowerCase() === 'mens')).toBe(true);
        });
    
        test('GET /getWomens returns womens category', async () => {
            const womensProduct = { ...testProduct, category: 'Womens' };
            await request(app).post('/save').send({ key: 'extra-womens-key', product: womensProduct });
            const res = await request(app).get('/getWomens');
            expect(res.statusCode).toBe(200);
            expect(res.body.some(item => item.value.category.toLowerCase() === 'womens')).toBe(true);
        });
    
        test('GET /getUnisex returns unisex category', async () => {
            const unisexProduct = { ...testProduct, category: 'Unisex' };
            await request(app).post('/save').send({ key: 'extra-unisex-key', product: unisexProduct });
            const res = await request(app).get('/getUnisex');
            expect(res.statusCode).toBe(200);
            expect(res.body.some(item => item.value.category.toLowerCase() === 'unisex')).toBe(true);
        });
    
        // Searching for products
        test('GET /search returns products with name matching query', async () => {
            const res = await request(app).get('/search?q=shirt');
            expect(res.statusCode).toBe(200);
            expect(res.body.some(p => p.product.name.toLowerCase().includes('shirt'))).toBe(true);
        });
    
        test('GET /search returns 400 if query is missing', async () => {
            const res = await request(app).get('/search');
            expect(res.statusCode).toBe(400);
        });
    
        test('GET /search returns no results for unmatched query', async () => {
            const res = await request(app).get('/search?q=nonexistent');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(0);
        });
    
        test('GET /search returns correct case-insensitive results', async () => {
            const res = await request(app).get('/search?q=JEST');
            expect(res.statusCode).toBe(200);
            expect(res.body.some(p => p.product.name.toLowerCase().includes('jest'))).toBe(true);
        });

        // Testing edge cases on saving with special characters
        test('POST /save handles special characters in product name', async () => {
            const productWithSpecialChars = { ...testProduct, name: 'Product @#%^&*' };
            const res = await request(app).post('/save').send({ key: 'special-key', product: productWithSpecialChars });
            expect(res.statusCode).toBe(200);
        });
        // Test for Firebase config
        test('GET /firebase-config returns all necessary keys', async () => {
            const res = await request(app).get('/firebase-config');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('apiKey');
            expect(res.body).toHaveProperty('authDomain');
            expect(res.body).toHaveProperty('projectId');
            expect(res.body).toHaveProperty('storageBucket');
            expect(res.body).toHaveProperty('messagingSenderId');
            expect(res.body).toHaveProperty('appId');
            expect(res.body).toHaveProperty('measurementId');
        });
    
        // Testing large payload for product saving
        test('POST /save handles large product data correctly', async () => {
            const largeProduct = { ...testProduct, desc: 'A'.repeat(10000) }; // Large description
            const res = await request(app).post('/save').send({ key: 'large-product-key', product: largeProduct });
            expect(res.statusCode).toBe(200);
        });
    
        // Fetch the large product
        test('GET /get/:key returns large product data correctly', async () => {
            const res = await request(app).get('/get/large-product-key');
            expect(res.statusCode).toBe(200);
            expect(res.body.value.desc.length).toBe(10000);
        });
    });
    test('POST /save handles very large product description', async () => {
        const largeDescriptionProduct = { ...testProduct, desc: 'A'.repeat(10000) };
        const res = await request(app).post('/save').send({ key: 'large-desc-key', product: largeDescriptionProduct });
        expect(res.statusCode).toBe(200);
    });
    test('GET /get/:key returns 404 for non-existent product', async () => {
        const res = await request(app).get('/get/non-existent-key');
        expect(res.statusCode).toBe(404);
    });
    test('GET /search returns correct case-insensitive results', async () => {
        const res = await request(app).get('/search?q=JEST');
        expect(res.statusCode).toBe(200);
        expect(res.body.some(p => p.product.name.toLowerCase().includes('jest'))).toBe(true);
    });
    test('GET /search returns empty results for unmatched query', async () => {
        const res = await request(app).get('/search?q=nonexistent');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(0);
    });
    test('GET /search returns 400 when query is missing', async () => {
        const res = await request(app).get('/search');
        expect(res.statusCode).toBe(400);
    });
    test('POST /save returns 400 for invalid JSON format', async () => {
        const res = await request(app).post('/save').send('{ key: "invalid-key", product: "invalid-product" ');
        expect(res.statusCode).toBe(400);
    });
    
});