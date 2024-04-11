export function rulesMock(flow: string, { executedRules = [] }: { executedRules?: string[] } = {}) {
  const build = <T>(api: T) => ({
    wasExecuted: (ruleId: string) => {
      return executedRules.includes(ruleId);
    },
  });

  return { build };
}
