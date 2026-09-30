// AI GENERATED

import { changeLaptopStatus } from './laptop';
import { Laptop, LaptopStatus } from './types';

const laptop: Laptop = {
  id: 'laptop-123',
  status: LaptopStatus.InStock,
  history: [],
};

const reservationDate = new Date('2026-09-30T09:00:00.000Z');
const saleDate = new Date('2026-09-30T10:00:00.000Z');
const returnDate = new Date('2026-10-10T10:00:00.000Z');

console.log('Initial laptop:');
console.log(laptop);

const reservedLaptop = changeLaptopStatus(
  laptop,
  LaptopStatus.Reserved,
  reservationDate,
);

console.log('\nAfter reservation:');
console.log(reservedLaptop);

const soldLaptop = changeLaptopStatus(
  reservedLaptop,
  LaptopStatus.Sold,
  saleDate,
);

console.log('\nAfter sale:');
console.log(soldLaptop);

const returnedLaptop = changeLaptopStatus(
  soldLaptop,
  LaptopStatus.InStock,
  returnDate,
);

console.log('\nAfter return:');
console.log(returnedLaptop);

console.log('\nHistory:');
console.log(returnedLaptop.history);

try {
  changeLaptopStatus(
    returnedLaptop,
    LaptopStatus.WrittenOff,
    new Date('2026-10-11T10:00:00.000Z'),
  );

  console.log('\nLaptop written off successfully.');
} catch (error) {
  console.error('\nTransition failed:', error);
}