#!/usr/bin/env node

const parseArgs = require('minimist')
const { yellow } = require('kolorist')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    b: 'branch',
    c: 'clone',
    o: 'offline',
    h: 'help'
  },
  boolean: ['c', 'o', 'h'],
  string: ['k', 'b']
})

const rawName = argv._[0]
const template = argv._[1]

if (argv.help || !rawName || !template) {
  if (!rawName || !template) {
    console.error(' Missing parameters. Please provide a project name and a starter kit name\n\n')
  }

  console.log(`
  Description
    -- LEGACY --
    Creates a Quasar project (app, AppExtension or UI kit) from CUSTOM starter kits.
    For scaffolding an official Quasar project please use this instead:
       yarn create quasar
       or
       npm init quasar

  Usage
    $ quasar-legacy-create <project-name> <kit-name> [--branch <version-name>]

  App Examples with custom starter kits
    $ quasar create my-project user/github-starter-kit
      # installs an App project with a custom starter kit from GitHub
    $ quasar create my-project user/github-starter-kit ./starter-kit-folder
      # installs an App project using a starter kit located at ./starter-kit-folder
    $ quasar create my-project user/github-starter-kit --branch v0.17
      # installs an App project from a specific branch

  Options
    --branch, -b   Use specific branch of the starter kit
    --clone, -c    Use git clone
    --offline, -o  Use a cached starter kit
    --help, -h     Displays this message
  `)
  process.exit(0)
}

require('../lib/ensure-outside-project')()

console.log()
console.log(
  require('fs').readFileSync(
    require('path').join(__dirname, '../assets/logo.art'),
    'utf8'
  )
)

// Following is adapted from Vue CLI v2 "init" command

const download = require('download-git-repo')
const exists = require('fs').existsSync
const path = require('path')
const ora = require('ora')
const home = require('os').homedir()
const tildify = require('tildify')
const inquirer = require('inquirer')
const rm = require('rimraf').sync

const generate = require('../lib/generate')
const logger = require('../lib/logger')
const { isLocalPath, getTemplatePath } = require('../lib/local-path')

const inPlace = !rawName || rawName === '.'
const name = inPlace ? path.relative('../', process.cwd()) : rawName
const to = path.resolve(rawName || '.')

if (isLocalPath(template) !== true) {
  template += '#' + (argv.branch || 'master')
}

const tmp = path.join(home, '.quasar-legacy-starter-kits', template.replace(/[\/:]/g, '-'))

if (argv.offline) {
  console.log(`> Use cached template at ${yellow(tildify(tmp))}`)
  template = tmp
}

console.log()
process.on('exit', () => {
  console.log()
})

if (inPlace || exists(to)) {
  inquirer.prompt([{
    type: 'confirm',
    message: inPlace
      ? 'Generate project in current directory?'
      : 'Target directory exists. Continue?',
    name: 'ok'
  }]).then(answers => {
    if (answers.ok) {
      run()
    }
  }).catch(logger.fatal)
}
else {
  run()
}

function run () {
  // check if template isn't local
  if (isLocalPath(template) !== true) {
    downloadAndGenerate(template)
    return
  }

  const templatePath = getTemplatePath(template)
  if (exists(templatePath)) {
    generate(name, templatePath, to, err => {
      if (err) logger.fatal(err)
      console.log()
      logger.success('Generated "%s".', name)
    })
  }
  else {
    logger.fatal('Local template "%s" not found.', template)
  }
}

function downloadAndGenerate (template) {
  const spinner = ora(' Downloading Quasar starter kit')
  spinner.start()

  // Remove if local template exists
  if (exists(tmp)) {
    rm(tmp)
  }

  download(template, tmp, { clone: argv.clone }, err => {
    spinner.stop()

    if (err) {
      logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
    }

    generate(name, tmp, to, err => {
      if (err) {
        logger.fatal(err)
      }

      console.log()
      logger.success('Generated "%s".', name)
    })
  })
}
