import parse, { isTagBiggerThanOrEqualLevel } from '.';
describe('parse', ()=>{
  it('should find all code segments', ()=>{
    const code = parse(
`
# Welcome
\`\`\`
# This is some code
echo Hello
\`\`\`
\`\`\`Hello\`\`\`
`,
  {
    headers: ['# Welcome']
  }
    )
  expect(code).toEqual([ '# This is some code\necho Hello\n', 'Hello' ])
  })
  it('should capture complex examples', ()=>{
    const code = parse(
      `
# Welcome
### Setup
\`\`\`
# This is some code
echo Hello
\`\`\`
\`\`\`Hello\`\`\`
## Introduction
\`\`\`Hello again\`\`\`
`,
    {
      headers: ['### Setup']
    }
      )
    expect(code).toEqual([ '# This is some code\necho Hello\n', 'Hello' ])
  })
  it('should capture complex examples2', ()=>{
    const code = parse(
      `
# Welcome
### Setup
\`\`\`
# This is some code
echo Hello
\`\`\`
\`\`\`Hello\`\`\`
### Introduction
\`\`\`Hello again\`\`\`
`,
    {
      headers: ['### Setup']
    }
      )
    expect(code).toEqual([ '# This is some code\necho Hello\n', 'Hello' ])
  })
})

describe('isTagBiggerThanLevel', ()=>{
  it('all cases', ()=>{
    expect(isTagBiggerThanOrEqualLevel('h1', 2)).toBe(true)
    expect(isTagBiggerThanOrEqualLevel('h3', 2)).toBe(false)
    expect(isTagBiggerThanOrEqualLevel('h3', 3)).toBe(true)
  })
})