const {test}=require('node:test');
const assert=require('node:assert/strict');
const {analyze}=require('../analyzer');
test('tokenizes keywords, identifiers, literals and operators',()=>{const r=analyze('int x = 4 + 2;');assert.deepEqual(r.tokens.map(t=>t.type),['KEYWORD','IDENTIFIER','OPERATOR','INT_LITERAL','OPERATOR','INT_LITERAL','PUNCTUATION']);assert.equal(r.ast.body[0].kind,'Declaration')});
test('parses nested blocks and conditions',()=>{const r=analyze('bool ok = true; if (ok) { print("yes"); }');assert.equal(r.ast.body[1].kind,'If');assert.equal(r.ast.body[1].then.kind,'Block');assert.equal(r.issues.length,0)});
test('reports lexical errors',()=>assert.ok(analyze('int x = @;').issues.some(x=>x.code==='L003')));
test('reports syntax errors with source locations',()=>{const r=analyze('int x = 2\nprint(x);');assert.equal(r.issues[0].code,'P001');assert.equal(r.issues[0].line,2)});
test('detects undeclared, duplicate and unused variables',()=>{const codes=analyze('int x; int x = 2; y = 1;').issues.map(x=>x.code);assert.ok(codes.includes('S005'));assert.ok(codes.includes('S001'));assert.ok(codes.includes('S009'))});
test('detects incompatible types and division by zero',()=>{const codes=analyze('string label = 2; int n = 5 / 0;').issues.map(x=>x.code);assert.ok(codes.includes('S006'));assert.ok(codes.includes('S004'))});
test('accepts clean declarations, expressions and print',()=>{const r=analyze('int n = 2; float f = n + 1.5; print(f);');assert.equal(r.issues.length,0)});

test('warns about uninitialized declarations',()=>{const r=analyze('int n; print(n);');assert.ok(r.issues.some(x=>x.code==='S007'))});

