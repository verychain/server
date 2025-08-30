import { Transform } from "class-transformer";

export function ArrayTransform() {
  return Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((v) => Number(v));
    }
    if (typeof value === "string") {
      return value.split(",").map((v) => Number(v.trim()));
    }
    return value;
  });
}
