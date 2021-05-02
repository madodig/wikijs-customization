<br>
<div align="center" valign="middle">
  <img width="400" alt="Artboard 1@2x" src="https://user-images.githubusercontent.com/14966219/115157644-a8a13400-a08a-11eb-9449-435de242eae5.png">
</div>

<br>

## Table of Contents
- [About](#about)
- [Features](#features)
- [Preview](#preview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Compatibility](#compatibility)
- [Issues](#issues)

<br>

## About

[Wiki.js](https://js.wiki/) is the most powerful and extensible open source Wiki software ([GitHub](https://github.com/Requarks/wiki)). It comes bundled with a default theme which should be sufficient for most users.

While theming is not yet possible in Wiki.js, it has a great feature, Code Injection, that allows you to override built-in styles and define your own CSS and JS code to be injected to `head` and `body` tags of the page.

By leveraging Code Injection feature, I was able to inject custom JavaScript code and CSS to customize Wiki.js to my liking. Injected JavaScript code is using Mutation Observer to rewrite, add or remove page elements when changes are made to the DOM tree of the page.

Code Injection is simple to use (Theme section in Administration area), but when your custom code grows to a lots of lines, it gets more complicated to manage it in the site Administration area. That's why I decided to keep the custom code on the filesystem, and use Code Injection menu to load the custom code (`Body HTML Injection`) and configure the custom settings (`Head HTML Injection`). This way, you are also able to use your favourite code editor to edit the files directly on the server.

Downsides to this approach:
- setup complexity;
- person managing the code has to have access to the server hosting the Wiki.js instance and adequate permissions;
- custom code is not backed up by the Wiki.js;
- due to the current limitations of the Wiki.js permission system, Wiki.js permissions can not be applied outside of Wiki.js, so everything under the folder where the custom code resides is accessible by everyone (which is not the issue for this use case).

<br>

## Features
- Hide/Show breadcrumbs;
- Hide/Show side column, and modify its position (left or right);
- Hide/Show individual cards from the side column:
  - Table of Contents,
  - Tags,
  - History (Last Edited By),
  - Boomark, Share, Print;
- Collapsible menu items when Static Navigation is used (one level deep at the moment);
- Ability to hide/show the navigation, so the main content area is increased and the focus is on the content;
- Add hyperlink to the Title subheading (site title);
- Code blocks with no line numbers;
- Accordion that's handy for FAQ section;
- Adjustments to HTML5 video player: right-click, context menu and text selection are disabled, download and remote playback controls are hidden;
- Minor adjustments to HTML Tables (border-collapse property);
- Minor adjustments to HTML Details & Summary (border and color).

This injection code is disabled when the site is accessed from mobile device. If navigation items are modified for collapsible menu feature, they will be rendered as native items in mobile view.

Some of the features implemented in this code are announced to be released officially with the next major version of Wiki.js (3.x). When they are released, you can disable the functionality by setting specific flags to false in the configuration area, or remove the injected code entirely (this code probably won't work with 3.x without modifications).<br>

<br>

## Preview

![Wiki.js Customization Preview](https://user-images.githubusercontent.com/14966219/115973642-e43e7100-a556-11eb-9e0d-91923ab85716.gif)

<br>

## Installation

### Simple installation

#### Option 1: Locally hosted code

Navigate to Wiki.js Administration / Theme.

Wrap the contents of `code/mad-wikijs-customization.css` file with HTML `<style>` tag and paste it in the `CSS Override` field.

    <style>
        code/mad-wikijs-customization.css contents
    </style>

Combine the contents of `code/mad-wikijs-customization.head` and `code/mad-wikijs-customization.js` files, wrap them with HTML `<script>` tag and paste it in the `Head HTML Injection` field.

    <script>
        code/wjs_html-injection-code.head contents
        code/mad-wikijs-customization.js contents
    </script>

Select `APPLY` in the top right corner of Administration area to apply the changes.

#### Option 2: The code is served remotely from raw.githack.com

You can use [raw.githack.com](https://raw.githack.com/) which serves raw files directly from various source code hosting services with proper Content-Type headers.

This way you can directly reference the source code from this repo in `Body HTML Injection` field like this:

    <link rel="stylesheet" href="https://rawcdn.githack.com/madodig/wikijs-customization/main/code/mad-wikijs-customization.css">

    <script src="https://rawcdn.githack.com/madodig/wikijs-customization/main/code/mad-wikijs-customization.js"></script>

To ensure that the CDN always serves the version of the file you want, use a git tag or commit ref in the file's path instead of a branch name. So, instead of a URL like `/madodig/wikijs-customization/BRANCH/code/file`, use a URL like `/madodig/wikijs-customization/TAG/code/file` or `/madodig/wikijs-customization/COMMIT/code/file`.


In addition to previous step, you just have to add the configuration, so wrap the contents of `code/mad-wikijs-customization.head` with HTML `<script>` tag and paste it in the `Head HTML Injection` field.

    <script>
        code/wjs_html-injection-code.head contents
    </script>

NOTE:<br>
Better option is, of course, the first option, since the code is hosted locally and you don't rely on 3rd party services.

### Advanced installation

Steps below will organize the code in separate files, outside the Wiki.js. When the custom code is kept outside the Wiki.js folder, it will not be impacted by actions executed on that folder, for instance upgrading Wiki.js.

NOTE: I'm running Wiki.js installation on Linux. If you've used some other installation method, you should use a corresponding method to enter the filesystem (for instance, if you're using Docker, you would use `docker exec` command to enter the shell of the container).

Connect to the server hosting the Wiki.js instance.

Define paths:

    PARENT_PATH="/opt/wiki-js/"                          <-- Path to the folder where git repo will be cloned [Modify to your needs]
    WIKI_ASSETS="/opt/wiki-js/app/assets"                <-- Path to the Wiki.js assets folder [Modify to your needs]
    CODE_PATH="$PARENT_PATH/wikijs-customization/code"

#### 1. Get the code

##### a) Option 1: Using Git clone

Clone the repo:

    mkdir -p $PARENT_PATH
    cd $PARENT_PATH
    git clone https://github.com/madodig/wikijs-customization
 
Create a symbolic link in Wiki.js `assets` folder:

    ln -s $CODE_PATH $WIKI_ASSETS/wjsccode

##### b) Option 2: Manually

If you want, you can create the `wjsccode` folder directly under the `assets` folder and not use symbolic links. If you do so, make sure to copy the contents of the `code` folder to that folder.

Create a folder for the custom code:

    mkdir -p $CODE_PATH

Create a symbolic link in the Wiki.js assets folder:

    ln -s $CODE_PATH $WIKI_ASSETS/wjsccode

Download the code as a compressed package and extract the contents of the `code` folder:

    curl -L -o ~/wikijs-customization.tar.gz https://github.com/madodig/wikijs-customization/archive/main.tar.gz
    cd $PARENT_PATH
    tar -zxf ~/wikijs-customization.tar.gz wikijs-customization-main/code
    mv wikijs-customization-main/ wikijs-customization

#### 2. File hierarchy

You should now have file tree similar to this (I keep the local code repo alongside Wiki.js installation):

    opt
    ├── wiki-js/
    │   ├── wikijs-customization/                    <-- This "repo"; can be elsewhere if preferred
    │   │   ├── code/                                <-- Folder including the custom code
    │   │   │   ├── mad-wikijs-customization.css
    │   │   │   ├── mad-wikijs-customization.js
    │   │   │   ├── wjs_html-injection-code.body
    │   │   │   └── wjs_html-injection-code.head
    │   ├── app/                                     <-- Wiki.js installation folder
    │   │   ├── assets/
    │   │   │   ├── ...
    │   │   │   └── wjsccode                         <-- Symbolic link pointing to the code folder
    │   │   ├── config.yml
    ...

You can keep the folder with custom code anywhere on the filesystem and you can also name it whatever you like, just make sure the symbolic link `wjsccode` points to the correct path where the custom code resides and make sure the Wiki.js can access the files.

#### 3. Configure Wiki.js to use the custom code

[OPTIONAL] Change the ownership to the user under which the Wiki.js is running (if needed):

    chown -R <WIKI_USER>: $WIKI_ASSETS/wjsccode/

Restart the Wiki.js application, so it picks up the folder with custom code.

Open your browser and navigate to Wiki.js Administration / Theme.

Paste the contents of the `wjs_html-injection-code.body` file to the `Body HTML Injection` field. Example:

    <link rel="stylesheet" href="/_assets/wjsccode/mad-wikijs-customization.css">

    <script src="/_assets/wjsccode/mad-wikijs-customization.js"></script>

Paste the contents of the `wjs_html-injection-code.head` file to the `Head HTML Injection` field. Example with the settings I use:

    <script>

        var collapsibleMenu        = true;      // Enable or disable collapsible menu
        var slidingMenu            = true;      // Enable or disable sliding menu
        var hideDivider            = false;     // Enable or disable 'Divider' element in navigation
        var addSiteTitleNavigation = true;      // Add link to Site Title next to Site Logo
        var removeBreadcrumbs      = true;      // Enable or disable breadcrumbs
        var removeTocCard          = false;     // Enable or disable 'Table of Contents' Card
        var removeTagCard          = true;      // Enable or disable 'Tags' Card
        var removeHistoryCard      = true;      // Enable or disable 'Last Edited By' Card
        var customizeVideoPlayer   = true;      // Enable or disable video player customization
        var removeBookmarkCard     = false;     // Enable or disable Bookmark/Share/Print Card
        var sideColumnPosition     = 'left';    // Side column position. Options: 'left'|'right'|false

        var mouseLeftEdgeOpensMenu = true;      // When mouse is close to the left edge, reveals menu if unpinned
        const leftEdge = 2;                     // Distance from the left edge in pixels to trigger menu reveal

        const COOKIE_NAME = "mad-nav-pinned";   // Name of the cookie (used for menu pin status)
        const COOKIE_DAYS = 365;                // Cookie validity in days

    </script>

NOTE: Initial settings in the `wjs_html-injection-code.head` file are set so that the customizations are not automatically activated when the code is applied.

Select `APPLY` in the top right corner of Administration area to apply the changes.

NOTE: When upgrading Wiki.js, make sure the symbolic link (if used) is still in the wiki assets folder after the upgrade, and pointing to the correct path. If it isn't, just recreate it.

<br>

## Configuration

To configure the code behaviour, modify values in the `Head HTML Injection` field. This will configure behaviour for all pages (Injection Code is not applied in Administration Area, Page Edit etc.).

If you want to override some of the settings for specific pages, use per-page script section (available since Wiki.js v2.5.117). For instance, if you want to hide the Table of Contents card for specific page, paste the following code:

    <script>
        var removeTocCard = false;
    </script>

in Scripts section (Edit/Page/Scripts) of that page.

<br>

## Usage

### Collapsible menu

This funcionality works with Static Navigation (Administration / Navigation / Static Navigation). During the page load, the code parses navigation elements and rewrites them as collapsible items.
After you enable this feature via the `collapsibleMenu` variable, it is required that navigation items are entered in a specific format to be rendered as collapsible. For instance, following items:

    #00#Demo Section 1#mdi-numeric-1-box#
    #01#Link 01
    #01#Link 02
    #01#Link 03
    
will result in "Demo Section 1" being displayed as a header of a collapsed menu section, and when selected, subitems (Link 01, Link 02 and Link 03) will be revealed. Each item consists of 2 or 3 parts:
- Prefix (ex: #01#) defines the level of the item (at the moment, this code supports one level deep, so these would be #00# for header and #01# for subitems);
- Item display name;
- Suffix (optional) defines the icon to be applied to the item (if you want to use an icon with Wiki.js header item, which does not have support for icons).

For section headers you can use navigation elements of types Header and Link. If Link element is used, when user selects it, browser will navigate to the page, instead of expanding the menu section.

When a page that is a subitem of a menu section is loaded, injected code will automatically expand the corresponding section.

While configuring the navigation, final result is not visible since injection code is not loaded in the Administration area.

An example of the Navigation as set up in Administration area (left image) and the final result (right image):

<div align="center" valign="middle">
  <img src="https://user-images.githubusercontent.com/14966219/115968347-d62d2800-a537-11eb-8f7c-4e2279f8d44c.png" width="262">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://user-images.githubusercontent.com/14966219/115968350-ddeccc80-a537-11eb-9773-bb5e14266dcb.png" width="192">
</div>

You can have both *native* Wiki.js format of the navigation items and customized navigation items in Static Navigation Menu.

The cookie is used so the browser remembers if the navigation was pinned or unpinned by the user. Otherwise, every time user navigates to a page, the navigation would be displayed as defined in the custom code settings.

### Code blocks with no line numbers

If you want certain code blocks to be displayed without line numbers, prepend a `div` element with `next-codeblock-no-line-numbers` class. Blank line between the `div` element and the code block is important.

An example that will render bash code block with no line numbers:
   
    <div class="next-codeblock-no-line-numbers"></div>
    
    ```bash
    echo "Code block with disabled line numbering."
    echo ""
    exit 0
    ```

Final result is not visible in the page editor, since injection code is not loaded in the page editor.

### List accordion

An accordion that expands/collapses certain areas of text on the page. It is useful for a FAQ section.

Items will be displayed as a collapsed list. Once an item is selected, it will be expanded. Selecting another sibling item expands that item, while collapsing other expanded siblings.

Works with multiple nested levels.

To use it, wrap your items list with `div` element (`id="faccordion"`). Items should be entered as a markdown list, so indentation is important.

Example:

    <div id="faccordion">

    - ### Item 1
      Text
    
    - ### Item 2
      Text
    
    - ### Section 1
      Text
    
      - #### Section 1, item 1
        Text
    
      - #### Section 2
        Text
    
        - ##### Section 2, Item 1
          Text
    
        - ##### Section 2, Item 2
          Text
    
    - ### Item 3
      Text
      
    </div>

Final result is not visible in the page editor, since injection code is not loaded in page editor.

<br>

### Individual cards visibility

It is possible to hide individual cards from the side column (Table of Contents, Tags, History, Boomark/Share/Print), as well as entire side column. Hiding the entire column takes precedence. Hiding all of the individual cards will also hide the side column.

It is possible to override global settings via custom script placed in Page Scripts section. If configuring individual cards visibility in page scripts, bare in mind that side column visibility takes precedence (if some cards are set to visible, while side column is set to hidden, they will not be visible because entire side column is hidden).

<br>

## Compatibility
The code has been tested against Wiki.js 2.5.191 on Windows 10 (recent versions of Edge, Google Chrome and Mozilla Firefox) and Ubuntu 20 (Chromium).

Markdown editor used as Wiki.js page editor.

It is reasonable to expect that whenever newer Wiki.js version is installed, some or all of the features in this code might stop working or even break Wiki.

<br>

## Issues
This code is far from perfect, but it serves my purpose. There are some issues as well :)
- Navigation: pin button can sometimes get glitchy if the mouse is used in rapid movements accross the navigation; if you are not able to pin/unpin the navigation, move the mouse out of the navigation, and try again,
- Collapsible menu items: if the same page exists in multiple collapsed sections, all menu sections that are parent of that page wil be expanded when that page is loaded (no workaround: do not use same pages in different collapsible menu sections),
- Collapsible menu items: mistakes in setting up collapsible menu items (hashtags and ordinals) might lead to an unresponsive wiki page. Be careful when setting it up! If pages become unresponsive, open a new window and navigate to Administration / Navigation (<WIKI_FQDN>/a/navigation) and fix errors,
- Accordion: works fine with simple elements, even embedded videos, but it is possible that items might stop automatically expanding/collapsing when using specific HTML code. Also, Accordion does not work when used in Tabs (tabsets),
- Display issues with smaller resolutions/window sizes.