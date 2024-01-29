import { Factory } from "fishery";

/**
 * Define a new mock factory. This will return the Fishery factory's `build`
 * function.
 */
export function define<T>(...args: Parameters<typeof Factory.define<T>>) {
  const factory = Factory.define<T>(...args);
  return factory.build.bind(factory);
}
