import getOptions from '.';
describe('options', ()=>{
  it('get headers', ()=>{
    const options = getOptions(['proofreadme', '-h', '# Intro', '### Setup'])
    expect(options.headers).toEqual(['# Intro', '### Setup'])
  })
})