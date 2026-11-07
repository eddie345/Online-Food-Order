// src/lib/static-menu.ts
// Fallback static menu data for preview / demo environments when database is disconnected.

import { CategoryDTO, MenuItemDTO } from "@/types";
import { DayOfWeek } from "@prisma/client";
import { isItemAvailableToday } from "./day-lock";

const GHS = (amount: number): number => amount * 100;

interface RawItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  availableDays?: DayOfWeek[];
  variants: Array<{ id: string; label: string; price: number }>;
}

interface RawCategory {
  id: string;
  name: string;
  sortOrder: number;
  items: RawItem[];
}

const RAW_MENU: RawCategory[] = [
  {
    id: "cat-rice",
    name: "Rice Dishes",
    sortOrder: 1,
    items: [
      {
        id: "rice-1",
        name: "Assorted Fried Rice",
        description: "A tasty mix of fried rice with assorted ingredients.",
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-rice-1", label: "Standard", price: GHS(80) }],
      },
      {
        id: "rice-2",
        name: "Assorted Jollof",
        description: "Classic Ghanaian jollof with rich flavour.",
        imageUrl: "https://images.unsplash.com/photo-1662908226065-ef5610ec1f79?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-rice-2", label: "Standard", price: GHS(80) }],
      },
      {
        id: "rice-3",
        name: "Chicken with Jollof",
        description: "Well seasoned chicken served with jollof.",
        imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-rice-3", label: "Standard", price: GHS(50) }],
      },
      {
        id: "rice-4",
        name: "Chicken with Fried Rice",
        description: "Well seasoned chicken served with fried rice.",
        imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-rice-4", label: "Standard", price: GHS(50) }],
      },
      {
        id: "rice-5",
        name: "Pork/Tilapia with Jollof or Fried Rice",
        description: "Choose between tasty pork or tilapia with jollof or fried rice.",
        imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-rice-5", label: "Standard", price: GHS(80) }],
      },
      {
        id: "rice-6",
        name: "Chicken Thigh with Fried Rice",
        description: "Juicy chicken thigh served with fried rice.",
        imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-rice-6", label: "Standard", price: GHS(70) }],
      },
      {
        id: "rice-7",
        name: "Chicken Thigh with Jollof",
        description: "Juicy chicken thigh served with jollof.",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-rice-7", label: "Standard", price: GHS(70) }],
      },
    ],
  },
  {
    id: "cat-loaded",
    name: "Loaded Plates",
    sortOrder: 2,
    items: [
      {
        id: "loaded-1",
        name: "Chicken with French Fries",
        description: "Crispy chicken served with golden fries.",
        imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-loaded-1", label: "Standard", price: GHS(60) }],
      },
      {
        id: "loaded-2",
        name: "Loaded Fries (Jumbo)",
        description: "Fries loaded with your favourite toppings - jumbo size.",
        imageUrl: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-loaded-2-reg", label: "Regular", price: GHS(100) },
          { id: "v-loaded-2-lrg", label: "Large", price: GHS(150) },
        ],
      },
      {
        id: "loaded-3",
        name: "Loaded Fries",
        description: "Tasty fries with delicious toppings.",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-loaded-3-reg", label: "Regular", price: GHS(70) },
          { id: "v-loaded-3-lrg", label: "Large", price: GHS(80) },
        ],
      },
      {
        id: "loaded-4",
        name: "Gizzard/Chicken with Yam Chips",
        description: "Well seasoned gizzard or chicken served with yam chips.",
        imageUrl: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-loaded-4", label: "Standard", price: GHS(60) }],
      },
      {
        id: "loaded-5",
        name: "Turkey with Yam Chips",
        description: "Tender turkey served with yam chips.",
        imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-loaded-5", label: "Standard", price: GHS(80) }],
      },
      {
        id: "loaded-6",
        name: "Pork with Yam Chips",
        description: "Juicy pork served with yam chips.",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-loaded-6", label: "Standard", price: GHS(70) }],
      },
      {
        id: "loaded-7",
        name: "Assorted Noodles/Spaghetti",
        description: "Tasty noodles or spaghetti with rich flavour.",
        imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-loaded-7", label: "Standard", price: GHS(50) }],
      },
    ],
  },
  {
    id: "cat-student",
    name: "Student Saver Menu",
    sortOrder: 3,
    items: [
      {
        id: "student-1",
        name: "Rice Saver",
        description: "Egg-sausage with Curry Rice / Plain Rice / Fried Rice.",
        imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-student-1", label: "Standard", price: GHS(35) }],
      },
      {
        id: "student-2",
        name: "Rice Saver II",
        description: "Fried Chicken with Fried Rice / Plain Rice / Curry Rice.",
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-student-2", label: "Standard", price: GHS(35) }],
      },
      {
        id: "student-3",
        name: "Noodle/Spaghetti Saver",
        description: "Noodles or Spaghetti.",
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-student-3", label: "Standard", price: GHS(35) }],
      },
      {
        id: "student-4",
        name: "Kelewele Combo",
        description: "Chicken with Kelewele.",
        imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-student-4", label: "Standard", price: GHS(45) }],
      },
      {
        id: "student-5",
        name: "Fried Chicken",
        description: "Two Fried Chicken with Fried Rice / Plain Rice / Curry Rice & Coke.",
        imageUrl: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-student-5", label: "Standard", price: GHS(50) }],
      },
      {
        id: "student-6",
        name: "Yam Chips",
        description: "Fried Chicken with Yam Chips & Water.",
        imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-student-6", label: "Standard", price: GHS(45) }],
      },
      {
        id: "student-7",
        name: "TGIF Loaded Box",
        description: "Chicken with Rice, Kelewele & Drink.",
        imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-student-7", label: "Standard", price: GHS(45) }],
      },
      {
        id: "student-8",
        name: "Check-Check",
        description: "Fried Chicken with Check-Check.",
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-student-8", label: "Standard", price: GHS(35) }],
      },
    ],
  },
  {
    id: "cat-snacks",
    name: "Snacks & Fast Foods",
    sortOrder: 4,
    items: [
      {
        id: "snack-1",
        name: "Chicken - Sausage Shawarma",
        description: "Grilled chicken and sausage wrapped in a tortilla with fresh vegetables and sauce.",
        imageUrl: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-snack-1-reg", label: "Regular", price: GHS(50) },
          { id: "v-snack-1-lrg", label: "Large", price: GHS(80) },
        ],
      },
      {
        id: "snack-2",
        name: "Chicken Burger",
        description: "Juicy chicken burger with fresh vegetables and sauce.",
        imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-snack-2-sgl", label: "Single", price: GHS(60) },
          { id: "v-snack-2-dbl", label: "Double", price: GHS(90) },
        ],
      },
      {
        id: "snack-3",
        name: "Beef Shawarma",
        description: "Seasoned beef wrapped with fresh vegetables and sauce.",
        imageUrl: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-snack-3-reg", label: "Regular", price: GHS(60) },
          { id: "v-snack-3-lrg", label: "Large", price: GHS(90) },
        ],
      },
      {
        id: "snack-4",
        name: "Beef Burger",
        description: "Grilled beef patty with fresh vegetables and sauce.",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-snack-4-sgl", label: "Single", price: GHS(70) },
          { id: "v-snack-4-dbl", label: "Double", price: GHS(90) },
        ],
      },
      {
        id: "snack-5",
        name: "Pizza - Chicken/Sausage",
        description: "Cheesy pizza topped with chicken and sausage.",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-snack-5-med", label: "Medium", price: GHS(100) },
          { id: "v-snack-5-lrg", label: "Large", price: GHS(150) },
        ],
      },
      {
        id: "snack-6",
        name: "Cheeseburger",
        description: "Beef burger layered with melted cheese and fresh toppings.",
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-snack-6-sgl", label: "Single", price: GHS(100) },
          { id: "v-snack-6-dbl", label: "Double", price: GHS(120) },
        ],
      },
      {
        id: "snack-7",
        name: "Pizza - Beef",
        description: "Rich, cheesy pizza topped with seasoned beef.",
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-snack-7-med", label: "Medium", price: GHS(120) },
          { id: "v-snack-7-lrg", label: "Large", price: GHS(180) },
        ],
      },
    ],
  },
  {
    id: "cat-smoothies",
    name: "Smoothies",
    sortOrder: 5,
    items: [
      {
        id: "sm-1",
        name: "Pineapple",
        description: "Fresh pineapple smoothie.",
        imageUrl: "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-sm-1-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-1-500", label: "500ml", price: GHS(50) },
        ],
      },
      {
        id: "sm-2",
        name: "Banana",
        description: "Creamy banana smoothie.",
        imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-sm-2-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-2-500", label: "500ml", price: GHS(50) },
        ],
      },
      {
        id: "sm-3",
        name: "Mango",
        description: "Fresh mango smoothie.",
        imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-sm-3-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-3-500", label: "500ml", price: GHS(50) },
        ],
      },
      {
        id: "sm-4",
        name: "Strawberry",
        description: "Fresh strawberry smoothie.",
        imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-sm-4-250", label: "250ml", price: GHS(40) },
          { id: "v-sm-4-500", label: "500ml", price: GHS(80) },
        ],
      },
      {
        id: "sm-5",
        name: "Tropical Twist",
        description: "Pineapple + Mango.",
        imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-sm-5-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-5-500", label: "500ml", price: GHS(50) },
        ],
      },
      {
        id: "sm-6",
        name: "Pink Tropical",
        description: "Strawberry + Pineapple.",
        imageUrl: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-sm-6-250", label: "250ml", price: GHS(40) },
          { id: "v-sm-6-500", label: "500ml", price: GHS(80) },
        ],
      },
      {
        id: "sm-7",
        name: "Banana Berry",
        description: "Banana + Strawberry.",
        imageUrl: "https://images.unsplash.com/photo-1638176066666-ffb2f5c22502?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-sm-7-250", label: "250ml", price: GHS(40) },
          { id: "v-sm-7-500", label: "500ml", price: GHS(80) },
        ],
      },
      {
        id: "sm-8",
        name: "Mango Banana",
        description: "Mango + Banana.",
        imageUrl: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-sm-8-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-8-500", label: "500ml", price: GHS(50) },
        ],
      },
      {
        id: "sm-9",
        name: "Energy Blend",
        description: "Banana + Milk + Peanut Butter.",
        imageUrl: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-sm-9-250", label: "250ml", price: GHS(35) },
          { id: "v-sm-9-500", label: "500ml", price: GHS(70) },
        ],
      },
      {
        id: "sm-10",
        name: "Fresh Green",
        description: "Pineapple + Cucumber + Ginger.",
        imageUrl: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&auto=format&fit=crop&q=80",
        variants: [
          { id: "v-sm-10-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-10-500", label: "500ml", price: GHS(50) },
        ],
      },
    ],
  },
  {
    id: "cat-specials",
    name: "Specials",
    sortOrder: 6,
    items: [
      {
        id: "spec-1",
        name: "Fish, Egg and Wele with Waakye",
        description: "Special Waakye with fish, egg and wele.",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        availableDays: [DayOfWeek.TUESDAY],
        variants: [{ id: "v-spec-1", label: "Standard", price: GHS(60) }],
      },
      {
        id: "spec-2",
        name: "Beef, Chicken and Fish with Waakye",
        description: "Loaded Waakye with beef, chicken and fish.",
        imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80",
        availableDays: [DayOfWeek.TUESDAY],
        variants: [{ id: "v-spec-2", label: "Standard", price: GHS(80) }],
      },
      {
        id: "spec-3",
        name: "Loaded Angwamo",
        description: "Rich and flavourful loaded Angwamo.",
        imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
        availableDays: [DayOfWeek.TUESDAY],
        variants: [{ id: "v-spec-3", label: "Standard", price: GHS(80) }],
      },
      {
        id: "spec-4",
        name: "Kontomire Stew with Yam",
        description: "Fresh kontomire stew served with yam.",
        imageUrl: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&auto=format&fit=crop&q=80",
        availableDays: [DayOfWeek.THURSDAY],
        variants: [{ id: "v-spec-4", label: "Standard", price: GHS(70) }],
      },
      {
        id: "spec-5",
        name: "Egg Stew with Yam",
        description: "Delicious egg stew served with yam.",
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
        availableDays: [DayOfWeek.THURSDAY],
        variants: [{ id: "v-spec-5", label: "Standard", price: GHS(60) }],
      },
      {
        id: "spec-6",
        name: "Agushi Stew with Yam",
        description: "Tasty agushi stew served with yam.",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        availableDays: [DayOfWeek.THURSDAY],
        variants: [{ id: "v-spec-6", label: "Standard", price: GHS(80) }],
      },
    ],
  },
  {
    id: "cat-extras",
    name: "Extras",
    sortOrder: 7,
    items: [
      {
        id: "ext-1",
        name: "Fried Egg",
        description: "Add a fried egg to your meal.",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-ext-1", label: "Standard", price: GHS(20) }],
      },
      {
        id: "ext-2",
        name: "Salad",
        description: "Fresh salad.",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-ext-2", label: "Standard", price: GHS(50) }],
      },
      {
        id: "ext-3",
        name: "Chicken",
        description: "Add chicken to your meal.",
        imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-ext-3", label: "Standard", price: GHS(20) }],
      },
      {
        id: "ext-4",
        name: "Pork",
        description: "Add pork to your meal.",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-ext-4", label: "Standard", price: GHS(50) }],
      },
      {
        id: "ext-5",
        name: "Tilapia",
        description: "Add tilapia to your meal.",
        imageUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
        variants: [{ id: "v-ext-5", label: "Standard", price: GHS(50) }],
      },
    ],
  },
];

export function getStaticMenu(now: Date = new Date()): CategoryDTO[] {
  return RAW_MENU.map((cat) => ({
    id: cat.id,
    name: cat.name,
    sortOrder: cat.sortOrder,
    items: cat.items.map((item): MenuItemDTO => {
      const days = item.availableDays ?? [];
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        categoryId: cat.id,
        categoryName: cat.name,
        variants: item.variants,
        availableDays: days,
        isAvailableToday: isItemAvailableToday(days, now),
        isActive: true,
        imageUrl: item.imageUrl,
      };
    }),
  }));
}

export function findStaticVariant(
  variantId: string
): { variantId: string; price: number; name: string; label: string } | null {
  for (const cat of RAW_MENU) {
    for (const item of cat.items) {
      for (const variant of item.variants) {
        if (variant.id === variantId) {
          return {
            variantId: variant.id,
            price: variant.price,
            name: item.name,
            label: variant.label,
          };
        }
      }
    }
  }
  return null;
}

export function findStaticItemImage(name: string): string | undefined {
  for (const cat of RAW_MENU) {
    for (const item of cat.items) {
      if (item.name.toLowerCase() === name.toLowerCase()) {
        return item.imageUrl;
      }
    }
  }
  return undefined;
}
