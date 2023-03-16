import { exec } from "child_process"

jest.setTimeout(10000)
describe('root', ()=>{
  it('fails for lack of headers argument', (done)=>{
    exec('npx ts-node src/index.ts', (error, stdout, stderr)=>{
      if(error){
        console.log('stderr', stderr)
        console.log('error.message', error.message)
        if(/Missing required argument --headers/.test(error.message)){
          return done()
        }
        throw error
      }
      console.log('stdout', stdout)
    })
  })
  it('fails when it cannot find readme file', (done)=>{
    exec('npx ts-node src/index.ts -p tests/README-DNE.md --headers "# Setup"', (error, stdout, stderr)=>{
      if(error){
        console.log('stderr', stderr)
        console.log('error.message', error.message)
        if(/Your readme file does not exist in the location you set: tests\/README-DNE.md/.test(error.message)){
          return done()
        }
        throw error
      }
      console.log('stdout', stdout)
    })
  })
  it('succeeds', (done)=>{
    exec('npx ts-node src/index.ts -p tests/README-long.md --headers "# Setup"', (error, stdout, stderr)=>{
      console.log('stdout', stdout);
      if(error){
        console.log('stderr', stderr)
        console.log('error.message', error.message)
        throw error
      }
      return done()
    })
  })
})