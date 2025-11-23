export type QRType = "url" | "text";
export type QRData = { type: QRType; data: string };
export interface HistoryDataItem extends QRData {
  timestamp: number;
}
export type HistoryData = HistoryDataItem[];
