import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  updateUser: protectedProcedure
    .input(z.object({ name: z.string().max(100).optional() }))
    .mutation(async (opts) => {
      const user = await opts.ctx.db.user.findUnique({
        where: { id: opts.ctx.session.user.id },
      });
      if (!user) {
        throw new TRPCError({ message: "User not found!", code: "NOT_FOUND" });
      }
      try {
        const updatedUser = await opts.ctx.db.user.update({
          where: { id: user.id },
          data: {
            ...(opts.input.name ? { name: opts.input.name } : {}),
          },
        });
        return updatedUser;
      } catch (err: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message ?? "Something went wrong!",
        });
      }
    }),
  deleteUser: protectedProcedure.mutation(async (opts) => {
    const user = await opts.ctx.db.user.findUnique({
      where: { id: opts.ctx.session.user.id },
    });
    if (!user) {
      throw new TRPCError({ message: "User not found!", code: "NOT_FOUND" });
    }
    const orgs = await opts.ctx.db.organizationMembership.findMany({
      where: { userId: user.id, role: "OWNER" },
    });
    if (orgs.length > 0) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "You are an owner of one or more organizations. Please transfer ownership or delete those organizations before you delete your account.",
      });
    }
    try {
      const deletedUser = await opts.ctx.db.user.delete({
        where: { id: user.id },
      });
      return deletedUser;
    } catch (err: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: err.message ?? "Something went wrong!",
      });
    }
  }),
});
