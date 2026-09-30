// AI GENERATED

import { changeLaptopStatus } from '../src/laptop';
import {
  LaptopStatusTransitionError,
  TransitionErrorReason,
} from '../src/errors';
import { Laptop, LaptopStatus } from '../src/types';

const createLaptop = (
  status: LaptopStatus = LaptopStatus.InStock,
): Laptop => ({
  id: 'laptop-123',
  status,
  history: [],
});

const expectTransitionError = (
  action: () => void,
  reason: TransitionErrorReason,
) => {
  try {
    action();
    throw new Error('Expected transition to throw');
  } catch (error) {
    expect(error).toBeInstanceOf(LaptopStatusTransitionError);

    const transitionError = error as LaptopStatusTransitionError;

    expect(transitionError.reason).toBe(reason);
    expect(transitionError.laptopId).toBe('laptop-123');
  }
};

describe('changeLaptopStatus', () => {
  const date = new Date('2026-09-30T10:00:00.000Z');

  describe('valid transitions', () => {
    test('InStock -> Reserved', () => {
      const laptop = createLaptop(LaptopStatus.InStock);

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.Reserved,
        date,
      );

      expect(result.status).toBe(LaptopStatus.Reserved);
    });

    test('InStock -> Sold', () => {
      const laptop = createLaptop(LaptopStatus.InStock);

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.Sold,
        date,
      );

      expect(result.status).toBe(LaptopStatus.Sold);
      expect(result.soldAt).toEqual(date);
    });

    test('InStock -> WrittenOff', () => {
      const laptop = createLaptop(LaptopStatus.InStock);

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.WrittenOff,
        date,
      );

      expect(result.status).toBe(LaptopStatus.WrittenOff);
    });

    test('Reserved -> InStock', () => {
      const laptop = createLaptop(LaptopStatus.Reserved);

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.InStock,
        date,
      );

      expect(result.status).toBe(LaptopStatus.InStock);
    });

    test('Reserved -> Sold', () => {
      const laptop = createLaptop(LaptopStatus.Reserved);

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.Sold,
        date,
      );

      expect(result.status).toBe(LaptopStatus.Sold);
      expect(result.soldAt).toEqual(date);
    });

    test('Sold -> InStock within 14 days', () => {
      const soldAt = new Date('2026-09-01T10:00:00.000Z');
      const returnDate = new Date('2026-09-10T10:00:00.000Z');

      const laptop: Laptop = {
        id: 'laptop-123',
        status: LaptopStatus.Sold,
        history: [],
        soldAt,
      };

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.InStock,
        returnDate,
      );

      expect(result.status).toBe(LaptopStatus.InStock);
      expect(result.soldAt).toBeUndefined();
    });

    test('Sold -> InStock exactly at 14 days', () => {
      const soldAt = new Date('2026-09-01T10:00:00.000Z');
      const returnDate = new Date('2026-09-15T10:00:00.000Z');

      const laptop: Laptop = {
        id: 'laptop-123',
        status: LaptopStatus.Sold,
        history: [],
        soldAt,
      };

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.InStock,
        returnDate,
      );

      expect(result.status).toBe(LaptopStatus.InStock);
    });
  });

  describe('invalid transitions', () => {
    test('InStock -> InStock', () => {
      const laptop = createLaptop();

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.InStock, date),
        'not-allowed',
      );
    });

    test('Reserved -> Reserved', () => {
      const laptop = createLaptop(LaptopStatus.Reserved);

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.Reserved, date),
        'not-allowed',
      );
    });

    test('Reserved -> WrittenOff', () => {
      const laptop = createLaptop(LaptopStatus.Reserved);

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.WrittenOff, date),
        'not-allowed',
      );
    });

    test('Sold -> Reserved', () => {
      const laptop: Laptop = {
        id: 'laptop-123',
        status: LaptopStatus.Sold,
        history: [],
        soldAt: date,
      };

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.Reserved, date),
        'not-allowed',
      );
    });

    test('Sold -> Sold', () => {
      const laptop: Laptop = {
        id: 'laptop-123',
        status: LaptopStatus.Sold,
        history: [],
        soldAt: date,
      };

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.Sold, date),
        'not-allowed',
      );
    });

    test('Sold -> WrittenOff', () => {
      const laptop: Laptop = {
        id: 'laptop-123',
        status: LaptopStatus.Sold,
        history: [],
        soldAt: date,
      };

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.WrittenOff, date),
        'not-allowed',
      );
    });

    test('WrittenOff -> InStock', () => {
      const laptop = createLaptop(LaptopStatus.WrittenOff);

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.InStock, date),
        'terminal-state',
      );
    });

    test('WrittenOff -> Reserved', () => {
      const laptop = createLaptop(LaptopStatus.WrittenOff);

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.Reserved, date),
        'terminal-state',
      );
    });

    test('WrittenOff -> Sold', () => {
      const laptop = createLaptop(LaptopStatus.WrittenOff);

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.Sold, date),
        'terminal-state',
      );
    });

    test('WrittenOff -> WrittenOff', () => {
      const laptop = createLaptop(LaptopStatus.WrittenOff);

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.WrittenOff, date),
        'terminal-state',
      );
    });
  });

  describe('return period', () => {
    test('rejects Sold -> InStock after 14 days', () => {
      const soldAt = new Date('2026-09-01T10:00:00.000Z');
      const returnDate = new Date('2026-09-15T10:00:01.000Z');

      const laptop: Laptop = {
        id: 'laptop-123',
        status: LaptopStatus.Sold,
        history: [],
        soldAt,
      };

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.InStock, returnDate),
        'return-window-expired',
      );
    });

    test('rejects return before the sale date', () => {
      const soldAt = new Date('2026-09-10T10:00:00.000Z');
      const returnDate = new Date('2026-09-09T10:00:00.000Z');

      const laptop: Laptop = {
        id: 'laptop-123',
        status: LaptopStatus.Sold,
        history: [],
        soldAt,
      };

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.InStock, returnDate),
        'return-before-sale',
      );
    });

    test('rejects return when sale date is missing', () => {
      const laptop = createLaptop(LaptopStatus.Sold);

      expectTransitionError(
        () => changeLaptopStatus(laptop, LaptopStatus.InStock, date),
        'sale-date-unknown',
      );
    });
  });

  describe('history', () => {
    test('creates a history entry', () => {
      const laptop = createLaptop(LaptopStatus.InStock);

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.Reserved,
        date,
      );

      expect(result.history).toHaveLength(1);
      expect(result.history[0]).toEqual({
        previousStatus: LaptopStatus.InStock,
        newStatus: LaptopStatus.Reserved,
        date,
      });
    });

    test('stores the correct previous and new statuses', () => {
      const laptop = createLaptop(LaptopStatus.Reserved);

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.Sold,
        date,
      );

      expect(result.history[0].previousStatus).toBe(
        LaptopStatus.Reserved,
      );
      expect(result.history[0].newStatus).toBe(
        LaptopStatus.Sold,
      );
    });

    test('stores the transition date', () => {
      const laptop = createLaptop();

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.Reserved,
        date,
      );

      expect(result.history[0].date).toEqual(date);
    });

    test('preserves previous history entries', () => {
      const previousDate = new Date('2026-09-29T10:00:00.000Z');

      const laptop: Laptop = {
        id: 'laptop-123',
        status: LaptopStatus.Reserved,
        history: [
          {
            previousStatus: LaptopStatus.InStock,
            newStatus: LaptopStatus.Reserved,
            date: previousDate,
          },
        ],
      };

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.Sold,
        date,
      );

      expect(result.history).toHaveLength(2);
      expect(result.history[0].date).toEqual(previousDate);
      expect(result.history[1].date).toEqual(date);
    });
  });

  describe('laptop id', () => {
    test('preserves the laptop id after status change', () => {
      const laptop = createLaptop();

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.Reserved,
        date,
      );

      expect(result.id).toBe('laptop-123');
    });
  });

  describe('immutability', () => {
    test('does not mutate the original laptop', () => {
      const laptop = createLaptop();

      const result = changeLaptopStatus(
        laptop,
        LaptopStatus.Reserved,
        date,
      );

      expect(laptop.status).toBe(LaptopStatus.InStock);
      expect(laptop.history).toHaveLength(0);
      expect(result).not.toBe(laptop);
    });
  });
});