import { prisma } from "@/lib/db";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS \`Order\` (
    \`id\` INTEGER NOT NULL AUTO_INCREMENT,
    \`orderNumber\` VARCHAR(191) NOT NULL,
    \`customerId\` INTEGER NULL,
    \`customerName\` VARCHAR(191) NOT NULL,
    \`phone\` VARCHAR(191) NOT NULL,
    \`whatsapp\` VARCHAR(191) NULL,
    \`email\` VARCHAR(191) NULL,
    \`city\` VARCHAR(191) NOT NULL,
    \`area\` VARCHAR(191) NULL,
    \`address\` VARCHAR(1000) NOT NULL,
    \`landmark\` VARCHAR(191) NULL,
    \`notes\` VARCHAR(1000) NULL,
    \`subtotal\` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    \`shippingFee\` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    \`discount\` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    \`total\` DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    \`status\` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    \`paymentMethod\` VARCHAR(191) NOT NULL DEFAULT 'COD',
    \`paymentStatus\` VARCHAR(191) NOT NULL DEFAULT 'UNPAID',
    \`stockRestored\` BOOLEAN NOT NULL DEFAULT false,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    UNIQUE INDEX \`Order_orderNumber_key\`(\`orderNumber\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`OrderItem\` (
    \`id\` INTEGER NOT NULL AUTO_INCREMENT,
    \`orderId\` INTEGER NOT NULL,
    \`productId\` INTEGER NOT NULL,
    \`productNameSnapshot\` VARCHAR(191) NOT NULL,
    \`skuSnapshot\` VARCHAR(191) NOT NULL,
    \`imageSnapshot\` VARCHAR(500) NULL,
    \`quantity\` INTEGER NOT NULL,
    \`unitPrice\` DECIMAL(10, 2) NOT NULL,
    \`totalPrice\` DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  "ALTER TABLE `Order` ADD COLUMN `whatsapp` VARCHAR(191) NULL",
  "ALTER TABLE `Order` ADD COLUMN `area` VARCHAR(191) NULL",
  "ALTER TABLE `Order` ADD COLUMN `landmark` VARCHAR(191) NULL",
  "ALTER TABLE `Order` ADD COLUMN `stockRestored` BOOLEAN NOT NULL DEFAULT false",
  "ALTER TABLE `Order` MODIFY `address` VARCHAR(1000) NOT NULL",
  "ALTER TABLE `Order` MODIFY `notes` VARCHAR(1000) NULL",
  "ALTER TABLE `OrderItem` ADD COLUMN `imageSnapshot` VARCHAR(500) NULL",
  "ALTER TABLE `Order` ADD COLUMN `customerId` INTEGER NULL",
];

export async function ensureOrderSchema(): Promise<void> {
  for (const statement of STATEMENTS) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/duplicate|exists|already/i.test(message)) {
        console.error("[orders] Schema statement failed:", statement, error);
      }
    }
  }
}
