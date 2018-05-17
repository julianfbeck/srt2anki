# srt2anki
a script that extracts .srt subfiles to anki or .csv for srs usage and sentence mining.

## Installation

Install srt2anki globally:

```shell
npm install -g srt-to-anki 
```


## Usage

Basic usage:
```shell
srt2anki <path to sub folder>
```
srt2anki will search the given folder for .srt files and extract the sub-lines.
### Options:
```shell
    -c, --csv              creates csv file instead of anki deck, please use for larger files
    -m, --min [min]        minimum length of a sub-line to be added to the deck (default: 4)
    -s, --simple           only add sub-line
    -d, --deckname [name]  name of the generated deck (default: deck)
    -h, --help             output usage information
```
**Due to memmory issues, if you want to convert large files, please use the -csv option to generate a .csv file instead of an anki deck and import it into anki using the import file funcion. This will save time.**



