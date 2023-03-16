import parse, { isTagBiggerThanOrEqualLevel } from '.';
describe('parse', ()=>{
  it('should error out if header does not exist', (done)=>{
    try {
      parse(
        `
        # Welcome
        \`\`\`
        # This is some code
        echo Hello
        \`\`\`
        \`\`\`Hello\`\`\`
        `,
        {
          headers: ['# Welc ome']
        }
        )
      } catch(e: any){
        console.log('error', e)
        if(/Header # Welc ome does not exist in readme file/.test(e.message)){
          return done()
        }
        throw e;
      }
  })
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