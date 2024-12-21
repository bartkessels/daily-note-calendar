# Daily note calendar plugin

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/bartkessels/daily-note-calendar)

[![Build and test the daily-note-calendar plugin](https://github.com/bartkessels/daily-note-calendar/actions/workflows/build_test.yml/badge.svg)](https://github.com/bartkessels/daily-note-calendar/actions/workflows/build_test.yml)
[![Release Obsidian plugin](https://github.com/bartkessels/daily-note-calendar/actions/workflows/release.yml/badge.svg)](https://github.com/bartkessels/daily-note-calendar/actions/workflows/release.yml)

---

The Daily note calendar plugin started as a hobby project because another calendar plugin to open daily notes couldn't handle my own date format for daily notes which is (`yyyyMMdd - eeee` e.g. 20241231 - Saturday). Therefore, I decided to write my own plugin which allows you to customize the format of your daily and even weekly notes.

# Table of contents

- [1. Features](#1-features)
  - [1.1 Periodic notes](#11-periodic-notes)
  - [1.2 Variables](#12-variables)
  - [1.3 Notes created on a specific day](#13-notes-created-on-a-specific-day)
- [2. External dependencies](#2-external-dependencies)
- [3. Build and test](#3-build-and-test)
- [4. Contribute](#4-contribute)
  - [4.1 Branching strategy](#41-branching-strategy)
- [5. Create a new release](#5-create-a-new-release)

# 1. Features

![Daily note calendar plugin light mode](./docs/images/daily-note-calendar-light-mode.png)

## 1.1 Periodic notes

Quickly navigate your vault using a calendar view, this plugin allows you to create and navigate to your periodic notes such as

- Daily notes
  - By clicking on a specific date
- Weekly notes
  - By clicking on the week number
- Monthly notes
  - By clicking on the month name
- Quarterly notes
  - By clicking on the quarter name in the upper-left corner
- Yearly notes
  - By clicking on the year number

For each note, you can specify the template of the name `yyyy-MM-dd - eeee` and the folder where the newly created periodic note should be stored.
The path is also customizable using the date formatting rules of [`date-fns`](https://date-fns.org/docs/format).


Below each date, you can choose to display an indicator whether or note that date already has a note.

## 1.2 Variables

All the notes that you create must be based on a template, this allows you to create your periodic note based on the same template every time.
Inside your template-file you can use the following variables:

| Variable               | Description                                                                                  | Template                                                                                                                                                                                                                   |
|------------------------|----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `{{date:<template>}}`  | The date of the note. This date is based on the date that you've clicked on in the calendar. | You can use the same date templating rules of [date-fns](https://date-fns.org/docs/format) that you use in the name or the folder. Thus `{{date:yyyy-MM-dd - eeee}}` would turn into _2024-12-31 - Monday_.                |
| `{{today:<template>}}` | The date of today. This date is based on the date and time of creation of the note.          | You can use the same date templating rules of [date-fns](https://date-fns.org/docs/format) that you use in the name or the folder. Thus `{{today:yyyy-MM-dd - eeee, HH:mm}}` would turn into _2024-12-31 - Monday, 12:59_. |
| `{{title}}`            | -                                                                                            | This will take the title of the note you had opened before clicking a date in the calendar.                                                                                                                                |

## 1.3 Notes created on a specific day

For each day you select, you can enable the feature to display all the notes created on that specific day below the calendar.
This allows you to easily navigate your vault using the calendar view and quickly find the notes you've created on any day.

In the settings, you can specify how you want the plugin to find the notes created on a date. Either use the default created date of the actual file or use a specific property in the frontmatter of the note.

The created on time that is displayed below each note can be customized using the date formatting rules of [`date-fns`](https://date-fns.org/docs/format).

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

To create a new release of the plugin, edit the `package.json` file and update the `version` property. Then run `npm run version` to update the version in the `manifest.json` and `versions.json` file.
Once the release is completed, merge the branch back into the `main` branch.

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
