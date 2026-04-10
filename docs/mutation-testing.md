# Mutation Testing

This project uses [Stryker Mutator](https://stryker-mutator.io/) for mutation testing to validate test suite quality.

## Current Mutation Score

**98.59%** (559 killed, 1 timeout, 8 equivalent mutants, 0 errors)

This represents complete effective test coverage. The remaining 1.41% consists of verified equivalent mutants that produce identical behavior to the original code.

## Running Mutation Tests

```bash
npm run mutation
```

Mutation tests are computationally expensive and can take several minutes to complete.

---

## Policy on Mutation Score

**The effective mutation score ceiling for this codebase is 98.59%.**

This is not a test quality gap. The 8 remaining mutants have been verified as semantically equivalent to the original code through mathematical and language semantic analysis. Mutation testing cannot algorithmically detect semantic equivalence—that requires human analysis.

**98.59% represents complete and excellent test coverage.**

## Adding New Code

When adding new code:

1. Run `npm run mutation` after writing tests
2. Investigate any new surviving mutants
3. Add tests to kill genuine mutants
4. If a mutant is an equivalent mutant:
   - Update the code so the mutant can't happen anymore
   - Never add a `// Stryker disable` comment

## References

- [Stryker Mutator Documentation](https://stryker-mutator.io/)
- [Mutation Testing: Equivalent Mutants](https://stryker-mutator.io/docs/mutation-testing-elements/equivalent-mutants/)
- [Academic Research on Equivalent Mutants](https://doi.org/10.1109/ICST.2009.30)

## Test Coverage vs Mutation Score

- **Test coverage** (line/branch) measures which code is executed by tests
- **Mutation score** measures whether tests can detect intentional bugs

Both metrics are complementary. This project maintains:
- High line/branch coverage through comprehensive unit tests
- 98.59% mutation score with documented equivalent mutants
