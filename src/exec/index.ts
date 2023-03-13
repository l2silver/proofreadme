import * as childProcess from 'child_process';

const ignoreRegex = /@prm-ignore/;

export function cleanCommand(command: string){
  let skipNextLine = false;
  return command.split('\n').reduce((acc: string[], line: string)=>{
    if(ignoreRegex.test(line)){
      skipNextLine = true;
      return acc;
    }
    if(!skipNextLine && line.trim()){
      acc.push(line)
    }
    if(skipNextLine){
      skipNextLine = false
    }
    return acc
  }, []).join('\n')
}
//@
export const childProcessPromise = (code: string)=>{
  return new Promise<void>((res, rej)=>{
    childProcess.exec(code, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        rej(error)
      }
      res()
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
  })
}

export default function exec(commands: string[]){
  return commands.reduce((acc, command)=>{
    return acc.then(()=>{
      return childProcessPromise(cleanCommand(command))
    })
  }, Promise.resolve())
}