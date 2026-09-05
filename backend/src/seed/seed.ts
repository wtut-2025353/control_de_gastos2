import bcrypt from "bcryptjs";
import { User } from "../modules/users/models/user.model.js";
import { Income } from "../modules/incomes/models/income.model.js";
import { Expense } from "../modules/expenses/models/expense.model.js";
import { Budget } from "../modules/budgets/models/budget.model.js";

const DEFAULT_USERS: Array<{
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}> = [
  {
    name: "Administrador",
    email: "admin@controlgastos.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Usuario Normal",
    email: "user@controlgastos.com",
    password: "user123",
    role: "user"
  }
];

export async function seedDefaultUsers(): Promise<void> {
  for (const data of DEFAULT_USERS) {
    const exists = await User.findOne({ email: data.email });
    if (exists) continue;
    const hashed = await bcrypt.hash(data.password, 10);
    await User.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role
    });
    console.log(`[seed] Usuario por defecto creado: ${data.email} (${data.role})`);
  }
}

const USER_FINANCIAL_DATA: Record<string, {
  incomes: Array<{ description: string; amount: number; category: string; monthsAgo: number }>;
  expenses: Array<{ description: string; amount: number; category: string; monthsAgo: number }>;
  budgets: Array<{ category: string; amount: number }>;
}> = {
  "user@controlgastos.com": {
    incomes: [
      { description: "Salario mensual", amount: 8500, category: "salario", monthsAgo: 0 },
      { description: "Freelance diseno", amount: 2000, category: "freelance", monthsAgo: 0 },
      { description: "Salario mensual", amount: 8500, category: "salario", monthsAgo: 1 },
      { description: "Venta de ropa", amount: 800, category: "otros", monthsAgo: 1 },
      { description: "Salario mensual", amount: 8500, category: "salario", monthsAgo: 2 },
      { description: "Freelance diseno", amount: 1500, category: "freelance", monthsAgo: 2 },
      { description: "Salario mensual", amount: 8500, category: "salario", monthsAgo: 3 },
      { description: "Salario mensual", amount: 8500, category: "salario", monthsAgo: 4 },
      { description: "Regalo", amount: 300, category: "regalos", monthsAgo: 4 },
      { description: "Salario mensual", amount: 8000, category: "salario", monthsAgo: 5 },
      { description: "Freelance app", amount: 2500, category: "freelance", monthsAgo: 5 }
    ],
    expenses: [
      { description: "Supermercado", amount: 1200, category: "alimentos", monthsAgo: 0 },
      { description: "Uber/Bus", amount: 350, category: "transporte", monthsAgo: 0 },
      { description: "Luz y agua", amount: 380, category: "hogar", monthsAgo: 0 },
      { description: "Netflix", amount: 120, category: "entretenimiento", monthsAgo: 0 },
      { description: "Supermercado", amount: 1100, category: "alimentos", monthsAgo: 1 },
      { description: "Gasolina", amount: 400, category: "transporte", monthsAgo: 1 },
      { description: "Alquiler", amount: 2000, category: "hogar", monthsAgo: 1 },
      { description: "Supermercado", amount: 1300, category: "alimentos", monthsAgo: 2 },
      { description: "Uber", amount: 300, category: "transporte", monthsAgo: 2 },
      { description: "Farmacia", amount: 250, category: "salud", monthsAgo: 2 },
      { description: "Supermercado", amount: 1150, category: "alimentos", monthsAgo: 3 },
      { description: "Mantenimiento moto", amount: 500, category: "transporte", monthsAgo: 3 },
      { description: "Curso udemy", amount: 100, category: "educacion", monthsAgo: 3 },
      { description: "Supermercado", amount: 1050, category: "alimentos", monthsAgo: 4 },
      { description: "Gasolina", amount: 380, category: "transporte", monthsAgo: 4 },
      { description: "Supermercado", amount: 1000, category: "alimentos", monthsAgo: 5 },
      { description: "Servicios basicos", amount: 350, category: "hogar", monthsAgo: 5 }
    ],
    budgets: [
      { category: "alimentos", amount: 1500 },
      { category: "transporte", amount: 500 },
      { category: "hogar", amount: 2500 },
      { category: "entretenimiento", amount: 200 },
      { category: "salud", amount: 300 },
      { category: "educacion", amount: 200 },
      { category: "otros", amount: 150 }
    ]
  },
  "admin@controlgastos.com": {
    incomes: [
      { description: "Salario mensual", amount: 15000, category: "salario", monthsAgo: 0 },
      { description: "Consultoria IT", amount: 5000, category: "freelance", monthsAgo: 0 },
      { description: "Dividendos inversiones", amount: 1200, category: "inversiones", monthsAgo: 0 },
      { description: "Salario mensual", amount: 15000, category: "salario", monthsAgo: 1 },
      { description: "Consultoria IT", amount: 4500, category: "freelance", monthsAgo: 1 },
      { description: "Salario mensual", amount: 15000, category: "salario", monthsAgo: 2 },
      { description: "Curso impartido", amount: 3000, category: "freelance", monthsAgo: 2 },
      { description: "Inversion fondos", amount: 800, category: "inversiones", monthsAgo: 2 },
      { description: "Salario mensual", amount: 15000, category: "salario", monthsAgo: 3 },
      { description: "Consultoria IT", amount: 6000, category: "freelance", monthsAgo: 3 },
      { description: "Salario mensual", amount: 15000, category: "salario", monthsAgo: 4 },
      { description: "Salario mensual", amount: 15000, category: "salario", monthsAgo: 5 },
      { description: "Regalo empresa", amount: 1000, category: "regalos", monthsAgo: 5 }
    ],
    expenses: [
      { description: "Supermercado premium", amount: 2200, category: "alimentos", monthsAgo: 0 },
      { description: "Gasolina SUV", amount: 900, category: "transporte", monthsAgo: 0 },
      { description: "Servicios casa", amount: 750, category: "hogar", monthsAgo: 0 },
      { description: "Restaurante fin de semana", amount: 600, category: "entretenimiento", monthsAgo: 0 },
      { description: "Supermercado", amount: 2000, category: "alimentos", monthsAgo: 1 },
      { description: "Mantenimiento auto", amount: 1200, category: "transporte", monthsAgo: 1 },
      { description: "Alquiler departamento", amount: 3500, category: "hogar", monthsAgo: 1 },
      { description: "Supermercado", amount: 2100, category: "alimentos", monthsAgo: 2 },
      { description: "Gasolina", amount: 850, category: "transporte", monthsAgo: 2 },
      { description: "Seguro medico familiar", amount: 1500, category: "salud", monthsAgo: 2 },
      { description: "Supermercado", amount: 1900, category: "alimentos", monthsAgo: 3 },
      { description: "Servicio tecnico auto", amount: 1800, category: "transporte", monthsAgo: 3 },
      { description: "Colegiatura hijos", amount: 2000, category: "educacion", monthsAgo: 3 },
      { description: "Supermercado", amount: 2050, category: "alimentos", monthsAgo: 4 },
      { description: "Gasolina", amount: 800, category: "transporte", monthsAgo: 4 },
      { description: "Vacaciones", amount: 4000, category: "entretenimiento", monthsAgo: 4 },
      { description: "Supermercado", amount: 1800, category: "alimentos", monthsAgo: 5 },
      { description: "Servicios basicos", amount: 650, category: "hogar", monthsAgo: 5 },
      { description: "Otros gastos", amount: 500, category: "otros", monthsAgo: 5 }
    ],
    budgets: [
      { category: "alimentos", amount: 2500 },
      { category: "transporte", amount: 1200 },
      { category: "hogar", amount: 4000 },
      { category: "entretenimiento", amount: 800 },
      { category: "salud", amount: 1500 },
      { category: "educacion", amount: 2500 },
      { category: "otros", amount: 600 }
    ]
  }
};

export async function seedFinancialData(): Promise<void> {
  const users = await User.find();
  for (const user of users) {
    const hasIncomes = await Income.findOne({ user: user._id });
    if (hasIncomes) continue;

    const userData = USER_FINANCIAL_DATA[user.email];
    if (!userData) continue;

    const now = new Date();
    const currentYear = now.getFullYear();

    for (const item of userData.incomes) {
      const date = new Date(currentYear, now.getMonth() - item.monthsAgo, 15);
      await Income.create({
        user: user._id,
        description: item.description,
        amount: item.amount,
        category: item.category as any,
        date
      });
    }

    for (const item of userData.expenses) {
      const date = new Date(currentYear, now.getMonth() - item.monthsAgo, 10);
      await Expense.create({
        user: user._id,
        description: item.description,
        amount: item.amount,
        category: item.category as any,
        date
      });
    }

    const currentMonth = now.getMonth() + 1;
    for (const item of userData.budgets) {
      await Budget.create({
        user: user._id,
        category: item.category as any,
        amount: item.amount,
        month: currentMonth,
        year: currentYear
      });
    }

    console.log(`[seed] Datos financieros creados para: ${user.email}`);
  }
}
