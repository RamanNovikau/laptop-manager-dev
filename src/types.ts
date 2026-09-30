/**
 * Represents all possible statuses of a laptop.
 */
export enum LaptopStatus {
  InStock = 'InStock',
  Reserved = 'Reserved',
  Sold = 'Sold',
  WrittenOff = 'WrittenOff',
}

/**
 * Represents a single status change in the laptop's history.
 */
export interface StatusHistoryEntry {
  previousStatus: LaptopStatus;
  newStatus: LaptopStatus;
  date: Date;
}

/**
 * Represents the current state of a laptop, including its status,
 * status history, and sale date when applicable.
 */
export interface Laptop {
  id: string;
  status: LaptopStatus;
  history: StatusHistoryEntry[];
  soldAt?: Date;
}