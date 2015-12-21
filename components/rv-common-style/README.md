Rise Vision Common Style
==============

**Copyright © 2014 - Rise Vision Incorporated.**

*Use of this software is governed by the GPLv3 license (available in the LICENSE file).*

## Introduction
Common CSS styling to be shared across Rise Vision apps, widgets and components. The style guide is published as github pages is available as reference documentation for all Rise Vision UI-components:
**http://rise-vision.github.io/style-guide**

## Built With

- *NPM*
- *Angularjs*
- *Gulp*
- *Bower*
- *Bootstrap (SASS)*


## Development

### Local Development Environment Setup and Installation

1. Install node dependencies `$ npm install`

2. Install front-end dependencies `$ bower install`


## Development Notes
All SASS files go under `/src`. To include them in the final CSS file add them as `imports` in the `app.scss` file.

The build process will pull in all the custom SASS files and the bootstrap SASS files and generate a single `rise.min.css` file. The hierarchy and overwrites are controlled within the `rise.min.css` file. The naming/directory structure has no impact on this.

### Run Local
Run `$ gulp` to see a list of available tasks and `$ gulp dev` to watch for and compile SASS.


## Build
To build run `$gulp build`. This will generate a `dist` folder with `css` and `font` folders.


## Usage
Install the common-style using bower `$ bower install git://github.com/Rise-Vision/common-style --save`

The `dist` folder contains the compiled CSS `css/rise.min.css` and all required fonts.

### Dependencies
- Bootstrap-sass-official
- Select2
- Spectrum
- Font-awesome

## Submitting Issues
If you encounter problems or find defects we really want to hear about them. If you could take the time to add them as issues to this Repository it would be most appreciated. When reporting issues please use the following format where applicable:

**Reproduction Steps**

1. did this
2. then that
3. followed by this (screenshots / video captures always help)

**Expected Results**

What you expected to happen.

**Actual Results**

What actually happened. (screenshots / video captures always help)

## Contributing
All contributions are greatly appreciated and welcome! If you would first like to sound out your contribution ideas please post your thoughts to our [community](http://community.risevision.com), otherwise submit a pull request and we will do our best to incorporate it

### Languages
*If this Project supports Internationalization include this section:*

If you would like translate the user interface for this product to another language please complete the following:
- Download the english translation file from this repository.
- Download and install POEdit. This is software that you can use to write translations into another language.
- Open the translation file in the [POEdit](http://www.poedit.net/) program and set the language for which you are writing a translation.
- In the Source text window, you will see the English word or phrase to be translated. You can provide a translation for it in the Translation window.
- When the translation is complete, save it with a .po extension and email the file to support@risevision.com. Please be sure to indicate the Widget or app the translation file is for, as well as the language that it has been translated into, and we will integrate it after the translation has been verified.

*if the Project does not support Internationalization include this section and include this need in our suggested contributions*

In order to support languages i18n needs to be added to this repository.  Please refer to our Suggested Contributions.

### Suggested Contributions
- *we need this*
- *and we need that*
- *we could really use this*
- *and if we don't already have it (see above), we could use i18n Language Support*

## Resources
If you have any questions or problems please don't hesitate to join our lively and responsive community at http://community.risevision.com.

If you are looking for user documentation on Rise Vision please see http://www.risevision.com/help/users/

If you would like more information on developing applications for Rise Vision please visit http://www.risevision.com/help/developers/.

**Facilitator**

[Byron Darlison](https://github.com/ByronDarlison "Byron Darlison")
