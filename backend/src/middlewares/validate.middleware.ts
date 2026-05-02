import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod/v3";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        messge: err.message,
      }));

      return res.status(400).json({
        message: "Validation Failed!",
        errors,
      });
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;

    next();
  };
