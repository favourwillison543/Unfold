import z from "zod";

export const CreateAccountSchema = z.object({
  name: z.string().min(2, "Name is required"),

  email: z.email("Put a valid email"),

  password: z
    .string()
    .min(8, "Password should be at least 8 characters"),
});

export const LoginSchema = z.object({
  email: z.email("Put a valid email"),

  password: z
    .string()
    .min(8, "Password should be at least 8 characters"),
});

export type CreateAccountFormData = z.infer<
  typeof CreateAccountSchema
>;

export type LoginFormData = z.infer<typeof LoginSchema>;