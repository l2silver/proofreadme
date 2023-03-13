import { cleanCommand } from '.';
describe('exec', ()=>{
  it('cleanCommand', ()=>{
    const cc = cleanCommand(
`
Do one thing
Do another thing
# @prm-ignore
Do a third thing
`
    )
    expect(cc).toEqual(
`Do one thing
Do another thing`
      )
  })
})