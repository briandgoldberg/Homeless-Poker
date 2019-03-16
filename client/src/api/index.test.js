import { deposit, instance } from './index.js'

beforeEach(() => {
    instance()
})
describe('basic route tests', () => {
 test('get home route GET /', async () => {
     console.log(deposit('0x222b9dbf79318c11f378123eb7d3deef94256ea7', 10));
 });
});