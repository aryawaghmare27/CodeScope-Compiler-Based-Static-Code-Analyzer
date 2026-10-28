# CodeScope — Compiler-Based Static Code Analyzer

A beginner-friendly Compiler Construction mini project. CodeScope analyzes a small C-like language in the browser and explains the classic compiler front end: lexical analysis, recursive-descent syntax parsing, and semantic analysis.

## Run it

Open `index.html` in a modern browser. There is no build step, package installation, server, or network dependency (Google Fonts are optional; system fallbacks are used).

To run the automated checks, install Node.js 18 or newer and run from this folder:

```sh
node --test tests/analyzer.test.js
```

## Language supported

```text
int | float | bool | string variable [= expression] ;
variable = expression ;
print(expression);
if (bool-expression) statement [else statement]
while (bool-expression) statement
{ statement* }
```

Expressions include integer and decimal numbers, quoted strings, `true`/`false`, variable references, parentheses, unary `!` and `-`, arithmetic `+ - * / %`, comparisons, equality, and boolean `&& ||`. Line (`//`) and block (`/* ... */`) comments are supported. Every declaration, assignment, and print statement ends in a semicolon.

## Compiler pipeline

1. **Lexer:** scans characters into keyword, identifier, literal, operator, and punctuation tokens; reports invalid characters and unterminated comments or strings with locations.
2. **Parser:** recursive-descent parser builds an abstract syntax tree (AST) with precedence-aware expressions; reports the first syntax error and its location.
3. **Semantic analyzer:** checks declared names, duplicate declarations within a scope, assignment compatibility, boolean conditions, operator types, unused and uninitialized variables, and literal division by zero.
4. **UI:** shows issues, the token stream, and an indented syntax tree. Samples and Ctrl/Cmd+Enter are provided.

## Project layout

- `index.html`, `styles.css`, `app.js` — responsive user interface and browser interactions
- `analyzer.js` — standalone compiler implementation
- `samples/` — clean, semantic-issues, and syntax-error source examples
- `tests/analyzer.test.js` — Node built-in test suite; no third-party test library

## Limitations

This is a teaching language, not full C. It does not support functions, arrays, input, implicit casts except assigning `int` to `float`, or multi-error parser recovery. The analyzer runs locally in your browser and does not execute the source program.
