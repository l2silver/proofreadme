import fs from 'fs';

export default function getReadme(readmePath: string){
  let readme;
  if(readmePath){
    try {
      readme = fs.readFileSync(readmePath, 'utf8');
    } catch(err) {
      console.error('Your readme file does not exist in the location you set: ', readmePath)
      throw Error(`Your readme file does not exist in the location you set: ${readmePath}`)
    }
  } else {
    if (fs.existsSync('README.md')) {
      readme = fs.readFileSync('README.md', 'utf8');
    }
    if (fs.existsSync('readme.md')) {
      readme = fs.readFileSync('readme.md', 'utf8');
    }
    if (fs.existsSync('Readme.md')) {
      readme = fs.readFileSync('Readme.md', 'utf8');
    }
    if (fs.existsSync('ReadMe.md')) {
      readme = fs.readFileSync('ReadMe.md', 'utf8');
    }
    throw Error('Your readme file does not exist where you ran proofreadme. Please specify its location using the --readme-path option.')
  }
  return readme;
}