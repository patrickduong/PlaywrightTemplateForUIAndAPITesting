import { faker } from '@faker-js/faker/locale/en';
import { Contact } from '../../../dataobject/object.types';
import { environment } from '../../../../../playwright.config';
import { loadDataConfig } from '../../../../../UTILS/config-data-helper';
import { DateTimeDataHelper } from '../../../../../UTILS/date-time-data-helper';
import { test, expect } from '../../../base/api-base-test';
import { TestTags, APIResponseCodes } from '../../../../../constants';

/**
 * API Tests for Contact Management
 * Tests the contact creation and retrieval endpoints
 */
test.describe('Contact API Tests', () => {
    const dateHelper = new DateTimeDataHelper();
    const baseUrl = process.env.API_URL;
    const contactUrl = `${baseUrl}/contacts`;

    // Load test data with dynamic values
    const contactTestData: Contact = loadDataConfig(
        'TEST_PROJECT/API',
        'contact',
        environment
    );

    /**
     * Generate contact data with unique values
     */
    function generateContactData(): Contact {
        return {
            ...contactTestData,
            email: faker.internet.email(),
            phone: faker.phone.number({ style: 'national' }),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName()
        };
    }

    test(`${TestTags.SMOKE} ${TestTags.API} Create new contact`, async ({
        apiContext,
        assertResponseCode,
    }) => {
        // Arrange
        const contactData = generateContactData();

        // Act
        const response = await apiContext.post(contactUrl, {
            data: contactData,
        });

        // Assert
        await assertResponseCode(response, APIResponseCodes.CREATED);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('_id');
        expect(responseBody.firstName).toBe(contactData.firstName);
        expect(responseBody.lastName).toBe(contactData.lastName);
        // API converts email to lowercase
        expect(responseBody.email).toBe(contactData.email.toLowerCase());
        
        console.log(`Contact created with ID: ${responseBody._id}`);
    });

    test(`${TestTags.REGRESSION} ${TestTags.API} Create contact with required fields only`, async ({
        apiContext,
        assertResponseCode,
    }) => {
        // Arrange
        const minimalContactData = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
        };

        // Act
        const response = await apiContext.post(contactUrl, {
            data: minimalContactData,
        });

        // Assert
        await assertResponseCode(response, APIResponseCodes.CREATED);
        const responseBody = await response.json();
        
        expect(responseBody._id).toBeTruthy();
        expect(responseBody.firstName).toBe(minimalContactData.firstName);
        
        console.log(`Minimal contact created successfully`);
    });

    test(`${TestTags.REGRESSION} ${TestTags.API} Get all contacts`, async ({
        apiContext,
        assertResponseCode,
    }) => {
        // Act
        const response = await apiContext.get(contactUrl);

        // Assert
        await assertResponseCode(response, APIResponseCodes.OK);
        const responseBody = await response.json();
        
        expect(Array.isArray(responseBody)).toBeTruthy();
        
        console.log(`Retrieved ${responseBody.length} contacts`);
    });

    test(`${TestTags.SANITY} ${TestTags.API} Handle invalid request gracefully`, async ({
        apiContext,
    }) => {
        // Arrange
        const invalidData = {
            firstName: '', // Invalid: empty required field
        };

        // Act
        const response = await apiContext.post(contactUrl, {
            data: invalidData,
        });

        // Assert - Expect 400 Bad Request for invalid data
        const statusCode = response.status();
        expect([400, 422]).toContain(statusCode);
        
        console.log(`Invalid request handled with status: ${statusCode}`);
    });
});
