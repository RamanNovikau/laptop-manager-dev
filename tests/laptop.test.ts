// AI GENERATED

import {
  changeLaptopStatus,
  LaptopState,
  LaptopStatus,
} from '../src/laptop';

const date = (value: string) => new Date(value);

const createLaptop = (
  status: LaptopStatus,
  soldAt?: Date,
): LaptopState => ({
  status,
  soldAt,
  history: [],
});

describe('changeLaptopStatus', () => {
  describe('valid transitions', () => {
    test.each([
      [LaptopStatus.InStock, LaptopStatus.Reserved],
      [LaptopStatus.InStock, LaptopStatus.Sold],
      [LaptopStatus.InStock, LaptopStatus.WrittenOff],
      [LaptopStatus.Reserved, LaptopStatus.InStock],
      [LaptopStatus.Reserved, LaptopStatus.Sold],
    ])('%s -> %s is allowed', (from, to) => {
      const result = changeLaptopStatus(
        createLaptop(from),
        to,
        date('2026-01-01T12:00:00.000Z'),
      );

      expect(result.status).toBe(to);
    });

    test('Sold -> InStock is allowed within 14 days', () => {
      const soldAt = date('2026-01-01T12:00:00.000Z');
      const result = changeLaptopStatus(
        createLaptop(LaptopStatus.Sold, soldAt),
        LaptopStatus.InStock,
        date('2026-01-10T12:00:00.000Z'),
      );

      expect(result.status).toBe(LaptopStatus.InStock);
    });

    test('Sold -> InStock is allowed exactly 14 days after sale', () => {
      const soldAt = date('2026-01-01T12:00:00.000Z');
      const result = changeLaptopStatus(
        createLaptop(LaptopStatus.Sold, soldAt),
        LaptopStatus.InStock,
        date('2026-01-15T12:00:00.000Z'),
      );

      expect(result.status).toBe(LaptopStatus.InStock);
    });
  });

  describe('invalid transitions', () => {
    test.each([
      [LaptopStatus.InStock, LaptopStatus.InStock],
      [LaptopStatus.Reserved, LaptopStatus.Reserved],
      [LaptopStatus.Reserved, LaptopStatus.WrittenOff],
      [LaptopStatus.Sold, LaptopStatus.Sold],
      [LaptopStatus.Sold, LaptopStatus.Reserved],
      [LaptopStatus.Sold, LaptopStatus.WrittenOff],
      [LaptopStatus.WrittenOff, LaptopStatus.InStock],
      [LaptopStatus.WrittenOff, LaptopStatus.Reserved],
      [LaptopStatus.WrittenOff, LaptopStatus.Sold],
    ])('%s -> %s is rejected with a meaningful error', (from, to) => {
      expect(() =>
        changeLaptopStatus(
          createLaptop(from),
          to,
          date('2026-01-01T12:00:00.000Z'),
        ),
      ).toThrow(`Invalid status transition: ${from} -> ${to}`);
    });

    test('Sold -> InStock is rejected after 14 days', () => {
      const soldAt = date('2026-01-01T12:00:00.000Z');

      expect(() =>
        changeLaptopStatus(
          createLaptop(LaptopStatus.Sold, soldAt),
          LaptopStatus.InStock,
          date('2026-01-15T12:00:00.001Z'),
        ),
      ).toThrow('Laptop return is allowed only within 14 days after sale');
    });

    test('Sold -> InStock is rejected when sale date is missing', () => {
      expect(() =>
        changeLaptopStatus(
          createLaptop(LaptopStatus.Sold),
          LaptopStatus.InStock,
          date('2026-01-10T12:00:00.000Z'),
        ),
      ).toThrow('Cannot return a sold laptop without a sale date');
    });

    test('Sold -> InStock is rejected when return date is before sale date', () => {
      const soldAt = date('2026-01-10T12:00:00.000Z');

      expect(() =>
        changeLaptopStatus(
          createLaptop(LaptopStatus.Sold, soldAt),
          LaptopStatus.InStock,
          date('2026-01-09T12:00:00.000Z'),
        ),
      ).toThrow('Laptop return is allowed only within 14 days after sale');
    });
  });

  describe('history', () => {
    test('records previous status, new status and date', () => {
      const currentDate = date('2026-01-01T12:00:00.000Z');

      const result = changeLaptopStatus(
        createLaptop(LaptopStatus.InStock),
        LaptopStatus.Reserved,
        currentDate,
      );

      expect(result.history).toEqual([
        {
          previousStatus: LaptopStatus.InStock,
          newStatus: LaptopStatus.Reserved,
          date: currentDate,
        },
      ]);
    });

    test('appends history without modifying the previous state', () => {
      const initial = createLaptop(LaptopStatus.InStock);
      const firstDate = date('2026-01-01T12:00:00.000Z');
      const secondDate = date('2026-01-02T12:00:00.000Z');

      const reserved = changeLaptopStatus(
        initial,
        LaptopStatus.Reserved,
        firstDate,
      );
      const sold = changeLaptopStatus(reserved, LaptopStatus.Sold, secondDate);

      expect(initial.history).toHaveLength(0);
      expect(reserved.history).toHaveLength(1);
      expect(sold.history).toHaveLength(2);
      expect(sold.history[1]).toEqual({
        previousStatus: LaptopStatus.Reserved,
        newStatus: LaptopStatus.Sold,
        date: secondDate,
      });
    });

    test('stores the sale date when a laptop becomes Sold', () => {
      const saleDate = date('2026-01-05T12:00:00.000Z');

      const result = changeLaptopStatus(
        createLaptop(LaptopStatus.InStock),
        LaptopStatus.Sold,
        saleDate,
      );

      expect(result.soldAt).toEqual(saleDate);
    });
  });
});
