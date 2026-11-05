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
        variants: [{ id: "v-rice-1", label: "Standard", price: GHS(80) }],
      },
      {
        id: "rice-2",
        name: "Assorted Jollof",
        description: "Classic Ghanaian jollof with rich flavour.",
        variants: [{ id: "v-rice-2", label: "Standard", price: GHS(80) }],
      },
      {
        id: "rice-3",
        name: "Chicken with Jollof",
        description: "Well seasoned chicken served with jollof.",
        variants: [{ id: "v-rice-3", label: "Standard", price: GHS(50) }],
      },
      {
        id: "rice-4",
        name: "Chicken with Fried Rice",
        description: "Well seasoned chicken served with fried rice.",
        variants: [{ id: "v-rice-4", label: "Standard", price: GHS(50) }],
      },
      {
        id: "rice-5",
        name: "Pork/Tilapia with Jollof or Fried Rice",
        description: "Choose between tasty pork or tilapia with jollof or fried rice.",
        variants: [{ id: "v-rice-5", label: "Standard", price: GHS(80) }],
      },
      {
        id: "rice-6",
        name: "Chicken Thigh with Fried Rice",
        description: "Juicy chicken thigh served with fried rice.",
        variants: [{ id: "v-rice-6", label: "Standard", price: GHS(70) }],
      },
      {
        id: "rice-7",
        name: "Chicken Thigh with Jollof",
        description: "Juicy chicken thigh served with jollof.",
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
        variants: [{ id: "v-loaded-1", label: "Standard", price: GHS(60) }],
      },
      {
        id: "loaded-2",
        name: "Loaded Fries (Jumbo)",
        description: "Fries loaded with your favourite toppings — jumbo size.",
        variants: [
          { id: "v-loaded-2-reg", label: "Regular", price: GHS(100) },
          { id: "v-loaded-2-lrg", label: "Large", price: GHS(150) },
        ],
      },
      {
        id: "loaded-3",
        name: "Loaded Fries",
        description: "Tasty fries with delicious toppings.",
        variants: [
          { id: "v-loaded-3-reg", label: "Regular", price: GHS(70) },
          { id: "v-loaded-3-lrg", label: "Large", price: GHS(80) },
        ],
      },
      {
        id: "loaded-4",
        name: "Gizzard/Chicken with Yam Chips",
        description: "Well seasoned gizzard or chicken served with yam chips.",
        variants: [{ id: "v-loaded-4", label: "Standard", price: GHS(60) }],
      },
      {
        id: "loaded-5",
        name: "Turkey with Yam Chips",
        description: "Tender turkey served with yam chips.",
        variants: [{ id: "v-loaded-5", label: "Standard", price: GHS(80) }],
      },
      {
        id: "loaded-6",
        name: "Pork with Yam Chips",
        description: "Juicy pork served with yam chips.",
        variants: [{ id: "v-loaded-6", label: "Standard", price: GHS(70) }],
      },
      {
        id: "loaded-7",
        name: "Assorted Noodles/Spaghetti",
        description: "Tasty noodles or spaghetti with rich flavour.",
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
        variants: [{ id: "v-student-1", label: "Standard", price: GHS(35) }],
      },
      {
        id: "student-2",
        name: "Rice Saver II",
        description: "Fried Chicken with Fried Rice / Plain Rice / Curry Rice.",
        variants: [{ id: "v-student-2", label: "Standard", price: GHS(35) }],
      },
      {
        id: "student-3",
        name: "Noodle/Spaghetti Saver",
        description: "Noodles or Spaghetti.",
        variants: [{ id: "v-student-3", label: "Standard", price: GHS(35) }],
      },
      {
        id: "student-4",
        name: "Kelewele Combo",
        description: "Chicken with Kelewele.",
        variants: [{ id: "v-student-4", label: "Standard", price: GHS(45) }],
      },
      {
        id: "student-5",
        name: "Fried Chicken",
        description: "Two Fried Chicken with Fried Rice / Plain Rice / Curry Rice & Coke.",
        variants: [{ id: "v-student-5", label: "Standard", price: GHS(50) }],
      },
      {
        id: "student-6",
        name: "Yam Chips",
        description: "Fried Chicken with Yam Chips & Water.",
        variants: [{ id: "v-student-6", label: "Standard", price: GHS(45) }],
      },
      {
        id: "student-7",
        name: "TGIF Loaded Box",
        description: "Chicken with Rice, Kelewele & Drink.",
        variants: [{ id: "v-student-7", label: "Standard", price: GHS(45) }],
      },
      {
        id: "student-8",
        name: "Check-Check",
        description: "Fried Chicken with Check-Check.",
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
        variants: [
          { id: "v-snack-1-reg", label: "Regular", price: GHS(50) },
          { id: "v-snack-1-lrg", label: "Large", price: GHS(80) },
        ],
      },
      {
        id: "snack-2",
        name: "Chicken Burger",
        description: "Juicy chicken burger with fresh vegetables and sauce.",
        variants: [
          { id: "v-snack-2-sgl", label: "Single", price: GHS(60) },
          { id: "v-snack-2-dbl", label: "Double", price: GHS(90) },
        ],
      },
      {
        id: "snack-3",
        name: "Beef Shawarma",
        description: "Seasoned beef wrapped with fresh vegetables and sauce.",
        variants: [
          { id: "v-snack-3-reg", label: "Regular", price: GHS(60) },
          { id: "v-snack-3-lrg", label: "Large", price: GHS(90) },
        ],
      },
      {
        id: "snack-4",
        name: "Beef Burger",
        description: "Grilled beef patty with fresh vegetables and sauce.",
        variants: [
          { id: "v-snack-4-sgl", label: "Single", price: GHS(70) },
          { id: "v-snack-4-dbl", label: "Double", price: GHS(90) },
        ],
      },
      {
        id: "snack-5",
        name: "Pizza - Chicken/Sausage",
        description: "Cheesy pizza topped with chicken and sausage.",
        variants: [
          { id: "v-snack-5-med", label: "Medium", price: GHS(100) },
          { id: "v-snack-5-lrg", label: "Large", price: GHS(150) },
        ],
      },
      {
        id: "snack-6",
        name: "Cheeseburger",
        description: "Beef burger layered with melted cheese and fresh toppings.",
        variants: [
          { id: "v-snack-6-sgl", label: "Single", price: GHS(100) },
          { id: "v-snack-6-dbl", label: "Double", price: GHS(120) },
        ],
      },
      {
        id: "snack-7",
        name: "Pizza - Beef",
        description: "Rich, cheesy pizza topped with seasoned beef.",
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
        variants: [
          { id: "v-sm-1-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-1-500", label: "500ml", price: GHS(50) },
        ],
      },
      {
        id: "sm-2",
        name: "Banana",
        description: "Creamy banana smoothie.",
        variants: [
          { id: "v-sm-2-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-2-500", label: "500ml", price: GHS(50) },
        ],
      },
      {
        id: "sm-3",
        name: "Mango",
        description: "Fresh mango smoothie.",
        variants: [
          { id: "v-sm-3-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-3-500", label: "500ml", price: GHS(50) },
        ],
      },
      {
        id: "sm-4",
        name: "Strawberry",
        description: "Fresh strawberry smoothie.",
        variants: [
          { id: "v-sm-4-250", label: "250ml", price: GHS(40) },
          { id: "v-sm-4-500", label: "500ml", price: GHS(80) },
        ],
      },
      {
        id: "sm-5",
        name: "Tropical Twist",
        description: "Pineapple + Mango.",
        variants: [
          { id: "v-sm-5-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-5-500", label: "500ml", price: GHS(50) },
        ],
      },
      {
        id: "sm-6",
        name: "Pink Tropical",
        description: "Strawberry + Pineapple.",
        variants: [
          { id: "v-sm-6-250", label: "250ml", price: GHS(40) },
          { id: "v-sm-6-500", label: "500ml", price: GHS(80) },
        ],
      },
      {
        id: "sm-7",
        name: "Banana Berry",
        description: "Banana + Strawberry.",
        variants: [
          { id: "v-sm-7-250", label: "250ml", price: GHS(40) },
          { id: "v-sm-7-500", label: "500ml", price: GHS(80) },
        ],
      },
      {
        id: "sm-8",
        name: "Mango Banana",
        description: "Mango + Banana.",
        variants: [
          { id: "v-sm-8-250", label: "250ml", price: GHS(30) },
          { id: "v-sm-8-500", label: "500ml", price: GHS(50) },
        ],
      },
      {
        id: "sm-9",
        name: "Energy Blend",
        description: "Banana + Milk + Peanut Butter.",
        variants: [
          { id: "v-sm-9-250", label: "250ml", price: GHS(35) },
          { id: "v-sm-9-500", label: "500ml", price: GHS(70) },
        ],
      },
      {
        id: "sm-10",
        name: "Fresh Green",
        description: "Pineapple + Cucumber + Ginger.",
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
        availableDays: [DayOfWeek.TUESDAY],
        variants: [{ id: "v-spec-1", label: "Standard", price: GHS(60) }],
      },
      {
        id: "spec-2",
        name: "Beef, Chicken and Fish with Waakye",
        description: "Loaded Waakye with beef, chicken and fish.",
        availableDays: [DayOfWeek.TUESDAY],
        variants: [{ id: "v-spec-2", label: "Standard", price: GHS(80) }],
      },
      {
        id: "spec-3",
        name: "Loaded Angwamo",
        description: "Rich and flavourful loaded Angwamo.",
        availableDays: [DayOfWeek.TUESDAY],
        variants: [{ id: "v-spec-3", label: "Standard", price: GHS(80) }],
      },
      {
        id: "spec-4",
        name: "Kontomire Stew with Yam",
        description: "Fresh kontomire stew served with yam.",
        availableDays: [DayOfWeek.THURSDAY],
        variants: [{ id: "v-spec-4", label: "Standard", price: GHS(70) }],
      },
      {
        id: "spec-5",
        name: "Egg Stew with Yam",
        description: "Delicious egg stew served with yam.",
        availableDays: [DayOfWeek.THURSDAY],
        variants: [{ id: "v-spec-5", label: "Standard", price: GHS(60) }],
      },
      {
        id: "spec-6",
        name: "Agushi Stew with Yam",
        description: "Tasty agushi stew served with yam.",
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
        variants: [{ id: "v-ext-1", label: "Standard", price: GHS(20) }],
      },
      {
        id: "ext-2",
        name: "Salad",
        description: "Fresh salad.",
        variants: [{ id: "v-ext-2", label: "Standard", price: GHS(50) }],
      },
      {
        id: "ext-3",
        name: "Chicken",
        description: "Add chicken to your meal.",
        variants: [{ id: "v-ext-3", label: "Standard", price: GHS(20) }],
      },
      {
        id: "ext-4",
        name: "Pork",
        description: "Add pork to your meal.",
        variants: [{ id: "v-ext-4", label: "Standard", price: GHS(50) }],
      },
      {
        id: "ext-5",
        name: "Tilapia",
        description: "Add tilapia to your meal.",
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
