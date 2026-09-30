// AI GENERATED

export enum LaptopStatus {
  InStock = 'InStock',
  Reserved = 'Reserved',
  Sold = 'Sold',
  WrittenOff = 'WrittenOff',
}

// AI GENERATED
export interface StatusHistoryEntry {
  previousStatus: LaptopStatus;
  newStatus: LaptopStatus;
  date: Date;
}

// AI GENERATED
export interface LaptopState {
  status: LaptopStatus;
  soldAt?: Date;
  history: StatusHistoryEntry[];
}

// AI GENERATED
const ALLOWED_TRANSITIONS: Record<LaptopStatus, LaptopStatus[]> = {
  [LaptopStatus.InStock]: [
    LaptopStatus.Reserved,
    LaptopStatus.Sold,
    LaptopStatus.WrittenOff,
  ],
  [LaptopStatus.Reserved]: [LaptopStatus.InStock, LaptopStatus.Sold],
  [LaptopStatus.Sold]: [LaptopStatus.InStock],
  [LaptopStatus.WrittenOff]: [],
};

// AI GENERATED
const RETURN_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

// AI GENERATED
export function changeLaptopStatus(
  laptop: LaptopState,
  newStatus: LaptopStatus,
  currentDate: Date,
): LaptopState {
  const { status: previousStatus } = laptop;

  if (!ALLOWED_TRANSITIONS[previousStatus].includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${previousStatus} -> ${newStatus}`,
    );
  }

  if (previousStatus === LaptopStatus.Sold && newStatus === LaptopStatus.InStock) {
    if (!laptop.soldAt) {
      throw new Error('Cannot return a sold laptop without a sale date');
    }

    const elapsedMs = currentDate.getTime() - laptop.soldAt.getTime();

    if (elapsedMs < 0 || elapsedMs > RETURN_WINDOW_MS) {
      throw new Error('Laptop return is allowed only within 14 days after sale');
    }
  }

  const historyEntry: StatusHistoryEntry = {
    previousStatus,
    newStatus,
    date: new Date(currentDate),
  };

  return {
    ...laptop,
    status: newStatus,
    soldAt:
      newStatus === LaptopStatus.Sold
        ? new Date(currentDate)
        : laptop.soldAt,
    history: [...laptop.history, historyEntry],
  };
}
