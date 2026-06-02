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

// src/fileData.ts
var FileData = class {
  path;
  lineCount;
  extension;
  constructor(path2, lineCount, extension) {
    this.path = path2;
    this.lineCount = lineCount;
    this.extension = extension;
  }
  getPath() {
    return this.path;
  }
  getLineCount() {
    return this.lineCount;
  }
  getExtension() {
    return this.extension;
  }
};

// src/folderData.ts
var FolderData = class {
  name;
  fileCount;
  lineCount;
  children = /* @__PURE__ */ new Map();
  files = [];
  constructor(name) {
    this.name = name;
    this.fileCount = 0;
    this.lineCount = 0;
  }
  getName() {
    return this.name;
  }
  getLineCount() {
    return this.lineCount;
  }
  setLineCount(lineCount) {
    this.lineCount = lineCount;
  }
  getFileCount() {
    return this.fileCount;
  }
  setFileCount(fileCount) {
    this.fileCount = fileCount;
  }
  getChildren() {
    return this.children;
  }
  getFiles() {
    return this.files;
  }
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
  populateFileDataArray(dataArray, files, disallowedExtensions, disallowedFiles);
  const root = new FolderData("root");
  for (const file of dataArray) {
    addFile(root, file);
  }
  calculateMetrics(root);
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
function addFile(root, file) {
  const parts = file.getPath().normalize(file.getPath()).split(path.sep).filter(Boolean);
  let current = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const folderName = parts[i];
    if (!current.getChildren().has(folderName)) {
      current.getChildren().set(folderName, new FolderData(folderName));
    }
    current = current.getChildren().get(folderName);
  }
  current.getFiles().push(file);
}
function calculateMetrics(node) {
  let files = node.getFiles().length;
  let lines = 0;
  for (const file of node.getFiles()) {
    lines += file.getLineCount();
  }
  for (const child of node.getChildren().values()) {
    calculateMetrics(child);
    files += child.getFileCount();
    lines += child.getLineCount();
  }
  node.setFileCount(files);
  node.setLineCount(lines);
}
async function populateFileDataArray(dataArray, files, disallowedExtensions, disallowedFiles) {
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
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
