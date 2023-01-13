![Quasar Framework logo](https://cdn.quasar.dev/logo-v2/header.png)

# Quasar legacy create CLI

> The legacy "quasar create" command, extracted to its own CLI.
> This package will not receive updates and should be considered "legacy".

## Installation

```bash
$ yarn global add @quasar/legacy-create
# OR
$ npm install -g @quasar/legacy-create
```

## Usage

```
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
```

## Semver
Quasar is following [Semantic Versioning 2.0](https://semver.org/).

## License

Copyright (c) 2015-present Razvan Stoenescu

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
