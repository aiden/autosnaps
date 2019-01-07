import { core as storeSnapshot } from 'snap-shot-core';
/**
 * The main feature of Autosnaps, call this on the function you want
 * to snapshot test and use the function withSnapshot outputs as a substitute.
 * This will allow Autosnaps to automatically record fixtures for you that can
 * later be snapshot tested with
 */
export function withSnapshot<T extends Function>(fn: T): T {
  // It seems impossible to type this cleanly so we typecast (func -> any -> T) so we don't ruin the users' types.
  // Luckily we aren't really doing any logic in there that has anything to do with the input or
  // output, so we don't really need the static typing.
  return (function(...args: any[]) {
    recordFixture(args);
    // Just telling Typescript that we know what we're doing by passing through an implicit any `this`
    // @ts-ignore
    return fn.call(this, ...args);
  } as any) as T;
}

function recordFixture(args: any[]): void {
  storeSnapshot({
    args,
  });
  console.log(JSON.stringify(args));
}
