export type ClassnamesParams = Record<string, boolean>;

export const classnames = (
  ...params: (ClassnamesParams | string)[]
): string => {
  const classes = [];

  for (const param of params) {
    if (typeof param === "string") classes.push(param);

    if (typeof param === "object") {
      for (const key in param) {
        if (param[key]) classes.push(key);
      }
    }
  }

  return classes.join(" ");
};
