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
    console.log(getCallerFile());
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
}

type prepareStackTrace = (err: Error, stack: CallSite[]) => string;

/**
 * This is a partial type with the methods we use on CallSite.
 * CallSite is not a public API and specific to V8. It is exposed
 * in the also non-public API Error.prepareStackTrace(err: Error, stack: CallSite[])
 */
type CallSite = {
  getColumnNumber: () => string;
  getFileName: () => string;
  getFunctionName: () => string;
  getLineNumber: () => string;
  getMethodName: () => string;
  getPosition: () => string;
};

interface CustomError extends Error {
  callSitesStack?: CallSite[];
}

/**
 * Inspired by https://stackoverflow.com/a/29581862
 * but altered and expanded on by us. Note that all this takes advantage
 * of private APIs that aren't published anywhere that are specific
 * to the V8 engine so it is fragile and we should have proper tests
 * for different node versions and be clear about which node versions
 * we support
 */
function getCallerFile() {
  const originalFunc = (Error as any).prepareStackTrace as prepareStackTrace;

  try {
    const err: CustomError = new Error();
    let currentfile;

    (Error as any).prepareStackTrace = function(err: CustomError, stack) {
      err.callSitesStack = stack;
      return originalFunc(err, stack);
    } as prepareStackTrace;

    err.stack = err.stack as CallSite[];

    // We trust the stackOverflow answer
    // @ts-ignore
    currentfile = err.stack.shift().getFileName();

    // We trust the stackOverflow answer
    // @ts-ignore
    while (err.stack.length) {
      // We trust the stackOverflow answer
      // @ts-ignore
      callerfile = err.stack.shift().getFileName();

      if (currentfile !== callerfile) break;
    }
  } catch (e) {}

  // We trust the stackOverflow answer
  // @ts-ignore
  Error.prepareStackTrace = originalFunc;

  return callerfile;
}
