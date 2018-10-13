export function withSnapshot<T extends Function>(fn: T): T {
  // It seems impossible to type this cleanly so we typecast (func -> any -> T) so we don't ruin the users' types.
  // Luckily we aren't really doing any logic in there that has anything to do with the input or
  // output, so we don't really need the static typing.
  return (function(...args: any[]) {
    // Just telling Typescript that we know what we're doing by passing through an implicit any `this`
    // @ts-ignore
    return fn.call(this, ...args);
  } as any) as T;
}

// function recordFixture(args: any[]): void {
//   console.log(JSON.stringify(args));
// }
