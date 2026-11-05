import { PrismaClient, DayOfWeek } from "@prisma/client";

const prisma = new PrismaClient();

interface VariantSeed {
  label: string;
  price: number; // pesewas
}

interface MenuItemSeed {
  name: string;
  description?: string;
  availableDays?: DayOfWeek[];
  variants: VariantSeed[];
}

interface CategorySeed {
  name: string;
  sortOrder: number;
  items: MenuItemSeed[];
}

const GHS = (amount: number): number => amount * 100; // convert GHS to pesewas

const categories: CategorySeed[] = [
  {
    name: "Rice Dishes",
    sortOrder: 1,
    items: [
      {
        name: "Assorted Fried Rice",
        description: "A tasty mix of fried rice with assorted ingredients.",
        variants: [{ label: "Standard", price: GHS(80) }],
      },
      {
        name: "Assorted Jollof",
        description: "Classic Ghanaian jollof with rich flavour.",
        variants: [{ label: "Standard", price: GHS(80) }],
      },
      {
        name: "Chicken with Jollof",
        description: "Well seasoned chicken served with jollof.",
        variants: [{ label: "Standard", price: GHS(50) }],
      },
      {
        name: "Chicken with Fried Rice",
        description: "Well seasoned chicken served with fried rice.",
        variants: [{ label: "Standard", price: GHS(50) }],
      },
      {
        name: "Pork/Tilapia with Jollof or Fried Rice",
        description: "Choose between tasty pork or tilapia with jollof or fried rice.",
        variants: [{ label: "Standard", price: GHS(80) }],
      },
      {
        name: "Chicken Thigh with Fried Rice",
        description: "Juicy chicken thigh served with fried rice.",
        variants: [{ label: "Standard", price: GHS(70) }],
      },
      {
        name: "Chicken Thigh with Jollof",
        description: "Juicy chicken thigh served with jollof.",
        variants: [{ label: "Standard", price: GHS(70) }],
      },
    ],
  },
  {
    name: "Loaded Plates",
    sortOrder: 2,
    items: [
      {
        name: "Chicken with French Fries",
        description: "Crispy chicken served with golden fries.",
        variants: [{ label: "Standard", price: GHS(60) }],
      },
      {
        name: "Loaded Fries (Jumbo)",
        description: "Fries loaded with your favourite toppings — jumbo size.",
        variants: [
          { label: "Regular", price: GHS(100) },
          { label: "Large", price: GHS(150) },
        ],
      },
      {
        name: "Loaded Fries",
        description: "Tasty fries with delicious toppings.",
        variants: [
          { label: "Regular", price: GHS(70) },
          { label: "Large", price: GHS(80) },
        ],
      },
      {
        name: "Gizzard/Chicken with Yam Chips",
        description: "Well seasoned gizzard or chicken served with yam chips.",
        variants: [{ label: "Standard", price: GHS(60) }],
      },
      {
        name: "Turkey with Yam Chips",
        description: "Tender turkey served with yam chips.",
        variants: [{ label: "Standard", price: GHS(80) }],
      },
      {
        name: "Pork with Yam Chips",
        description: "Juicy pork served with yam chips.",
        variants: [{ label: "Standard", price: GHS(70) }],
      },
      {
        name: "Assorted Noodles/Spaghetti",
        description: "Tasty noodles or spaghetti with rich flavour.",
        variants: [{ label: "Standard", price: GHS(50) }],
      },
    ],
  },
  {
    name: "Student Saver Menu",
    sortOrder: 3,
    items: [
      {
        name: "Rice Saver",
        description: "Egg-sausage with Curry Rice / Plain Rice / Fried Rice.",
        variants: [{ label: "Standard", price: GHS(35) }],
      },
      {
        name: "Rice Saver II",
        description: "Fried Chicken with Fried Rice / Plain Rice / Curry Rice.",
        variants: [{ label: "Standard", price: GHS(35) }],
      },
      {
        name: "Noodle/Spaghetti Saver",
        description: "Noodles or Spaghetti.",
        variants: [{ label: "Standard", price: GHS(35) }],
      },
      {
        name: "Kelewele Combo",
        description: "Chicken with Kelewele.",
        variants: [{ label: "Standard", price: GHS(45) }],
      },
      {
        name: "Fried Chicken",
        description: "Two Fried Chicken with Fried Rice / Plain Rice / Curry Rice & Coke.",
        variants: [{ label: "Standard", price: GHS(50) }],
      },
      {
        name: "Yam Chips",
        description: "Fried Chicken with Yam Chips & Water.",
        variants: [{ label: "Standard", price: GHS(45) }],
      },
      {
        name: "TGIF Loaded Box",
        description: "Chicken with Rice, Kelewele & Drink.",
        variants: [{ label: "Standard", price: GHS(45) }],
      },
      {
        name: "Check-Check",
        description: "Fried Chicken with Check-Check.",
        variants: [{ label: "Standard", price: GHS(35) }],
      },
    ],
  },
  {
    name: "Snacks & Fast Foods",
    sortOrder: 4,
    items: [
      {
        name: "Chicken - Sausage Shawarma",
        description: "Grilled chicken and sausage wrapped in a tortilla with fresh vegetables and sauce.",
        variants: [
          { label: "Regular", price: GHS(50) },
          { label: "Large", price: GHS(80) },
        ],
      },
      {
        name: "Chicken Burger",
        description: "Juicy chicken burger with fresh vegetables and sauce.",
        variants: [
          { label: "Single", price: GHS(60) },
          { label: "Double", price: GHS(90) },
        ],
      },
      {
        name: "Beef Shawarma",
        description: "Seasoned beef wrapped with fresh vegetables and sauce.",
        variants: [
          { label: "Regular", price: GHS(60) },
          { label: "Large", price: GHS(90) },
        ],
      },
      {
        name: "Beef Burger",
        description: "Grilled beef patty with fresh vegetables and sauce.",
        variants: [
          { label: "Single", price: GHS(70) },
          { label: "Double", price: GHS(90) },
        ],
      },
      {
        name: "Pizza - Chicken/Sausage",
        description: "Cheesy pizza topped with chicken and sausage.",
        variants: [
          { label: "Medium", price: GHS(100) },
          { label: "Large", price: GHS(150) },
        ],
      },
      {
        name: "Cheeseburger",
        description: "Beef burger layered with melted cheese and fresh toppings.",
        variants: [
          { label: "Single", price: GHS(100) },
          { label: "Double", price: GHS(120) },
        ],
      },
      {
        name: "Pizza - Beef",
        description: "Rich, cheesy pizza topped with seasoned beef.",
        variants: [
          { label: "Medium", price: GHS(120) },
          { label: "Large", price: GHS(180) },
        ],
      },
    ],
  },
  {
    name: "Smoothies",
    sortOrder: 5,
    items: [
      {
        name: "Pineapple",
        description: "Fresh pineapple smoothie.",
        variants: [
          { label: "250ml", price: GHS(30) },
          { label: "500ml", price: GHS(50) },
        ],
      },
      {
        name: "Banana",
        description: "Creamy banana smoothie.",
        variants: [
          { label: "250ml", price: GHS(30) },
          { label: "500ml", price: GHS(50) },
        ],
      },
      {
        name: "Mango",
        description: "Fresh mango smoothie.",
        variants: [
          { label: "250ml", price: GHS(30) },
          { label: "500ml", price: GHS(50) },
        ],
      },
      {
        name: "Strawberry",
        description: "Fresh strawberry smoothie.",
        variants: [
          { label: "250ml", price: GHS(40) },
          { label: "500ml", price: GHS(80) },
        ],
      },
      {
        name: "Tropical Twist",
        description: "Pineapple + Mango.",
        variants: [
          { label: "250ml", price: GHS(30) },
          { label: "500ml", price: GHS(50) },
        ],
      },
      {
        name: "Pink Tropical",
        description: "Strawberry + Pineapple.",
        variants: [
          { label: "250ml", price: GHS(40) },
          { label: "500ml", price: GHS(80) },
        ],
      },
      {
        name: "Banana Berry",
        description: "Banana + Strawberry.",
        variants: [
          { label: "250ml", price: GHS(40) },
          { label: "500ml", price: GHS(80) },
        ],
      },
      {
        name: "Mango Banana",
        description: "Mango + Banana.",
        variants: [
          { label: "250ml", price: GHS(30) },
          { label: "500ml", price: GHS(50) },
        ],
      },
      {
        name: "Energy Blend",
        description: "Banana + Milk + Peanut Butter.",
        variants: [
          { label: "250ml", price: GHS(35) },
          { label: "500ml", price: GHS(70) },
        ],
      },
      {
        name: "Fresh Green",
        description: "Pineapple + Cucumber + Ginger.",
        variants: [
          { label: "250ml", price: GHS(30) },
          { label: "500ml", price: GHS(50) },
        ],
      },
    ],
  },
  {
    name: "Specials",
    sortOrder: 6,
    items: [
      {
        name: "Fish, Egg and Wele with Waakye",
        description: "Special Waakye with fish, egg and wele.",
        availableDays: [DayOfWeek.TUESDAY],
        variants: [{ label: "Standard", price: GHS(60) }],
      },
      {
        name: "Beef, Chicken and Fish with Waakye",
        description: "Loaded Waakye with beef, chicken and fish.",
        availableDays: [DayOfWeek.TUESDAY],
        variants: [{ label: "Standard", price: GHS(80) }],
      },
      {
        name: "Loaded Angwamo",
        description: "Rich and flavourful loaded Angwamo.",
        availableDays: [DayOfWeek.TUESDAY],
        variants: [{ label: "Standard", price: GHS(80) }],
      },
      {
        name: "Kontomire Stew with Yam",
        description: "Fresh kontomire stew served with yam.",
        availableDays: [DayOfWeek.THURSDAY],
        variants: [{ label: "Standard", price: GHS(70) }],
      },
      {
        name: "Egg Stew with Yam",
        description: "Delicious egg stew served with yam.",
        availableDays: [DayOfWeek.THURSDAY],
        variants: [{ label: "Standard", price: GHS(60) }],
      },
      {
        name: "Agushi Stew with Yam",
        description: "Tasty agushi stew served with yam.",
        availableDays: [DayOfWeek.THURSDAY],
        variants: [{ label: "Standard", price: GHS(80) }],
      },
    ],
  },
  {
    name: "Extras",
    sortOrder: 7,
    items: [
      {
        name: "Fried Egg",
        description: "Add a fried egg to your meal.",
        variants: [{ label: "Standard", price: GHS(20) }],
      },
      {
        name: "Salad",
        description: "Fresh salad.",
        variants: [{ label: "Standard", price: GHS(50) }],
      },
      {
        name: "Chicken",
        description: "Add chicken to your meal.",
        variants: [{ label: "Standard", price: GHS(20) }],
      },
      {
        name: "Pork",
        description: "Add pork to your meal.",
        variants: [{ label: "Standard", price: GHS(50) }],
      },
      {
        name: "Tilapia",
        description: "Add tilapia to your meal.",
        variants: [{ label: "Standard", price: GHS(50) }],
      },
    ],
  },
];

async function main(): Promise<void> {
  console.warn("🌱 Seeding CEPE Grills & Diner menu...");

  // Clear existing data in correct dependency order
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.itemVariant.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
        sortOrder: category.sortOrder,
        items: {
          create: category.items.map((item) => ({
            name: item.name,
            description: item.description,
            availableDays: item.availableDays ?? [],
            variants: {
              create: item.variants.map((v) => ({
                label: v.label,
                price: v.price,
              })),
            },
          })),
        },
      },
    });
    console.warn(`  ✅ Seeded category: ${createdCategory.name}`);
  }

  console.warn("🎉 Seed complete!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
