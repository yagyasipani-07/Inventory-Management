const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const challans = await prisma.challan.findMany({
      orderBy: { createdAt: 'desc' },
      include: { customer: true, lineItems: { include: { product: true } } },
      take: 1
    });
    console.log("Challans:", JSON.stringify(challans));
    
    const products = await prisma.product.findMany({take: 1});
    console.log("Products:", JSON.stringify(products));

    const customers = await prisma.customer.findMany({take: 1});
    console.log("Customers:", JSON.stringify(customers));
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
