#!/usr/bin/env node
Module = {
    TOTAL_MEMORY: 2000000000
}
const fs = require('fs');
const path = require('path');
const parser = require('subtitles-parser');
const search = require('recursive-search');
const AnkiExport = require('anki-apkg-export').default;
const program = require('commander');

program
    .version('0.0.1')
    .usage('[options] <path>')
    .option('-c, --csv', 'creates csv file instead of anki deck, please use for larger files', false)
    .option('-m, --min [min]', 'minimum length of a sub-line to be added to the deck', 4)
    .option('-s, --simple', 'only add sub-line ', false)
    .option('-d, --deckname [name]', 'name of the generated deck', "deck")
    .parse(process.argv);



if (!program.args.length) {
    program.help();
} else {
    let lineNumbers = 0;
    let wstream;
    let directory = program.args[0];

    if (program.csv)  wstream= fs.createWriteStream(program.deckname + ".csv");
    const apkg = new AnkiExport(program.deckname + ".apkg");
    // search all files
    console.log(`Searching for .srt Files in: ${directory}`);
    search.recursiveSearch(/.srt$/, directory, function (err, result) {
        if (err) throw err
        // result
    }, function (results) {

        console.log(`Found ${results.length} Files`);
        results.forEach(function (file, i) {
            let srt = fs.readFileSync(file, 'utf8');
            let data = parser.fromSrt(srt);
            let filename = path.basename(file).slice(0, -4);

            console.log(`${i}/${results.length}; Lines: ${data.length} TOTAL: ${lineNumbers}; now processing ${filename}`);

            //write sub lines to files
            data.forEach(line => {
                if (line.text.length >= program.min) {
                    if (program.csv) {
                        if (program.simple) wstream.write(`${line.text.replace(/\n|\r/g, "").replace(";","")}\n`)
                        else wstream.write(`${filename};${line.text.replace(/\n|\r/g, "").replace(";","")}\n`);
                    } else {
                        if (program.simple) apkg.addCard(line, "");
                        else apkg.addCard(filename, line);
                    }
                }
            });
            lineNumbers = lineNumbers + data.length;
        });

        //finish, cleanup
        if (program.csv) {
            console.log(`Wrote ${lineNumbers} Lines to csv`);
            console.log("Closing files....");

        } else {
            apkg.save()
                .then(zip => {
                    fs.writeFileSync(`./${program.deckname}.apkg`, zip, 'binary');
                    console.log(`Package has been generated: subtitles.apkg`);
                })
                .catch(err => console.log(err.stack || err));
        }




    })

}