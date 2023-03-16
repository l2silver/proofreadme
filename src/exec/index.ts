import * as childProcess from 'child_process';

const prmDirective = /@prm/;
const ignoreRegex = /@prm-ignore-(\d+)/;
const waitUntilRegexOutput = /@prm-wait-until-regex-output-\/(.*)\//
//TODO
// const threadRegex = /@prm-thread-([A-Za-z0-9-_]+)/;

//TODO
// const multiRegex = /@prm-multi-(\d+)/;

type $options = {async?: boolean, waitUntilRegex?: RegExp, final?: boolean}
type $context = {
  commands: {
    thread: string,
    command: string,
    options: $options
  }[],
  lastThread: string,
  finalCount: number,
}

export function parseCommand(command: string, context: $context){
  function addToThreads(commandLine: string, options = {}){
    context.commands.push({thread: context.lastThread, command: commandLine, options})
  }
  const commandLines = command.split('\n')
  for(let i = 0; i < commandLines.length; i++){
    const line = commandLines[i];
    if(!line || /^\s*$/.test(line)){
      continue;
    }
    if(prmDirective.test(line)){
      const ignoreRes = ignoreRegex.exec(line)
      if(ignoreRes){
        i=i+Number(ignoreRes[1])
        continue;
      }
      const options : $options = {}
      const waitUntilRegexOutputRes = waitUntilRegexOutput.exec(line)
      if(waitUntilRegexOutputRes){
        options.async = true;
        options.waitUntilRegex = new RegExp(`${waitUntilRegexOutputRes[1]}`)
      }
      
      if(waitUntilRegexOutputRes){
        const nextLine = commandLines[i+1];
        addToThreads(nextLine, options)
        i++
      }
      continue;
    }
    addToThreads(line)
  }
}
export const spawnPromise = (command: string, regexOutput: RegExp, signal: AbortSignal)=>{
  const [startCommand, ...commandArray] = command.split(' ')
  return new Promise<void>((res, rej)=>{
    const spawn = childProcess.spawn(startCommand, commandArray, {signal});
    spawn.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      if(regexOutput.test(data.toString())){
        res()
      }
    });
    spawn.on('error', (err) => {
      rej(err)
    });
    spawn.stderr.on('data', (data) => {
      rej(`stderr: ${data}`);
    });
  })
}

export const childProcessPromise = (code: string)=>{
  return new Promise<void>((res, rej)=>{
    childProcess.exec(code, (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`);
        rej(error)
      }
      console.log(`stdout: ${stdout}`);
      res()
    });
  })
}

export const getDefaultContext = () : $context =>{
  return {
    finalCount: 0,
    commands: [],
    lastThread: `${Math.random()}`,
  }
}

export default function exec(commands: string[]){
  const context = getDefaultContext()
  commands.forEach(command=>parseCommand(command, context))
  const ac = new AbortController();
  return context.commands.reduce((acc, command)=>{
    return acc.then(()=>{
      if(command.options.waitUntilRegex){
        return spawnPromise(command.command, command.options.waitUntilRegex, ac.signal)
      }
      return childProcessPromise(command.command)
    })
  }, Promise.resolve()).catch(e=>{
    ac.abort()
    throw e
  }).then(()=>ac.abort())
}