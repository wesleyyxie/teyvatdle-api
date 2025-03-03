import type { RowDataPacket } from "mysql2/promise";

export interface CountRows extends RowDataPacket {
  "COUNT(*)": Number;
}
