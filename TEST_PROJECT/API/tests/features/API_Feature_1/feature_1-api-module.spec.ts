import { faker } from '@faker-js/faker/locale/en';
import { User } from "../../../dataobject/object.types";
import { environment } from "../../../../../playwright.config";
import { loadDataConfig } from "../../../../../UTILS/config-data-helper";
import { DateTimeDataHelper } from "../../../../../UTILS/date-time-data-helper";
import { test } from "../../../base/api-base-test"

test.describe('Verify feature module',{ tag: '@feature-1-api-create' }, () => {
  const generateTestDate = new DateTimeDataHelper();
  const BASE_URL = process.env.API_URL;
  const USER_URL = `${BASE_URL}` + '/users';

  const singleUser : User = loadDataConfig('TEST_PROJECT/API','user', environment);
  const todayDate = generateTestDate.getFormattedDateWithOffset('days', 0);

  const User: User = {
      firstName: singleUser.firstName,
      lastName: singleUser.lastName,
      email: faker.internet.email(({ firstName: 'John', lastName: 'Doe', provider: 'test.com' })),
      password: ''
  }

  test('Create new user on TodayDate', async ({ apiContext, assertResponseCode }) => {
    const userDataToday = { ...User, password: todayDate }
    const userTodayDateResponse = await apiContext.post(USER_URL, { data: userDataToday });

    await assertResponseCode(userTodayDateResponse, 201);
    const createTodayDateData = await userTodayDateResponse.json();

    const createUser_ID = createTodayDateData._id;
    console.log('user_id: ' + createUser_ID);
    
  });
});