const menus = {
  main: `
    GENOS is a tool for generating release notes.

    You need a folder with a markdown file (ie: releaseNotes/doc folder)
    and their respective images referenced as filenames using numbers (ie: 1.png).

    Example:
      - energylink-connect2-app
        - releaseNotes
          + doc
            - notes.md
            - 01.jpg


    genos add <options>

    --version ..... The new version              (6.117.1)
    --date    ..... The release date             (2021-09-17)
    --notes   ..... The markdown file location   [doc/notes.md]
    --target  ..... The 'releaseNotes.json' file [../src/pages/VersionInformation/releaseNotes.json']

    version and date flags are mandatory and must be provided to the script

    Assuming you create the folder structure mentioned above, you can do:

    > npm run notes -- --version 6.120.0 --date 2022-01-01

    Or, you can specify where your markdown and images are with these 2 commands:

    > npm run notes
    > genos add --version 6.120.0 --date 2022-01-01 --notes folder/myNotesFile.md --target /path/to/releaseNotes.json
`
}

module.exports = args => {
  const subCmd = args._[0] === 'help' ? args._[1] : args._[0]

  console.info(menus[subCmd] || menus.main)
}
