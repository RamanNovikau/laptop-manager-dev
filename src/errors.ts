import type { LaptopStatus } from './types';

/**
 * Describes why a laptop status transition was rejected.
 */
export type TransitionErrorReason =
  | 'terminal-state'
  | 'not-allowed'
  | 'sale-date-unknown'
  | 'return-before-sale'
  | 'return-window-expired';

/**
 * Error thrown when a laptop status transition is rejected.
 */
export class LaptopStatusTransitionError extends Error {
  readonly laptopId: string;
  readonly from: LaptopStatus;
  readonly to: LaptopStatus;
  readonly reason: TransitionErrorReason;

  constructor(
    laptopId: string,
    from: LaptopStatus,
    to: LaptopStatus,
    reason: TransitionErrorReason,
    message: string,
  ) {
    super(message);
    this.name = 'LaptopStatusTransitionError';
    this.laptopId = laptopId;
    this.from = from;
    this.to = to;
    this.reason = reason;
  }
}