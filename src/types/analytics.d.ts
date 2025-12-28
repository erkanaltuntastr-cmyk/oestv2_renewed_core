import type { HistoryEntry } from './history';

export type VolumeMap = Record<string, number>;
export type FrequencyMap = Record<string, number>;
export type TopMovement = { code: string; count: number };
export type ProgressionPoint = { date: number; volume: number };
export type PRRecord = Record<string, number>;

export function getDailyVolume(history?: HistoryEntry[]): VolumeMap;
export function getWeeklyVolume(history?: HistoryEntry[]): VolumeMap;
export function getMonthlyVolume(history?: HistoryEntry[]): VolumeMap;
export function getTotalVolume(history?: HistoryEntry[]): number;

export function getMovementFrequency(history?: HistoryEntry[]): FrequencyMap;
export function getTopMovements(history?: HistoryEntry[], limit?: number): TopMovement[];

export function getMovementProgression(history: HistoryEntry[] | undefined, movementCode: string): ProgressionPoint[];
export function getPRs(history?: HistoryEntry[]): PRRecord;
