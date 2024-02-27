import { Factory } from "fishery";

/**
 * Define a new mock factory. This will return the Fishery factory's `build`
 * function.
 */
export function define<T, I = any>(
  ...args: Parameters<typeof Factory.define<T, I>>
) {
  const factory = Factory.define<T, I>(...args);

  return (
    attributes?: Parameters<typeof factory.build>[0],
    transient?: Parameters<typeof factory.transient>[0]
  ) => {
    return factory.build(attributes as Parameters<typeof factory.build>[0], {
      transient,
    });
  };
}
