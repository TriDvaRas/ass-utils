import fs from 'fs'
import * as rl from 'readline-sync'

let inPath = rl.question('Input file path: ')
let outPath = rl.question('Output file path: ')
let videoHeight = rl.questionInt('Video height: ')

// read file
let raw = fs.readFileSync(inPath).toString()
let lines = raw.split(`\n`)

// change heigth tag
console.log(`Changing subs height tag...`);
let rawSubHeight = 1080
let heightTagLineIndex = lines.findIndex(x => x.startsWith(`PlayResY: `))
if (heightTagLineIndex !== -1) {
    rawSubHeight = +lines[heightTagLineIndex].replace(`PlayResY: `, ``)
    lines[heightTagLineIndex] = `PlayResY: ${videoHeight}`
}
else
    console.log(`WARN: Subs file doesn't have PlayResY tag. Skipping...`);
raw = lines.join(`\n`)
// move lines with \pos 
console.log(`Locating \\pos tags...`);
let deltaH = (rawSubHeight - videoHeight) / 2
let posTags = raw.match(/(\\pos\((\d+([,.]?\d+)+)\))/gm) || []
console.log(`Found ${posTags?.length} tags. Moving ${deltaH}px...`)

for (const tag of posTags) {
    let yPos = +(tag.replace(/\\pos\(|\)/g, ``).split(`,`)[1] as string)
    let newTag = tag.replace(`${yPos}`, `${yPos - deltaH}`)
    // console.log({tag,yPos,newTag});
    raw = raw.replace(tag, newTag)
}
// save new file
console.log(`Saving...`);
fs.writeFileSync(outPath, raw)
console.log(`Done.`);