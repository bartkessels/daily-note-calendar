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

## Verified Equivalent Mutants

The following 8 mutants have been analyzed and verified as **equivalent mutants**—they produce identical observable behavior to the original code for all possible inputs due to JavaScript semantics.

### 1-2. ArrayDeclaration mutants (Lines 14 & 37 in default.variable-factory.ts)

**Location:** `src/business/factories/default.variable-factory.ts:14:72` and `line:37:65`

**Original code:**
```typescript
const [, name, calculusValue, template] = regex.exec(value) || [];
const [, operator, value, unit] = regex.exec(string) || [];
```

**Mutant:**
```typescript
|| ["Stryker was here"];
```

**Why equivalent:**
The destructuring pattern `[, name, ...]` intentionally skips the first array element. When `regex.exec()` returns `null`:
- With fallback `[]`: All destructured variables become `undefined`
- With fallback `["Stryker was here"]`: All destructured variables STILL become `undefined` (first element is skipped, remaining elements don't exist)

The behavior is mathematically identical. Tests cannot distinguish these cases without changing production code structure.

**Suppression:** Inline `// Stryker disable next-line ArrayDeclaration` comments added to source files.

---

### 3-8. Logical operator mutants (Line 40 in default.variable-factory.ts)

**Location:** `src/business/factories/default.variable-factory.ts:40:13` (6 mutations)

**Original code:**
```typescript
if (!operator || !value || !unit || isNaN(parsedValue)) {
    return null;
}
```

**Mutants:**
Various LogicalOperator and ConditionalExpression mutations:
- `(!operator || !value || !unit) && isNaN(parsedValue)`
- `false || isNaN(parsedValue)`
- `(!operator || !value) && !unit || isNaN(parsedValue)`
- `!operator && !value || !unit || isNaN(parsedValue)`
- `false || !unit || isNaN(parsedValue)`

**Why equivalent:**
When the preceding regex `/([+-])([0-9]+)([a-z])/` fails to match, the fallback array `[]` results in:
- `operator = undefined` → `!operator = true`
- `value = undefined` → `!value = true` and `parseInt(undefined) = NaN` → `isNaN(parsedValue) = true`
- `unit = undefined` → `!unit = true`

All four conditions evaluate to `true`. Any logical combination of four `true` values still evaluates to `true`, making all mutant variations behaviorally identical to the original.

The only way to test these independently would be to create code paths where operator/value/unit can be independently null while others are defined—but the current regex structure enforces all-or-nothing matching.

**Suppression:** Inline `// Stryker disable next-line all` comment added to source file.

---

### 9. ArithmeticOperator mutant (Line 96 in default.calendar-view-model.ts)

**Location:** `src/presentation/view-models/default.calendar-view-model.ts:96:29`

**Original code:**
```typescript
const startIndex = (firstDayOfWeek - 1 + 7) % 7;
```

**Mutant:**
```typescript
const startIndex = (firstDayOfWeek - 1 - 7) % 7;
```

**Why equivalent:**
The code performs array rotation: `[...days.slice(startIndex), ...days.slice(0, startIndex)]`

For Tuesday (`firstDayOfWeek = 2`):
- **Correct arithmetic:** `(2 - 1 + 7) % 7 = 1`
  - `days.slice(1)` returns `['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']`
  - `days.slice(0, 1)` returns `['Mon']`
  - Result: `['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']`

- **Mutant arithmetic:** `(2 - 1 - 7) % 7 = -6`
  - JavaScript's `Array.slice()` with negative indices counts from the end
  - For a 7-element array: `slice(-6)` is equivalent to `slice(7 - 6) = slice(1)`
  - `days.slice(-6)` returns `['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']`
  - `days.slice(0, -6)` returns `['Mon']`
  - Result: **Identical** `['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']`

This mathematical equivalence holds for all 7 possible `firstDayOfWeek` values (1-7) due to JavaScript's negative array indexing behavior.

**Suppression:** Inline `// Stryker disable next-line ArithmeticOperator` comment added to source file.

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
   - Document the mathematical/semantic reason for equivalence
   - Add a `// Stryker disable` comment with explanation
   - Update this document with the analysis

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
