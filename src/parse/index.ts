import { marked } from 'marked';
import html from 'node-html-parser';

export const getHeaderLevel = (header: string)=>{
  return header.split(' ')[0];
}

export const isTagBiggerThanOrEqualLevel = (tag: string, level: number)=>{
  const res = /^h(\d+)$/.exec(tag)
  if(res && Number(res[1]) <= level){
    return true;
  }
  return false
}

export default function parse(md: string, options : { headers: string[], ignoreHeaders?: string[] }){
  let rawHtml = marked.parse(md);
  rawHtml = rawHtml.replace(/<pre><code>/g, '<p><code>')
  rawHtml = rawHtml.replace(/<\/code><\/pre>/g, '</code></p>')
  console.log('rawHtml', rawHtml);
  const root = html.parse(rawHtml);
  let codes : string[] = []
  options.headers.forEach(header=>{
    console.log('header', header)
    const headerLevel = getHeaderLevel(header)
    console.log('headerLevel', headerLevel)
    const headerTag = `h${headerLevel.length}`
    console.log('headerTag', headerTag)
    const selector = `${headerTag}#${header.slice(headerLevel.length + 1).replace(/ /g, '-').toLowerCase()}`
    let currentNode = root.querySelector(selector)
    if(!currentNode) throw Error(`Header ${header} does not exist in readme file.`)
    let foundNextBiggerOrEqualHeader = false
    while(!foundNextBiggerOrEqualHeader){
      if(!currentNode){
        foundNextBiggerOrEqualHeader = true
        break;
      }
      const nextNode : any = currentNode.nextElementSibling
      if(!nextNode || isTagBiggerThanOrEqualLevel(nextNode?.rawTagName, headerLevel.length)){
        foundNextBiggerOrEqualHeader = true
        break;
      }
      codes = codes.concat(nextNode.getElementsByTagName('code').map((node : HTMLElement) => node.innerText))
      currentNode = nextNode;
    }
  })
  return codes
}