// @ts-check
import { promises as fs } from "fs";
import {
    IconSet,
    cleanupSVG,
    runSVGO,
    parseColors,
    isEmptyColor,
} from "@iconify/tools";
import { exec } from "child_process";


(async () => {
    // make colorful icons or not
    const colorful = false

    //  remove old and get new one
    await execShellCommand(
        "git clone https://github.com/iconify/icon-sets.git generator/icon-sets"
    );
    try {
        await fs.rm("lib/icons", { recursive: true });
    } catch (e) {
        console.log("lib/icons not found");
    }
    await fs.mkdir("lib/icons", { recursive: true });

    // get colored icons list to skip them
    let makeIcons = Object.entries(
        JSON.parse(
            await fs.readFile("generator/icon-sets/collections.json", "utf8")
        )
    );

    let makeIconsList = [];

    makeIcons.forEach(async ([key, value]) => {
        makeIconsList.push([key, value.palette]);
    });

    // Import icons
    const inputIconSetsPath = "generator/icon-sets/json/";
    const iconsets = await fs.readdir(inputIconSetsPath);

    for (const iconset of iconsets) {
        // Skip Colored Iconsets

        let makeit = false;
        makeIconsList.forEach((item) => {
            if (item[0] == iconset.split(".")[0]) if (item[1] == colorful) makeit = true;
        });
        if (!makeit) {
            console.log("skip " + iconset);
            continue;
        }

        // Read file
        // if (iconset == "flat-color-icons.json") {
        console.log(`Building ${iconset}`);

        const input = await fs.readFile(`${inputIconSetsPath}${iconset}`, "utf8");
        const iconSet = new IconSet(JSON.parse(input));
        const iconSetName = iconset
            .split(".")[0]
            .split("-")
            .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
            .join("");
        const iconSetNameFile = iconset.split(".")[0].replace(/-/g, "_");
        const outputPath = `./lib/icons/${iconSetNameFile}.dart`;

        // make new file with (iconset name).dart (File Head)
        fs.writeFile(outputPath, `///Discover all icons of this iconset at https://andronasef.ninja/iconify_flutter/collection/${iconSet.prefix} \n class ${iconSetName} {`);

        // Validate, clean up, fix palette and optimise
        await iconSet.forEach(async (name, type) => {
            if (type !== "icon") {
                return;
            }

            const svg = iconSet.toSVG(name);
            if (!svg) {
                // Invalid icon
                iconSet.remove(name);
                return;
            }

            // Clean up and optimise icons
            try {
                // Cleanup icon code
                await cleanupSVG(svg);

                // Assume icon is monotone: replace color with currentColor, add if missing
                // If icon is not monotone, remove this code
                await parseColors(svg, {
                    callback: (attr, colorStr, color) => {
                        return !color || !isEmptyColor(color) ? colorStr : "currentColor";
                    },
                });

                // Optimise
                await runSVGO(svg);
            } catch (err) {
                // Invalid icon
                console.error(`Error parsing ${name}:`, err);
                iconSet.remove(name);
                return;
            }

            // Update icon
            iconSet.fromSVG(name, svg);
        });

        // Export all icons (File Content) //
        const icons = []; // (put in icons file to have a list all icons)
        await iconSet.forEach(async (name) => {
            let newName = name.replace(/\-/g, "_").toLowerCase();
            if (
                newName == iconSetName ||
                /^\W|^\d/gm.test(newName) ||
                reservedWords.includes(newName)
            )
                newName = "i_" + newName;

            icons.push(newName);

            const svg = iconSet.toString(name);
            if (!svg) {
                return;
            }
            await fs.appendFile(
                outputPath,
                `static const String ${newName} = '${svg}';\n`
            );
        });

        // Add Icons List To File
        let iconsDartArrayString = "";
        icons.forEach((icon) => {
            iconsDartArrayString += `${icon},\n`;
        });
        const iconsDartArray = `static const List iconsList = [${iconsDartArrayString}];}`;
        await fs.appendFile(outputPath, iconsDartArray);
    }
    // Delete iconsets for redundency
    await fs.rm("generator/icon-sets", { recursive: true });
})();
// }

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
