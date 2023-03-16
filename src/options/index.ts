import { program } from 'commander';

export default function getOptions(argv: string[]){
  program
  .option('-p, --readme-path [char]', 'The path to the readme file')
  .option('-h, --headers <string...>', 'The header sections to process separated by spaces. ie. -h "# Setup ## Rules"')
  // TODO
  // .option('-i, --ignore-headers <string...>', 'The header sections to ignore. ie. -i "## ignoreable section"')
  program.parse(['empty'].concat(argv));
  const options = program.opts();
  if(!options.headers){
    throw Error('Missing required argument --headers <string...>')
  }
  return options;
}