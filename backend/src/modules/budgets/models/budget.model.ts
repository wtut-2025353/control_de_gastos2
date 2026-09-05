import { Schema, model, type InferSchemaType } from "mongoose";

const budgetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      required: true,
      enum: ["alimentos", "transporte", "hogar", "entretenimiento", "salud", "educacion", "otros"]
    },
    amount: { type: Number, required: true, min: 0 },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true }
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, month: 1, year: 1 });

export type BudgetDoc = InferSchemaType<typeof budgetSchema>;
export const Budget = model("Budget", budgetSchema);
