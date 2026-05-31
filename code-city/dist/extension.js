"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));

// src/Data.ts
var FileData = class {
  constructor(path2, lineCount, extension) {
    this.path = path2;
    this.lineCount = lineCount;
    this.extension = extension;
  }
  path;
  lineCount;
  extension;
};

// src/extension.ts
var path = __toESM(require("path"));
async function activate(context) {
  console.log('Congratulations, your extension "code-city" is now activeeeeeeee!');
  const disallowedExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".ico",
    ".mp4",
    ".mp3",
    ".wav",
    ".zip",
    ".rar",
    ".7z",
    ".pdf"
  ];
  const disallowedFiles = [
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml"
  ];
  const dataArray = [];
  const files = await getFiles();
  for (const file of files) {
    const ext = path.extname(file.path);
    const fileName = path.basename(file.path);
    const lineCount = await getLine(file);
    if (disallowedExtensions.includes(ext)) {
      continue;
    }
    if (disallowedFiles.includes(fileName)) {
      continue;
    }
    const data = new FileData(file.path, lineCount, ext);
    dataArray.push(data);
  }
  const disposable = vscode.commands.registerCommand("code-city.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World from Code City!");
  });
  context.subscriptions.push(disposable);
}
function deactivate() {
}
async function getFiles() {
  return await vscode.workspace.findFiles("**/*", "**/{node_modules,dist,.git}/**");
}
async function getLine(file) {
  const content = await vscode.workspace.fs.readFile(file);
  const text = Buffer.from(content).toString("utf8");
  const size = text.split("\n").length;
  return size;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
