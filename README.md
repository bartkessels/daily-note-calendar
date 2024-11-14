# Daily note calendar plugin

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/bartkessels/daily-note-calendar)

[![Build and test the daily-note-calendar plugin](https://github.com/bartkessels/daily-note-calendar/actions/workflows/build_test.yml/badge.svg)](https://github.com/bartkessels/daily-note-calendar/actions/workflows/build_test.yml)
[![Release Obsidian plugin](https://github.com/bartkessels/daily-note-calendar/actions/workflows/release.yml/badge.svg)](https://github.com/bartkessels/daily-note-calendar/actions/workflows/release.yml)

---

The Daily note calendar plugin started as a hobby project because another calendar plugin to open daily notes couldn't handle my own date format for daily notes which is (`yyyyMMdd - eeee` e.g. 20241231 - Saturday). Therefore, I decided to write my own plugin which allows you to customize the format of your daily and even weekly notes.

# Table of contents

- [1. Overview](#1-overview)
  - [1.1 Roadmap](#11-roadmap)
- [2. External dependencies](#2-external-dependencies)
- [3. Build and test](#3-build-and-test)
- [4. Contribute](#4-contribute)
  - [4.1 Branching strategy](#41-branching-strategy)
- [5. Create a new release](#5-create-a-new-release)

# 1. Overview

The main focus of the Daily note calendar plugin is to provide a calendar view to access or create your own daily, or weekly notes. This allows you to quickly navigate to your notes without having to search for them in the file-tree.

![Daily note calendar plugin in light mode](./docs/images/daily-note-calendar-light-mode.png)
![Daily note calendar plugin in dark mode](./docs/images/daily-note-calendar-dark-mode.png)

The plugin allows you to browse your periodic notes using a calendar view. Right now the following types of periodic notes are supported

- Daily notes
  - By clicking on a specific date
- Weekly notes
  - By clicking on the week number
- Monthly notes
  - By clicking on the month name
- Yearly notes
  - By clicking on the year number

The plugin also allows you to customize the format of your daily and weekly notes using the date formatting rules of [`date-fns`](https://date-fns.org/v4.1.0/docs/format).

To make it even more customizable, you can specify the template for your notes name, the template file on which your notes are based, and the location of your notes.

![Daily note calendar plugin settings](./docs/images/daily-note-calendar-settings.png).

## 1.1 Roadmap

Right now, the Daily note calendar plugin only allows you to navigate to your notes. But in the future, I would like to add the following features.

- Add an indicator for each date that has a note.
- Display all notes created on that day when you click on a day
  - Display the tiles below the calendar view, and open the note by clicking on the title
- Show which daily note you have currently opened

# 2. External dependencies

The Daily note calendar plugin uses [npm](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager) as a package manager,
so most dependencies required by the plugin can be installed using the following command:

```bash
$ npm install
```

To locally test your plugin, you need to have Obsidian (which is pretty self-explanatory why). For more information about the process of developing an Obsidian plugin, I'm happy to refer you to the
[Obsidian documentation](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin).

# 3. Build and test

To build and test the daily-note-calendar plugin, you can use the following commands:

```bash
$ npm install
$ npm run build
$ npm run test
```

Only the business logic is tested that doesn't depend on anything from Obsidian.

# 4. Contribute

Is there a feature you'd like to see, or a bug you've encountered? Please let us know, and help us make the _Daily note calendar_ great for everyone! Or, if you're a developer, try to fix it yourself! If you'd like to contribute back to the project, but you're not quite sure yet what you can add, take a look at the [roadmap](#11-roadmap).

All contributions are welcome, so feel free to join the open source community and support _Daily note calendar_ through your expertise!

To make sure everyone can contribute to _Daily note calendar_ we value the quality and understandability of our code and repository.
So when you're building a feature, or patching a bug, and you've made a decision, please document that decision in the [`docs/design.md`](docs/design.md) document. This will help future contributors to understand your rationale. If you've updated some logic in the code, please check the decision records and update the related ones. If you've done all this, update the test-suite and validate that your newly created code does exactly what you'd documented.

## 4.1 Branching strategy

So now that your idea is implemented, documented and tested, it's time to merge it into the project! To help you out a bit on how to set up a branch, we've got you covered in this chapter!

The _Daily notes calendar_ project does not use a development branch but instead uses short-lived feature branches which are directly merged into the `main`-branch. We've chosen this strategy 'cause we believe in _release often, release fast_. There's no need for your feature to gather dust in a stale `development` branch while waiting on some arbitrary date to be released. But, we do however, have some guidelines:

- If you're contributing a __feature__ use the `feature/<your-feature-name>` naming convention
- If you're contributing a __bug fix__ use the `bugfix/<the-name-of-the-bug>` naming convention.
- If you're contributing to __documentation__ use the `documentation/<name-of-change>` naming convention.
- If you're contributing a __hot fix__ use the `hotfix/<hotfix-type>-<name>` naming convention
  - These can be useful for updating dependency versions

# 5. Create a new release

To create a new release of the plugin, edit the `package.json` and `manifest.json` files and update the `version` property in both.

For versioning _Daily note calendar_ uses semantic versioning.
Which, given the documentation on [semver.org](https://semver.org), means that the version number consists of MAJOR.MINOR.PATCH.

When creating a release of _Daily note plugin_, check what kind of changes have been applied since the previous version and categorize these in one of the following segments:

1. Incompatible API change, or a user interface change
2. New functionality which doesn't break existing functionality
3. Bug fix

These can be mapped on the semantic versioning scheme in the following ways:

* Update the __MAJOR__ version when you've made a __breaking change__ either in the interfaces or in the UI.
* Update the __MINOR__ version when a __new feature__ is introduced
* Update the __PATCH__ version when a __bug is resolved__

When you've updated the version in `package.json` create a new tag in Git using the
following structure: `MAJOR.MINOR.PATCH`.
For version 5 with a bugfix this would be `5.0.1`.

This can be created using the following Git-command:

```bash
$ git tag -a 5.0.1
$ git push -u origin 5.0.1
```

This will create the tag locally and then push it to Github which in turn will kick off the required
pipelines to create the new release and add the build artifacts.