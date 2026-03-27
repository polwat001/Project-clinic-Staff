// ===== PRODUCTS =====
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: "raw-material" | "finished-goods" | "packaging";
  unit: string;
  qty: number;
  minQty: number;
  maxQty: number;
  location: string;
  costPerUnit: number;
  lastMovement: string;
}

export const products: Product[] = [
  { id: "P001", sku: "RM-STL-001", name: "เหล็กแผ่น SS400", category: "raw-material", unit: "แผ่น", qty: 120, minQty: 50, maxQty: 500, location: "A-01-01", costPerUnit: 2500, lastMovement: "2026-03-25" },
  { id: "P002", sku: "RM-ALU-002", name: "อลูมิเนียมท่อน 6063", category: "raw-material", unit: "เส้น", qty: 30, minQty: 40, maxQty: 200, location: "A-01-02", costPerUnit: 1800, lastMovement: "2026-03-24" },
  { id: "P003", sku: "RM-PLT-003", name: "พลาสติก ABS เม็ด", category: "raw-material", unit: "กก.", qty: 500, minQty: 100, maxQty: 2000, location: "A-02-01", costPerUnit: 85, lastMovement: "2026-03-26" },
  { id: "P004", sku: "FG-CAS-001", name: "เคสโลหะ Model X1", category: "finished-goods", unit: "ชิ้น", qty: 250, minQty: 50, maxQty: 800, location: "B-01-01", costPerUnit: 4500, lastMovement: "2026-03-25" },
  { id: "P005", sku: "FG-CAS-002", name: "เคสโลหะ Model X2", category: "finished-goods", unit: "ชิ้น", qty: 180, minQty: 30, maxQty: 500, location: "B-01-02", costPerUnit: 5200, lastMovement: "2026-03-26" },
  { id: "P006", sku: "FG-BRK-001", name: "ชุดเบรก Assembly", category: "finished-goods", unit: "ชุด", qty: 45, minQty: 20, maxQty: 300, location: "B-02-01", costPerUnit: 12000, lastMovement: "2026-03-23" },
  { id: "P007", sku: "PK-BOX-001", name: "กล่องบรรจุ ขนาด L", category: "packaging", unit: "ใบ", qty: 800, minQty: 200, maxQty: 3000, location: "C-01-01", costPerUnit: 35, lastMovement: "2026-03-27" },
  { id: "P008", sku: "PK-BOX-002", name: "กล่องบรรจุ ขนาด M", category: "packaging", unit: "ใบ", qty: 1200, minQty: 300, maxQty: 5000, location: "C-01-02", costPerUnit: 25, lastMovement: "2026-03-27" },
  { id: "P009", sku: "RM-RBR-004", name: "ยางซิลิโคน แผ่น", category: "raw-material", unit: "แผ่น", qty: 75, minQty: 30, maxQty: 200, location: "A-03-01", costPerUnit: 650, lastMovement: "2026-03-20" },
  { id: "P010", sku: "FG-MTR-001", name: "มอเตอร์ไฟฟ้า 24V", category: "finished-goods", unit: "ตัว", qty: 60, minQty: 15, maxQty: 150, location: "B-03-01", costPerUnit: 8500, lastMovement: "2026-03-26" },
];

// ===== STOCK MOVEMENTS =====
export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  productName: string;
  type: "receive" | "issue" | "transfer" | "adjust";
  qty: number;
  fromLocation?: string;
  toLocation?: string;
  reference: string;
  note: string;
}

export const stockMovements: StockMovement[] = [
  { id: "SM001", date: "2026-03-27", productId: "P003", productName: "พลาสติก ABS เม็ด", type: "receive", qty: 200, toLocation: "A-02-01", reference: "PO-2026-018", note: "รับตาม PO" },
  { id: "SM002", date: "2026-03-26", productId: "P004", productName: "เคสโลหะ Model X1", type: "issue", qty: -30, fromLocation: "B-01-01", reference: "DO-2026-042", note: "ส่งมอบลูกค้า" },
  { id: "SM003", date: "2026-03-26", productId: "P001", productName: "เหล็กแผ่น SS400", type: "issue", qty: -15, fromLocation: "A-01-01", reference: "MO-2026-009", note: "เบิกเข้าผลิต" },
  { id: "SM004", date: "2026-03-25", productId: "P005", productName: "เคสโลหะ Model X2", type: "transfer", qty: 50, fromLocation: "B-01-03", toLocation: "B-01-02", reference: "TR-2026-005", note: "โอนพื้นที่จัดเก็บ" },
  { id: "SM005", date: "2026-03-25", productId: "P007", productName: "กล่องบรรจุ ขนาด L", type: "receive", qty: 500, toLocation: "C-01-01", reference: "PO-2026-017", note: "รับตาม PO" },
  { id: "SM006", date: "2026-03-24", productId: "P002", productName: "อลูมิเนียมท่อน 6063", type: "adjust", qty: -5, fromLocation: "A-01-02", reference: "ADJ-2026-003", note: "ปรับลดจากการตรวจนับ" },
  { id: "SM007", date: "2026-03-24", productId: "P010", productName: "มอเตอร์ไฟฟ้า 24V", type: "receive", qty: 20, toLocation: "B-03-01", reference: "PO-2026-016", note: "รับตาม PO" },
  { id: "SM008", date: "2026-03-23", productId: "P006", productName: "ชุดเบรก Assembly", type: "issue", qty: -10, fromLocation: "B-02-01", reference: "DO-2026-041", note: "ส่งมอบลูกค้า" },
];

// ===== SALES =====
export interface Quotation {
  id: string;
  date: string;
  customer: string;
  items: { productName: string; qty: number; unitPrice: number }[];
  total: number;
  status: "draft" | "sent" | "approved" | "rejected";
  validUntil: string;
}

export const quotations: Quotation[] = [
  { id: "QT-2026-015", date: "2026-03-25", customer: "บจก. เอเชียเทค", items: [{ productName: "เคสโลหะ Model X1", qty: 100, unitPrice: 5500 }, { productName: "เคสโลหะ Model X2", qty: 50, unitPrice: 6300 }], total: 865000, status: "approved", validUntil: "2026-04-25" },
  { id: "QT-2026-016", date: "2026-03-26", customer: "บจก. สยามอินดัสตรี", items: [{ productName: "ชุดเบรก Assembly", qty: 20, unitPrice: 15000 }], total: 300000, status: "sent", validUntil: "2026-04-26" },
  { id: "QT-2026-017", date: "2026-03-27", customer: "บจก. ไทยโปร", items: [{ productName: "มอเตอร์ไฟฟ้า 24V", qty: 30, unitPrice: 10500 }], total: 315000, status: "draft", validUntil: "2026-04-27" },
];

export interface SalesOrder {
  id: string;
  date: string;
  customer: string;
  quotationRef: string;
  items: { productName: string; qty: number; unitPrice: number }[];
  total: number;
  status: "confirmed" | "processing" | "delivered" | "partial";
  deliveryDate: string;
}

export const salesOrders: SalesOrder[] = [
  { id: "SO-2026-030", date: "2026-03-20", customer: "บจก. เอเชียเทค", quotationRef: "QT-2026-012", items: [{ productName: "เคสโลหะ Model X1", qty: 80, unitPrice: 5500 }], total: 440000, status: "delivered", deliveryDate: "2026-03-25" },
  { id: "SO-2026-031", date: "2026-03-22", customer: "บจก. กรุงไทยพาร์ท", quotationRef: "QT-2026-013", items: [{ productName: "ชุดเบรก Assembly", qty: 15, unitPrice: 15000 }, { productName: "มอเตอร์ไฟฟ้า 24V", qty: 10, unitPrice: 10500 }], total: 330000, status: "processing", deliveryDate: "2026-03-30" },
  { id: "SO-2026-032", date: "2026-03-25", customer: "บจก. เอเชียเทค", quotationRef: "QT-2026-015", items: [{ productName: "เคสโลหะ Model X1", qty: 100, unitPrice: 5500 }], total: 550000, status: "confirmed", deliveryDate: "2026-04-05" },
];

// ===== PURCHASE =====
export interface PurchaseRequest {
  id: string;
  date: string;
  requestedBy: string;
  items: { productName: string; qty: number; estimatedCost: number }[];
  total: number;
  status: "pending" | "approved" | "rejected" | "converted";
  reason: string;
}

export const purchaseRequests: PurchaseRequest[] = [
  { id: "PR-2026-022", date: "2026-03-26", requestedBy: "ฝ่ายผลิต", items: [{ productName: "เหล็กแผ่น SS400", qty: 100, estimatedCost: 2500 }], total: 250000, status: "approved", reason: "เติมสต็อกเพื่อผลิต Lot ถัดไป" },
  { id: "PR-2026-023", date: "2026-03-27", requestedBy: "ฝ่ายคลัง", items: [{ productName: "อลูมิเนียมท่อน 6063", qty: 50, estimatedCost: 1800 }], total: 90000, status: "pending", reason: "สต็อกต่ำกว่า Reorder Point" },
  { id: "PR-2026-024", date: "2026-03-27", requestedBy: "ฝ่ายคลัง", items: [{ productName: "กล่องบรรจุ ขนาด M", qty: 1000, estimatedCost: 25 }], total: 25000, status: "pending", reason: "เตรียมสำหรับ SO ชุดใหญ่" },
];

export interface PurchaseOrder {
  id: string;
  date: string;
  supplier: string;
  prRef: string;
  items: { productName: string; qty: number; unitPrice: number }[];
  total: number;
  status: "draft" | "sent" | "partial" | "received" | "cancelled";
  expectedDate: string;
}

export const purchaseOrders: PurchaseOrder[] = [
  { id: "PO-2026-018", date: "2026-03-24", supplier: "บจก. เคมีภัณฑ์สยาม", prRef: "PR-2026-020", items: [{ productName: "พลาสติก ABS เม็ด", qty: 200, unitPrice: 85 }], total: 17000, status: "received", expectedDate: "2026-03-27" },
  { id: "PO-2026-019", date: "2026-03-26", supplier: "บจก. เหล็กสยาม", prRef: "PR-2026-022", items: [{ productName: "เหล็กแผ่น SS400", qty: 100, unitPrice: 2500 }], total: 250000, status: "sent", expectedDate: "2026-04-02" },
  { id: "PO-2026-020", date: "2026-03-27", supplier: "บจก. อลูมิเนียมไทย", prRef: "PR-2026-023", items: [{ productName: "อลูมิเนียมท่อน 6063", qty: 50, unitPrice: 1800 }], total: 90000, status: "draft", expectedDate: "2026-04-05" },
];

// ===== ACCOUNTING =====
export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  reference: string;
  module: "sales" | "purchase" | "inventory" | "manual";
}

export const journalEntries: JournalEntry[] = [
  { id: "JE-001", date: "2026-03-27", description: "รับสินค้าตาม PO-2026-018", debitAccount: "1200 สินค้าคงเหลือ", creditAccount: "2100 เจ้าหนี้การค้า", amount: 17000, reference: "PO-2026-018", module: "purchase" },
  { id: "JE-002", date: "2026-03-26", description: "ขายสินค้าตาม DO-2026-042", debitAccount: "1100 ลูกหนี้การค้า", creditAccount: "4100 รายได้จากการขาย", amount: 165000, reference: "DO-2026-042", module: "sales" },
  { id: "JE-003", date: "2026-03-26", description: "ต้นทุนสินค้าขาย DO-2026-042", debitAccount: "5100 ต้นทุนสินค้าขาย", creditAccount: "1200 สินค้าคงเหลือ", amount: 135000, reference: "DO-2026-042", module: "sales" },
  { id: "JE-004", date: "2026-03-25", description: "เบิกวัตถุดิบเข้าผลิต MO-2026-009", debitAccount: "1300 งานระหว่างทำ", creditAccount: "1200 สินค้าคงเหลือ", amount: 37500, reference: "MO-2026-009", module: "inventory" },
  { id: "JE-005", date: "2026-03-25", description: "ส่งมอบสินค้า SO-2026-030", debitAccount: "1100 ลูกหนี้การค้า", creditAccount: "4100 รายได้จากการขาย", amount: 440000, reference: "SO-2026-030", module: "sales" },
  { id: "JE-006", date: "2026-03-24", description: "ปรับปรุงสต็อก ADJ-2026-003", debitAccount: "5200 ผลขาดทุนจากสินค้า", creditAccount: "1200 สินค้าคงเหลือ", amount: 9000, reference: "ADJ-2026-003", module: "inventory" },
];

export interface ARAPEntry {
  id: string;
  type: "AR" | "AP";
  date: string;
  partner: string;
  description: string;
  amount: number;
  paid: number;
  balance: number;
  dueDate: string;
  status: "open" | "partial" | "paid" | "overdue";
}

export const arapEntries: ARAPEntry[] = [
  { id: "AR-001", type: "AR", date: "2026-03-25", partner: "บจก. เอเชียเทค", description: "SO-2026-030", amount: 440000, paid: 0, balance: 440000, dueDate: "2026-04-25", status: "open" },
  { id: "AR-002", type: "AR", date: "2026-03-20", partner: "บจก. สยามอินดัสตรี", description: "SO-2026-028", amount: 220000, paid: 110000, balance: 110000, dueDate: "2026-04-20", status: "partial" },
  { id: "AR-003", type: "AR", date: "2026-03-10", partner: "บจก. ไทยโปร", description: "SO-2026-025", amount: 180000, paid: 180000, balance: 0, dueDate: "2026-04-10", status: "paid" },
  { id: "AP-001", type: "AP", date: "2026-03-27", partner: "บจก. เคมีภัณฑ์สยาม", description: "PO-2026-018", amount: 17000, paid: 0, balance: 17000, dueDate: "2026-04-27", status: "open" },
  { id: "AP-002", type: "AP", date: "2026-03-15", partner: "บจก. เหล็กสยาม", description: "PO-2026-015", amount: 350000, paid: 175000, balance: 175000, dueDate: "2026-04-15", status: "partial" },
  { id: "AP-003", type: "AP", date: "2026-02-28", partner: "บจก. แพ็คแอนด์โก", description: "PO-2026-010", amount: 45000, paid: 0, balance: 45000, dueDate: "2026-03-28", status: "overdue" },
];

export interface CostSummary {
  productName: string;
  sku: string;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  costMethod: "moving-avg" | "fifo";
  unitsProduced: number;
  costPerUnit: number;
}

export const costSummaries: CostSummary[] = [
  { productName: "เคสโลหะ Model X1", sku: "FG-CAS-001", materialCost: 2800, laborCost: 800, overheadCost: 400, totalCost: 4000, costMethod: "moving-avg", unitsProduced: 150, costPerUnit: 4000 },
  { productName: "เคสโลหะ Model X2", sku: "FG-CAS-002", materialCost: 3200, laborCost: 1000, overheadCost: 500, totalCost: 4700, costMethod: "moving-avg", unitsProduced: 80, costPerUnit: 4700 },
  { productName: "ชุดเบรก Assembly", sku: "FG-BRK-001", materialCost: 7500, laborCost: 2500, overheadCost: 1200, totalCost: 11200, costMethod: "fifo", unitsProduced: 30, costPerUnit: 11200 },
  { productName: "มอเตอร์ไฟฟ้า 24V", sku: "FG-MTR-001", materialCost: 5000, laborCost: 2000, overheadCost: 800, totalCost: 7800, costMethod: "moving-avg", unitsProduced: 40, costPerUnit: 7800 },
];

// ===== DELIVERY CALENDAR =====
export interface DeliveryEvent {
  id: string;
  date: string;
  type: "delivery" | "receive";
  reference: string;
  partner: string;
  items: string;
  status: "scheduled" | "completed" | "delayed";
}

export const deliveryEvents: DeliveryEvent[] = [
  { id: "DE-001", date: "2026-03-28", type: "receive", reference: "PO-2026-019", partner: "บจก. เหล็กสยาม", items: "เหล็กแผ่น SS400 x100", status: "scheduled" },
  { id: "DE-002", date: "2026-03-30", type: "delivery", reference: "SO-2026-031", partner: "บจก. กรุงไทยพาร์ท", items: "ชุดเบรก x15, มอเตอร์ x10", status: "scheduled" },
  { id: "DE-003", date: "2026-04-02", type: "receive", reference: "PO-2026-019", partner: "บจก. เหล็กสยาม", items: "เหล็กแผ่น SS400 x100", status: "scheduled" },
  { id: "DE-004", date: "2026-04-05", type: "delivery", reference: "SO-2026-032", partner: "บจก. เอเชียเทค", items: "เคสโลหะ Model X1 x100", status: "scheduled" },
  { id: "DE-005", date: "2026-04-05", type: "receive", reference: "PO-2026-020", partner: "บจก. อลูมิเนียมไทย", items: "อลูมิเนียมท่อน x50", status: "scheduled" },
];
