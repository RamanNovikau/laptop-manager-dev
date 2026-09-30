import {
  Laptop,
  LaptopStatus,
  StatusHistoryEntry,
} from './types';
import { LaptopStatusTransitionError } from './errors';

const ALLOWED_TRANSITIONS: Record<LaptopStatus, LaptopStatus[]> = {
  [LaptopStatus.InStock]: [
    LaptopStatus.Reserved,
    LaptopStatus.Sold,
    LaptopStatus.WrittenOff,
  ],
  [LaptopStatus.Reserved]: [
    LaptopStatus.InStock,
    LaptopStatus.Sold,
  ],
  [LaptopStatus.Sold]: [LaptopStatus.InStock],
  [LaptopStatus.WrittenOff]: [],
};

const RETURN_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Changes the laptop status and records the successful transition in history.
 */
export function changeLaptopStatus(
  laptop: Laptop,
  newStatus: LaptopStatus,
  currentDate: Date,
): Laptop {
  const currentStatus = laptop.status;

  if (currentStatus === LaptopStatus.WrittenOff) {
    throw new LaptopStatusTransitionError(
      laptop.id,
      currentStatus,
      newStatus,
      'terminal-state',
      `Cannot change laptop ${laptop.id}: WrittenOff is a terminal status`,
    );
  }

  if (!ALLOWED_TRANSITIONS[currentStatus].includes(newStatus)) {
    throw new LaptopStatusTransitionError(
      laptop.id,
      currentStatus,
      newStatus,
      'not-allowed',
      `Invalid status transition: ${currentStatus} -> ${newStatus}`,
    );
  }

  if (currentStatus === LaptopStatus.Sold) {
    if (!laptop.soldAt) {
      throw new LaptopStatusTransitionError(
        laptop.id,
        currentStatus,
        newStatus,
        'sale-date-unknown',
        `Cannot return laptop ${laptop.id}: sale date is missing`,
      );
    }

    const elapsedTime =
      currentDate.getTime() - laptop.soldAt.getTime();

    if (elapsedTime < 0) {
      throw new LaptopStatusTransitionError(
        laptop.id,
        currentStatus,
        newStatus,
        'return-before-sale',
        `Cannot return laptop ${laptop.id}: return date cannot be before sale date`,
      );
    }

    if (elapsedTime > RETURN_PERIOD_MS) {
      throw new LaptopStatusTransitionError(
        laptop.id,
        currentStatus,
        newStatus,
        'return-window-expired',
        `Cannot return laptop ${laptop.id}: the 14-day return period has expired`,
      );
    }
  }

  const historyEntry: StatusHistoryEntry = {
    previousStatus: currentStatus,
    newStatus,
    date: currentDate,
  };

  const soldAt =
    newStatus === LaptopStatus.Sold
      ? currentDate
      : laptop.soldAt;

  return {
    ...laptop,
    status: newStatus,
    history: [...laptop.history, historyEntry],
    soldAt,
  };
}