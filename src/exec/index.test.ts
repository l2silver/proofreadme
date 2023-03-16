import exec, { parseCommand, spawnPromise } from '.';
describe('exec', ()=>{
  describe('exec', ()=>{
    it('succeeds', (done)=>{
      exec([
`
ls
echo Hello
# @prm-wait-until-regex-output-/Accepting connections/
npx serve ./
`,
`echo Goodbye`
      ]).then(done)
    })
    it('fails', (done)=>{
      exec([
`
ls
echo Hello
# @prm-wait-until-regex-output-/Accepting connections/
npx serve ./
`,
`exit 1`
      ]).catch(()=>{
        done()
      })
    })
  })
  describe('spawnPromise', ()=>{
    it('promise should not timeout', (done)=>{
      const ac = new AbortController();
      spawnPromise('npx serve ./', new RegExp('Accepting connections'), ac.signal).then(()=>{
        ac.abort();
        done();
      });
      
    })
  })
  describe('parseCommand', ()=>{
    describe('@prm-ignore', ()=>{
      it('ignores 1 line', ()=>{
        const context = {
          commands: [],
          lastThread: `${Math.random()}`,
          finalCount: 0,
        };
        parseCommand(
`
Do one thing
Do another thing
# @prm-ignore-1
Do a third thing
`, context)
        expect(context.commands).toEqual([{thread: context.lastThread, command: 'Do one thing', options: {}}, {command: 'Do another thing', thread: context.lastThread, options: {}}])
      });
    })
    describe('@prm-wait-util-output-regex', ()=>{
      it('waits until output regex before continueing', ()=>{
        const random = `${Math.random()}`
        const context = {
          commands: [],
          lastThread: random,
          finalCount: 0,
        };
        parseCommand(
`
Do one thing
Do another thing
# @prm-wait-until-regex-output-/something/
Do a third thing
`,
    context)
        expect(context.commands).toEqual([{thread: random, command: 'Do one thing', options: {}}, {command: 'Do another thing', thread: random, options: {}}, {command: "Do a third thing", thread: random, options: {async:true, waitUntilRegex: new RegExp('something')}}])
      })
    })
  })
})