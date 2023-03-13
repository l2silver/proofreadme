
import parse from '../parse';
import exec from '../exec';
import getOptions from '../options';
import getReadme from '../readme';

export default async function main(proc: any){
  const options = getOptions(proc.argv);
  const readme = getReadme(options.readmePath);
  // @ts-expect-error
  const codes = parse(readme, options);
  await exec(codes);
  console.log('README.md processed without errors.')
}
