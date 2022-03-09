"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var rl = __importStar(require("readline-sync"));
var inPath = rl.question('Input file path: ');
var outPath = rl.question('Output file path: ');
var videoHeight = rl.questionInt('Video height: ');
// read file
var raw = fs_1.default.readFileSync(inPath).toString();
var lines = raw.split("\n");
// change heigth tag
console.log("Changing subs height tag...");
var rawSubHeight = 1080;
var heightTagLineIndex = lines.findIndex(function (x) { return x.startsWith("PlayResY: "); });
if (heightTagLineIndex !== -1) {
    rawSubHeight = +lines[heightTagLineIndex].replace("PlayResY: ", "");
    lines[heightTagLineIndex] = "PlayResY: " + videoHeight;
}
else
    console.log("WARN: Subs file doesn't have PlayResY tag. Skipping...");
raw = lines.join("\n");
// move lines with \pos 
console.log("Locating \\pos tags...");
var deltaH = (rawSubHeight - videoHeight) / 2;
var posTags = raw.match(/(\\pos\((\d+([,.]?\d+)+)\))/gm) || [];
console.log("Found " + (posTags === null || posTags === void 0 ? void 0 : posTags.length) + " tags. Moving " + deltaH + "px...");
for (var _i = 0, posTags_1 = posTags; _i < posTags_1.length; _i++) {
    var tag = posTags_1[_i];
    var yPos = +tag.replace(/\\pos\(|\)/g, "").split(",")[1];
    var newTag = tag.replace("" + yPos, "" + (yPos - deltaH));
    // console.log({tag,yPos,newTag});
    raw = raw.replace(tag, newTag);
}
// save new file
console.log("Saving...");
fs_1.default.writeFileSync(outPath, raw);
console.log("Done.");
