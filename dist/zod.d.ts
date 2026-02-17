import z from "zod";
declare const userParse: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
type userzodtype = z.infer<typeof userParse>;
export { userParse, type userzodtype };
//# sourceMappingURL=zod.d.ts.map