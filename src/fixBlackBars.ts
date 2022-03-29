import fs from 'fs'
import * as rl from 'readline-sync'
import { isNumber } from './util/numbers'

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

// pos
let posTags = raw.match(/(\\pos\((\d+([,.]?\d+)+)\))/gm) || []
console.log(`Found ${posTags?.length} pos tags. Moving ${deltaH}px...`)
for (const tag of posTags) {
    let yPos = +(tag.replace(/\\pos\(|\)/g, ``).split(`,`)[1] as string)
    // let newTag = tag.replace(`${yPos}`, `${yPos - deltaH}`)
    // let newTag = tag.replace(`${yPos}`, `${Math.abs(yPos - deltaH)}`)
    let newTag = tag.replace(`${yPos}`, `${yPos > deltaH ? yPos - deltaH : yPos}`)
    // console.log({tag,yPos,newTag});
    raw = raw.replace(tag, newTag)
}
// org
let orgTags = raw.match(/(\\org\((\d+([,.]?\d+)+)\))/gm) || []
console.log(`Found ${orgTags?.length} org tags. Moving ${deltaH}px...`)
for (const tag of orgTags) {
    let yPos = +(tag.replace(/\\org\(|\)/g, ``).split(`,`)[1] as string)
    // let newTag = tag.replace(`${yPos}`, `${yPos - deltaH}`)
    // let newTag = tag.replace(`${yPos}`, `${Math.abs(yPos - deltaH)}`)
    let newTag = tag.replace(`${yPos}`, `${yPos > deltaH ? yPos - deltaH : yPos}`)
    // console.log({tag,yPos,newTag});
    raw = raw.replace(tag, newTag)
}

//move
let moveTags = raw.match(/(\\move\((\d+([,.]?\d+)+)\))/gm) || []
console.log(`Found ${moveTags?.length} move tags. Moving ${deltaH}px...`)
for (const tag of moveTags) {
    let tagData = tag.replace(/\\move\(|\)/g, ``)
    let nums = tagData.split(`,`)
    let yPos1 = +(nums[1] as string)
    let yPos2 = +(nums[3] as string)
    let isMovable = yPos1 > deltaH && yPos2 > deltaH
    if (!isMovable) continue;
    nums[1] = `${yPos1-deltaH}`
    nums[3] = `${yPos2-deltaH}`
    let newTag = tag.replace(`${tagData}`, `${nums.join(',')}`)
    // console.log({tag,yPos,newTag});
    raw = raw.replace(tag, newTag)
}
//clip
// let clipTags = raw.match(/(\\i?clip\((\d+([,.]?\d+)+)\))/gm) || []
// console.log(`Found ${clipTags?.length} clip tags. Moving ${deltaH}px...`)
// for (const tag of clipTags) {
//     let tagData = tag.includes(`,`) ? tag.replace(/\\i?clip\(|\)/g, ``).split(`,`)[1] : tag.replace(/\\i?clip\(|\)/g, ``)
//     let commands = tagData.includes(`,`) ? tagData.split(`,`)[1].split(` `) : tagData.split(` `)
//     let isY = false
//     for (let i = 0; i < commands.length; i++) {
//         if (isNumber(commands[i])) {
//             if (isY) {
//                 commands[i] = `${+commands[i] - deltaH}`
//                 isY = false
//             }
//             else isY = true
//         }
//     }
//     let newTag = tag.replace(`${tagData}`, `${commands.join(' ')}`)
//     // console.log({tag,yPos,newTag});
//     raw = raw.replace(tag, newTag)
// }
// save new file
console.log(`Saving...`);
fs.writeFileSync(outPath, raw)
console.log(`Done.`);