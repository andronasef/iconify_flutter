// @ts-check
import {
  cleanupSVG,
  IconSet,
  isEmptyColor,
  parseColors,
  runSVGO,
} from "@iconify/tools";
import { exec } from "child_process";
import { promises as fs } from "fs";

const reservedWords = [
  "assert",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "else",
  "enum",
  "extends",
  "false",
  "final",
  "finally",
  "for",
  "if",
  "in",
  "is",
  "new",
  "null",
  "rethrow",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "var",
  "void",
  "while",
  "with",
  "async",
  "hide",
  "on",
  "show",
  "sync",
  "abstract",
  "as",
  "covariant",
  "deferred",
  "dynamic",
  "export",
  "extension",
  "external",
  "factory",
  "function",
  "get",
  "implements",
  "import",
  "interface",
  "library",
  "mixin",
  "operator",
  "part",
  "set",
  "static",
  "typedef",
  "await",
  "yield",
];

(async () => {
  const colorful = false;

  await cloneIconSetsRepo();
  await removeOldIcons();
  const makeIconsList = await getColoredIconsList();

  const iconsets = await fs.readdir("generator/icon-sets/json/");
  for (const iconset of iconsets) {
    if (shouldSkipIconset(iconset, makeIconsList, colorful)) continue;
    await processIconset(iconset);
  }

  await fs.rm("generator/icon-sets", { recursive: true });
})();

async function cloneIconSetsRepo() {
  await execShellCommand(
    "git clone https://github.com/iconify/icon-sets.git generator/icon-sets"
  );
}

async function removeOldIcons() {
  try {
    await fs.rm("lib/icons", { recursive: true });
  } catch (e) {
    console.log("lib/icons not found");
  }
  await fs.mkdir("lib/icons", { recursive: true });
}

async function getColoredIconsList() {
  const makeIcons = Object.entries(
    JSON.parse(
      await fs.readFile("generator/icon-sets/collections.json", "utf8")
    )
  );
  const makeIconsList = [];
  makeIcons.forEach(([key, value]) => {
    makeIconsList.push([key, value.palette]);
  });
  return makeIconsList;
}

function shouldSkipIconset(iconset, makeIconsList, colorful) {
  let makeit = false;
  makeIconsList.forEach((item) => {
    if (item[0] == iconset.split(".")[0] && item[1] == colorful) makeit = true;
  });
  if (!makeit) {
    console.log("skip " + iconset);
    return true;
  }
  return iconset === "fluent";
}

async function processIconset(iconset) {
  console.log(`Building ${iconset}`);
  const input = await fs.readFile(
    `generator/icon-sets/json/${iconset}`,
    "utf8"
  );
  const iconSet = new IconSet(JSON.parse(input));
  const iconSetName = getIconSetName(iconset);
  const outputPath = `./lib/icons/${getIconSetFileName(iconset)}.dart`;

  await createIconsetFile(outputPath, iconSetName, iconSet.prefix);
  await processIcons(iconSet, outputPath, iconSetName);
}

function getIconSetName(iconset) {
  return iconset
    .split(".")[0]
    .split("-")
    .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
    .join("");
}

function getIconSetFileName(iconset) {
  return iconset.split(".")[0].replace(/-/g, "_");
}

async function createIconsetFile(outputPath, iconSetName, iconSetPrefix) {
  await fs.writeFile(
    outputPath,
    `///Discover all icons of this iconset at https://andronasef.github.io/iconify_flutter/collection/${iconSetPrefix} \n class ${iconSetName} {`
  );
}

async function processIcons(iconSet, outputPath, iconSetName) {
  const icons = [];
  await iconSet.forEach(async (name, type) => {
    if (type !== "icon") return;

    const svg = await optimizeSVG(iconSet, name);
    if (!svg) return;

    let iconName = formatIconName(name, iconSetName);
    icons.push(iconName);

    await fs.appendFile(
      outputPath,
      `static const String ${iconName} = '${svg}';\n`
    );
  });

  await appendIconsList(outputPath, icons);
}

function formatIconName(name, iconSetName) {
  let newName = name.replace(/-/g, "_").toLowerCase();
  if (
    newName === iconSetName ||
    /^\W|^\d/gm.test(newName) ||
    reservedWords.includes(newName)
  ) {
    newName = "i_" + newName;
  }
  return newName;
}

async function optimizeSVG(iconSet, name) {
  const svg = iconSet.toSVG(name);
  if (!svg) {
    iconSet.remove(name);
    return null;
  }

  try {
    await cleanupSVG(svg);
    await parseColors(svg, {
      callback: (attr, colorStr, color) =>
        !color || !isEmptyColor(color) ? colorStr : "currentColor",
    });
    await runSVGO(svg);
  } catch (err) {
    console.error(`Error parsing ${name}:`, err);
    iconSet.remove(name);
    return null;
  }

  iconSet.fromSVG(name, svg);
  return svg;
}

async function appendIconsList(outputPath, icons) {
  const iconsArrayString = icons.map((icon) => `${icon},\n`).join("");
  const iconsDartArray = `static const List iconsList = [${iconsArrayString}];}`;
  await fs.appendFile(outputPath, iconsDartArray);
}

function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}
