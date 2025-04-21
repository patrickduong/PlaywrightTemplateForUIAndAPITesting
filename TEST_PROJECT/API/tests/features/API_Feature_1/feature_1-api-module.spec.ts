import { faker } from '@faker-js/faker/locale/en'
import { Contact, User } from '../../../dataobject/object.types'
import { environment } from '../../../../../playwright.config'
import { loadDataConfig } from '../../../../../UTILS/config-data-helper'
import { DateTimeDataHelper } from '../../../../../UTILS/date-time-data-helper'
import { test } from '../../../base/api-base-test'

test.describe('Verify feature module', { tag: '@feature-1-api-create' }, () => {
  const generateTestDate = new DateTimeDataHelper()
  const BASE_URL = process.env.API_URL
  const todayDate = generateTestDate.getFormattedDateWithOffset('days', 0)

  const CONTACT_URL = `${BASE_URL}` + '/contacts'
  const singleContact: Contact = loadDataConfig(
    'TEST_PROJECT/API',
    'contact',
    environment
  )

  const Contact: Contact = {
    firstName: singleContact.firstName,
    lastName: singleContact.lastName,
    birthdate: todayDate,
    email: faker.internet.email({
      firstName: 'John',
      lastName: 'Doe',
      provider: 'test.com',
    }),
    phone: faker.phone.number({ style: 'national' }),
    street1: singleContact.street1,
    street2: singleContact.street2,
    city: singleContact.city,
    stateProvince: singleContact.stateProvince,
    postalCode: singleContact.postalCode,
    country: singleContact.country,
  }

  test('Create new contact on TodayDate', async ({
    apiContext,
    assertResponseCode,
  }) => {
    const contactDataToday = { ...Contact }
    const contactTodayDateResponse = await apiContext.post(CONTACT_URL, {
      data: contactDataToday,
    })

    await assertResponseCode(contactTodayDateResponse, 201)
    const createContactTodayDateData = await contactTodayDateResponse.json()

    const createContact_ID = createContactTodayDateData._id
    console.log('contact_id: ' + `${createContact_ID}`)
  })
})
