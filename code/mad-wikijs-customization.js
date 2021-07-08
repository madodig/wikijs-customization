/***************************************************/
/* https://github.com/madodig/wikijs-customization */
/***************************************************/



/* CUSTOM CLASSES */
const CM_LNK_ACTIVE           = 'mad-cm-lnk-active';
const CM_LNK_ACTIVE2          = 'mad-cm-lnk-active2';
const CM_COLLAPSIBLE          = 'mad-cm-collapsible';
const CM_COLLAPSIBLE_ACTIVE   = 'mad-cm-collapsible-active';
const CM_COLLAPSIBLE_INACTIVE = 'mad-cm-collapsible-inactive';
const CM_SECTION              = 'mad-cm-section';
const CM_SECTION_EXPANDED     = 'expanded';
/* No line numbers class to find */
const NO_LINE_NUMBERS_CLASS   = 'next-codeblock-no-line-numbers';

/* VARIABLES */
var menuItemType;
var headerProcessed = navProcessed = mainProcessed = footerProcessed = false;
var breadcrumbsHidden = false;
var btnToTopProcessed = false;
var btnToTopVisible = false;

var curPathRel = window.location.pathname;
var curPathAbs = window.location.href;


/* Mutation Observer instantiation */
var mo = new MutationObserver(moCallback);

/* Mutation Observer configuration object with the listeners configuration */
/*var moConfig = { attributes: true, childList: true, subtree: true }; */
var moConfig = { attributes: true, childList: true, subtree: true, characterDataOldValue: true, attributeOldValue: true };

/* Target node to be observed */
var moTarget = document;

/* SLIDING MENU */
if ( slidingMenu ) {
    /*  const icon_pinOff = "mdi-pin-off-outline"; */
    /*  const icon_pinOn  = "mdi-pin-outline"; */
    /*  const icon_menu   = "mdi-menu";   // mdi-backburger */
    var icon_pinOff = "mdi-pin-off-outline";
    var icon_pinOn  = "mdi-pin-outline";
    var icon_menu   = "mdi-menu";   /* mdi-backburger */

    var pmb = null;
    var pmbHolder = null;

    var mb = null;
    var mbHolder = null;
    var contentHolder = null;
    var backToTopHolder = null;
    var menuOpening = menuClosing = menuClosed = menuOpened = false;
    var pinMenu = getCookie(COOKIE_NAME); if ( pinMenu == "" ) { pinMenu = false; setCookie(COOKIE_NAME, pinMenu, COOKIE_DAYS); } else if ( pinMenu === "false" ) { pinMenu = false; } else { pinMenu = true; }
} else {
    var pinMenu = true;
}

var header, navigation, main, footer;
var btnToTop;
var sideColumn, pageTitle, breadcrumbs, hideSideColumn;
var sideColumnHidden = false;
var mouseLeftEdgeOpensMenu;
var isMouseOverNav = false;
var menuFirstHover = true;





/*   MAIN   */


/*var curUser = getLoggedInUser(); */

var mobileDevice = isMobileDevice();
moStart();





/* FUNCTIONS */


/* Test if the client is a mobile device */
function isMobileDevice () {
    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) { /* true for mobile device */
        return true;
    } else { /* false for not mobile device */
        return false;
    }
}


function fixMobileDeviceNodeValue(node) {
    var nodeValue = node.nodeValue;
    if ( nodeValue ) {
        var parts = nodeValue.split("#");
        if ( parts.length > 1 ) {
            if ( isNumeric(parts[1]) ) {
                level = parseInt(parts[1]);
                var text = nodeValue.replace("#" + parts[1] + "#", "");
            }
        } else { var text = nodeValue; }
        var parts = text.split("#");
        node.nodeValue = parts[0];
    }
}


/* Starting Mutation Observer */
function moStart() { mo.observe(moTarget, moConfig); }


/* Stopping (disconnecting)  Mutation Observer */
function moStop()  { mo.disconnect(); }


/* Mutation Observer callback function */
function moCallback( mutations, mutationObserver ) {

    for ( const { addedNodes } of mutations ) {
        for ( const n of addedNodes ) {
            if ( n.tagName && n.matches('NAV') && n.style && n.style.getPropertyValue('transform') ) {
                if ( n.style.removeProperty ) { n.style.removeProperty('transform'); } else { n.style.removeAttribute('transform'); }
            }
        }
    }

    /* Mutations. Object containing mutation records. */
    /* Mutation Record's keys: addedNode, attributeName, attributeNamespace, nextSibling, oldValue, previousSibling, removedNodes, target, type */
    header     = document.querySelector("header[data-booted='true']");
    navigation = document.querySelector("nav[data-booted='true']");
    main       = document.querySelector("main[data-booted='true']");
    footer     = document.querySelector("footer[data-booted='true']");
    /* btnToTop   = document.querySelector("button[aria-label='Return to top']");   // Not working with localization because aria-label is language specific */
    btnToTop   = document.querySelector("i.mdi-arrow-up");

    btnToTopVisible = false;
    if ( btnToTop ) {  /* Retun to top button customization */
        btnToTopVisible = true;
        btnToTop = btnToTop.closest("button");
        if ( !pinMenu && btnToTop.style.left != "5px" ) {
            btnToTop.style.left = "5px";
        }
    }

    if ( header && !headerProcessed ) {   /* Header customization */
        customizeHeader(header);
        headerProcessed = true;
    }
    if ( navigation && !navProcessed ) {  /* Navigation customization */
        customizeNavigation(navigation);
        navProcessed = true;
    }
    if ( main && !mainProcessed ) {       /* Main Content customization */
        customizeMainContent(main);
        mainProcessed = true;
    }
    if ( footer && !footerProcessed ) {   /* Footer customization */
        customizeFooter(footer);
        footerProcessed = true;
    }

    if ( mouseLeftEdgeOpensMenu ) { document.onmousemove = handleMouseMove; }

}


/* Callback executed when HTML header tag was found with data-booted attribute set to true */
function customizeHeader(header) {

    if ( addSiteTitleNavigation ) {
        /* Add navigation Site Title */
        var subHeading = header.querySelector("span.subheading");
        if ( subHeading ) {
            subHeading.style.cssText = "cursor: pointer;";
            subHeading.addEventListener('click', function() { window.location = "/"; });
            addSiteTitleNavigation = false;
        }
    }

}



/* Callback executed when HTML nav tag was found with data-booted attribute set to true */
function customizeNavigation(navigation) {

    if ( slidingMenu ) {
        if ( navigation.style.removeProperty ) { navigation.style.removeProperty('transform'); } else { navigation.style.removeAttribute('transform'); }
    }

    /* COLLAPSIBLE MENU */
    if ( collapsibleMenu ) {

        var menuItems = navigation.querySelector('.__view').children[0].children[1].childNodes;

        if ( mobileDevice ) {
            menuItems.forEach( function(item) {
                if ( item.childNodes[0] ) { fixMobileDeviceNodeValue(item.childNodes[0]); }
                if ( item.childNodes[1] && item.childNodes[1].childNodes[0] ) { fixMobileDeviceNodeValue(item.childNodes[1].childNodes[0]); }
            });
        } else {
            menuItems.forEach( function(item) {
                /* FIRST RUN: Group items in sections and apply styles */
                var next = item.nextElementSibling;
                var prev = item.previousElementSibling;
                var sectionHeader = item.previousElementSibling;

                menuItemType = getMenuItemType(item);

                if ( menuItemType == "DVD" && hideDivider ) {
                    item.style.display = "none";
                } else if ( getMenuItemInfo(item, "level") > getMenuItemInfo(sectionHeader, "level") ) {
                    /* Group items */
                    var newSection = groupItems(item);
                    /* Wrap each item group (menu section) */
                    newSection.wrapGroup(CM_SECTION);
                    sectionHeader.classList.add(CM_COLLAPSIBLE, CM_COLLAPSIBLE_INACTIVE);

                    if ( sectionContainsActivePage(newSection) ) {
                        sectionHeader.classList.toggle(CM_COLLAPSIBLE_INACTIVE);
                    } else if ( sectionHeader.href == curPathAbs ) {   /* Section header is currently active page (opened) */
                        sectionHeader.classList.add(CM_LNK_ACTIVE2);
                        sectionHeader.nextElementSibling.classList.add(CM_SECTION_EXPANDED);
                        sectionHeader.classList.toggle(CM_COLLAPSIBLE_ACTIVE);
                        sectionHeader.classList.toggle(CM_COLLAPSIBLE_INACTIVE);
                    }

                    /* Add event listener only if section header is of type header, not if it is a page link to avoid expanding section before navigating to link target */
                    if ( getMenuItemType(sectionHeader) == "HDR" ) { sectionHeader.addEventListener('click', (ev) => { const elm = ev.target; sectionState(sectionHeader.nextElementSibling, 'toggle'); }, false); }

                }

            });

            menuItems.forEach( function(item) {
                /* SECOND RUN: When everything's grouped and styled, parse names and header icons (if any) */

                menuItemType = getMenuItemType(item);
                if ( menuItemType == "HDR" ) {
                    if ( getMenuItemInfo(item, "icon") ) {
                        headerAppendIcon(item, getMenuItemInfo(item, "icon"));
                        item.childNodes[1].nodeValue = getMenuItemInfo(item, "text");
                    }
                    item.childNodes[0].nodeValue = getMenuItemInfo(item, "text");
                } else if ( menuItemType == "LNK" ) {
                    item.childNodes[1].childNodes[0].nodeValue = getMenuItemInfo(item, "text");
                }
            });
        }
    }

    /* SLIDING MENU */
    if ( !mobileDevice && slidingMenu ) {

        pmbHolder = document.createElement('button');
        pmbHolder.className = "v-btn v-btn--top v-btn--depressed v-btn--fab v-btn--fixed v-btn--left v-btn--round theme--dark v-size--small primary mad-pmb";
        pmbHolder.type = "button";
        pmbHolder.insertAdjacentHTML('afterbegin', '<span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate mdi theme--dark ' + icon_pinOff + '" style="transform:rotate(0deg);"></i></span>');
        pmb = pmbHolder.querySelector('i');

        mbHolder = document.createElement('button');
        mbHolder.className = "v-btn v-btn--top v-btn--depressed v-btn--fab v-btn--fixed v-btn--left v-btn--round theme--dark v-size--small primary mb";
        mbHolder.type = "button";
        mbHolder.insertAdjacentHTML('afterbegin', '<span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate mdi theme--dark ' + icon_menu + '"></i></span>');
        navigation.parentNode.insertBefore(mbHolder, navigation);
        mb = mbHolder.querySelector('i');

        mbHolder.addEventListener('mouseenter', menuOpen);
        addListeners(navigation, "mouseenter mouseleave mouseover", navEvent);
        addListeners(pmbHolder, "mouseleave mouseup", pmbEvent);

        /* navigation.classList.add('mad-nav-hidden'); */

        if ( !pinMenu && isMouseOverNav !== true ) { setTimeout( function() { menuClose()}, 100); }
        menuOpening = false; menuOpened = true;


        if ( pinMenu ) {
            pmb.classList.add(icon_pinOff);
            menuOpen();
            navigation.classList.add('mad-nav-visible');
        } else {
            pmb.classList.add(icon_pinOn);
        }

    }

}


/* Callback executed when HTML main tag was found with data-booted attribute set to true */
function customizeMainContent(main) {

    breadcrumbs = main.querySelector("header");   /* Returns first header tag found */
    if ( removeBreadcrumbs && !breadcrumbsHidden ) {
        if ( breadcrumbs ) {
            if ( breadcrumbs.nextSibling ) {
                breadcrumbs.nextSibling.remove();                 /* Removes next <hr> element */
            }
            breadcrumbs.remove();                             /* Removes <header> element containing breadcrumbs */
            breadcrumbsHidden = true;
        }
    }

    /* Modify side column */
    sideColumn = main.querySelector('div.flex.page-col-sd.lg3.xl2');
    if ( sideColumn ) {

        hideSideColumn = ( removeTocCard && removeTagCard && removeHistoryCard && removeBookmarkCard );

        if ( hideSideColumn || sideColumnPosition === false || sideColumnPosition === 'false' ) {
            sideColumn.remove();
            sideColumnHidden = true;
            var pageHeader  = main.querySelector('div.offset-lg-3.offset-xl-2'); if ( pageHeader  ) { pageHeader.classList.remove('offset-lg-3', 'offset-xl-2'); }
            var pageContent = main.querySelector('div.flex.page-col-content');   if ( pageContent ) { pageContent.classList.remove('xs12', 'lg9', 'xl10');      }
        } else if ( sideColumnPosition === true ) {
        } else if ( sideColumnPosition.toLowerCase() === "right" ) {
            insertAfter(sideColumn, sideColumn.nextElementSibling);
            var pageHeader  = main.querySelector('div.offset-lg-3.offset-xl-2'); if ( pageHeader  ) { pageHeader.classList.remove('offset-lg-3', 'offset-xl-2'); }
        }
    }

    /* Check to see if sideColumn is right-aligned, whether it is needed to apply pending or not */
    /* If sliding menu is pinned, apply padding, otherwise reset padding to 0 */
    if ( !mobileDevice ) {
        pageTitle = main.querySelector('div.is-page-header');
        if ( !pinMenu ) {
            if ( breadcrumbs ) { breadcrumbs.querySelector("div").style.setProperty('padding-left', '56px', 'important'); }
            if ( pageTitle && breadcrumbsHidden ) { pageTitle.style.setProperty('padding-left', '56px', 'important') };
            if ( sideColumn ) { sideColumn.style['padding-left'] = '16px'; }
            main.style.setProperty('padding-left', "0px", "important");
        } else {
            main.style.setProperty('padding-left', "256px", "important");
        }
    }

    /* Remove cards */
    var vCards = main.querySelectorAll('div.v-card.v-sheet');
    Array.from(vCards).forEach( (vCard) => {
        if ( removeTocCard      && vCard.querySelector('div[role=list]')    ) { vCard.remove(); removeTocCard      = false; }
        if ( removeTagCard      && vCard.innerHTML.includes("mdi-tag")      ) { vCard.remove(); removeTagCard      = false; }
        if ( removeBookmarkCard && vCard.innerHTML.includes("mdi-bookmark") ) { vCard.remove(); removeBookmarkCard = false; }
        /*if ( removeHistoryCard  && vCard.innerHTML.includes("mdi-history")  ) { vCard.remove(); removeHistoryCard  = false; }   // NOT WORKING for users that are not logged in, due to missing icon/link to view history */
        if ( removeHistoryCard  && ( vCard.innerHTML.includes("mdi-history") || ( vCard.innerHTML.includes("caption") && !vCard.innerHTML.includes('role="listitem"') && !vCard.innerHTML.includes("mdi-tag") ) ) ) { vCard.remove(); removeHistoryCard  = false; }   /* FIX: comparing if not tag card and has caption */

    });

    /* Modify PrismJS code blocks if needed (sibling based) */
    var nlnCodeBlocks = main.querySelectorAll('div.' + NO_LINE_NUMBERS_CLASS);
    Array.from(nlnCodeBlocks).forEach( (nlncb) => {
        removePrismJSLineNumbers(getNextSibling(nlncb, ".code-toolbar"));
        /*getNextSibling */
    });

    /* Activate Accordion FAQ */
    faccordion();

    if ( customizeVideoPlayer ) {   /* Setup video elements */
        setupVideoElements();
    }

    /* Disable Context Menu */
    /* disableGlobalContextMenu(); */

}


/* Callback executed when HTML footer tag was found with data-booted attribute set to true */
function customizeFooter(footer) {

}



/* HELPER FUNCTIONS - COLLAPSIBLE MENU */

/* [FUNCTION] Wrap group of items with a div tag */
Array.prototype.wrapGroup = function(className) {

    const wrapper = document.createElement('div');
    if ( className != "" ) { wrapper.className = className; }

    /* Wrap group */
    this.forEach((el) => {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    });

    /* Expand path to active page */
    this.forEach((el) => {
        el.childNodes[1].childNodes[0].nodeValue = getMenuItemInfo(el, "text");
        if ( el.href == curPathAbs ) {   /* This link's target is currently active (opened) */
            el.classList.add(CM_LNK_ACTIVE);
            /* Reveal path to the root of the menu */
            parent = el.parentNode;
            while ( parent && parent.classList.contains(CM_SECTION) ) {
                parent.classList.add(CM_SECTION_EXPANDED);                              /* COLLAPSIBLE ACTIVE?!?!?!?! */
                var lastParent = parent;
                parent = parent.parentNode;
            }
            lastParent.previousElementSibling.classList.toggle(CM_COLLAPSIBLE_ACTIVE);
        }

    });

}



function isNumeric(num){ return !isNaN(num) }



function headerAppendIcon(item, icon) {

    var appendIcon = document.createElement("div");
        appendIcon.className = "v-avatar v-list-item__avatar rounded-0 v-avatar--tile";
        appendIcon.style = "height: 24px; min-width: 24px; width: 24px;";
    var iTag = document.createElement("i");
        iTag.className = "v-icon notranslate " + icon + " theme--dark";
        iTag.setAttribute("aria-hidden", "true");
    appendIcon.insertBefore(iTag, appendIcon.firstChild);
    item.insertBefore(appendIcon, item.firstChild);

}



function sectionContainsActivePage(section) {

    if ( Array.isArray(section) ) {   /* Initial run; section is an array of wrapped menu items */
        var activeSection = Array.prototype.filter.call(section, function(el) { return el.matches('.' + CM_LNK_ACTIVE);});
        if ( activeSection && activeSection.length > 0 ) {  return true; }
    } else {   /* Run by event listener on section mouse click; section is DOM Node List */
        var activeSection = section.querySelector('.' + CM_LNK_ACTIVE);
        if ( activeSection ) {  return true; }
    }

    return false;

}



const fnmap = {
    'toggle': 'toggle',
    'show': 'add',
    'hide': 'remove'
};



const sectionState = (section, cmd) => {

    if ( !sectionContainsActivePage(section) ) {

        var sectionHeader = section.previousElementSibling;

        /* Get all expanded sections and collapse them, apply not active to section header, then expand current, so that expanded sections are not spawned */
        var expanded = section.parentNode.querySelectorAll('.' + CM_SECTION + '.' + CM_SECTION_EXPANDED);  /* Retrieves just one level up the path? */

        /* Iterate over expanded sections and toggle expanded/active state so that expanded sections are not spawned */
        expanded.forEach( function(expandedSection) {
            var expandedHeader = expandedSection.previousElementSibling;
            if ( expandedSection != section && !sectionContainsActivePage(expandedSection) && expandedHeader.href != curPathAbs ) {
                /* Toggle expanded/active state */
                expandedSection.classList[fnmap[cmd]](CM_SECTION_EXPANDED);
                expandedSection.previousElementSibling.classList[fnmap[cmd]](CM_COLLAPSIBLE_ACTIVE);
                expandedSection.previousElementSibling.classList[fnmap[cmd]](CM_COLLAPSIBLE_INACTIVE);
            }
        });
        /* Toggle expanded/active state for the section clicked on */
        section.classList[fnmap[cmd]](CM_SECTION_EXPANDED);
        section.previousElementSibling.classList[fnmap[cmd]](CM_COLLAPSIBLE_ACTIVE);
        section.previousElementSibling.classList[fnmap[cmd]](CM_COLLAPSIBLE_INACTIVE);
    }

}



/* FUNCTION - Group next siblings */
function groupItems(sibling) {

    var group = [];
    do {
        group.push(sibling);
        sibling = sibling.nextElementSibling;
    } while ( sibling && ( getMenuItemInfo(sibling, "level") == getMenuItemInfo(sibling.previousElementSibling, "level") ) )
    return group;

}



function getMenuItemInfo(menuItem, filter) {

    if ( !menuItem ) { return null; }
    filter = filter || "level";
    var menuItem = menuItem.innerText;
    /* if ( menuItem.indexOf("#mdi-") != -1 ) { return "mdi" + menuItem.replace(/(.*#mdi)(.*)(#.*)/, "$2"); } */

    var level = 0;
    var icon = menuItem.match(/#(mdi|fa)([\s\S]*?)#/gs);

    if ( icon ) {
        menuItem = menuItem.replace(icon[0], "");
        icon = icon[0].split("#")[1];
        if ( icon.toLowerCase().indexOf("mdi-") == 0 ) { icon = "mdi " + icon; }
    }

    var parts = menuItem.split("#");
    if ( parts.length > 1 ) {
        if ( isNumeric(parts[1]) ) {
            level = parseInt(parts[1]);
            var text = menuItem.replace("#" + parts[1] + "#", "");
        }
    } else { var text = menuItem; }

    if      ( filter == "level" ) { return level;    }
    else if ( filter == "text"  ) { return text;     }
    else if ( filter == "icon"  ) { return icon;     }
    else                          { return menuItem; }

}



function getMenuItemType(item) {

    if ( item.tagName ) {
        switch ( item.tagName.toLowerCase() ) {
            case "div":   return "HDR";   break;
            case "a":     return "LNK";   break;
            case "hr":    return "DVD";   break;
            default:      return null;
        }
    } else return null;

}


function getLoggedInUser() { return parseJwt(getCookie("jwt")).email; }

function parseJwt(token) { if ( !token ) { return; }; const base64Url = token.split('.')[1]; const base64 = base64Url.replace('-', '+').replace('_', '/'); return JSON.parse(window.atob(base64)); }

function setCookie(cName, cValue, cDays, cPath) { if ( !cPath || cPath == "" ) { cPath = "/"; }; if ( !cDays || cDays == "" ) { cDays = 365; }; document.cookie = cName + "=" + cValue + "; path=" + cPath + "; expires=" + new Date( Date.now() + cDays * 864e5); }
function getCookie(cName) { cName += "="; var allCookieArray = document.cookie.split(';'); for ( var i=0; i < allCookieArray.length; i++ ) { var temp = allCookieArray[i].trim(); if ( temp.indexOf(cName) == 0 ) { return temp.substring(cName.length, temp.length); } }; return ""; }


/* Formatting PrismJS to remove line numbers */
function removePrismJSLineNumbers(cb) { [].forEach.call(cb.getElementsByClassName("prismjs"), function(pr) { pr.classList.remove("line-numbers"); pr.childNodes[0].setAttribute("style", "margin-left: -2rem;"); pr.querySelector("span[class='line-numbers-rows']").remove(); }); }

function insertAfter(el, referenceNode)  { referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling); }
function insertBefore(el, referenceNode) { referenceNode.parentNode.insertBefore(el, referenceNode); }

function addListeners(el, events, fn) { events.split(' ').forEach(e => el.addEventListener(e, fn, false)); }



/* SLIDING MENU */

function menuClose(delay) {

    if ( !menuClosing && !menuOpening && isMouseOverNav !== true ) {

        menuClosing = true; menuOpened = false;
        if ( typeof delay != "number" ) { delay = 600; }
        setTimeout( function() {
            navigation.classList.remove('mad-nav-visible');
            navigation.classList.add('mad-nav-hidden');
            if ( sideColumn ) { sideColumn.style['padding-left'] = '16px'; }
            animatePmb("hide");
            /*if ( !pinMenu ) { animateRtt("hide"); animateRtt("show"); } */
            if ( !pinMenu ) { animateRtt("show"); }
            /*animateRtt("show"); */
        }, delay);
        setTimeout( function() { menuClosing = false; menuClosed = true; }, delay + 300);
    }

}


function menuOpen() {
    if ( !menuClosing && !menuOpening ) {
        menuOpening = true; menuClosed = false;
        navigation.classList.remove('mad-nav-hidden');
        navigation.classList.add('mad-nav-visible');
        if ( !pinMenu ) { animateRtt("hide"); }
        setTimeout( function () { animatePmb("show"); }, 500);
        setTimeout( function() {
            if ( !pinMenu && isMouseOverNav !== true ) { setTimeout( function() { menuClose()}, 100); }
            menuOpening = false; menuOpened = true;
        }, 800);
    }
}


function pmbShow() {

    animatePmb("show");

}



function pmbHide() {

    setTimeout( function () {
        animatePmb("hide");
    }, 500);

}



function navEvent() {

    if      ( event.type === "mouseenter" ) { isMouseOverNav = true; }
    else if ( event.type === "mouseleave" ) { isMouseOverNav = false; }
    else if ( event.type === "mouseover"  ) { isMouseOverNav = true; }


    if ( mbHolder.contains(event.relatedTarget) ) {   /* Don't show pmb if nav entered from mbholder + animate on show when menuopens */
    } else if ( !pmbHolder.contains(event.relatedTarget) ) {
        if ( event.type === "mouseenter" ) { pmbShow(); }
        if ( event.type === "mouseleave" ) {
            if ( pinMenu ) {
                pmbHide();
            } else {
                menuClose();
            }
        }
    }

}



function pmbEvent() {

    if ( event.type === "mouseup" ) {
        toggleMenuPin();
    } else if ( main.contains(event.relatedTarget) ) {
        if ( event.type === "mouseleave" ) {
            if ( pinMenu ) {
                pmbHide();
            } else {
                menuClose();
            }
        }
    }

}



function toggleMenuPin() {

    if ( document.activeElement ) { document.activeElement.blur(); }
    pinMenu = !pinMenu;
    setCookie(COOKIE_NAME, pinMenu, COOKIE_DAYS);
    if ( pinMenu ) {  /* Pin menu */
        menuOpen();
        if ( breadcrumbs ) { breadcrumbs.querySelector("div").style.removeProperty('padding-left'); }
        if ( pageTitle && breadcrumbsHidden ) { pageTitle.style.removeProperty('padding-left') };
        pmb.classList.remove(icon_pinOn);
        pmb.classList.add(icon_pinOff);
        main.style.setProperty('padding-left', "256px", "important"); main.style['transition-timing-function'] = 'ease-in'; main.style.transition = '0.5s padding ease-out';
        if ( btnToTop && btnToTop.style.left != "235px" ) { btnToTop.style.left = "235px"; }
        if ( btnToTopVisible ) { animateRtt("show"); }
    } else { /* Unpin menu */
        if ( breadcrumbs ) { breadcrumbs.querySelector("div").style.setProperty('padding-left', '56px', 'important'); }
        if ( pageTitle && breadcrumbsHidden ) { pageTitle.style.setProperty('padding-left', '56px', 'important') };
        animateRtt("hide");
        pmb.classList.remove(icon_pinOff);
        pmb.classList.add(icon_pinOn);
        main.style.setProperty('padding-left', "0px", "important"); main.style['transition-timing-function'] = 'ease-out'; main.style.transition = '0.5s padding ease-out';
        /*menuClose(50); */
        /*if ( btnToTop && btnToTop.style.left != "5px" ) { btnToTop.style.left = "5px"; } */
    }

}



function animatePmb(action) {

    if ( action.toLowerCase() == "show" ) {
        pmbHolder.classList.add( 'fab-transition-enter', 'fab-transition-enter-active');
        navigation.parentNode.insertBefore(pmbHolder, navigation.nextSibling);
        setTimeout(function() {
            pmbHolder.classList.remove('fab-transition-enter');
            pmbHolder.classList.add('fab-transition-enter-to');
            pmbHolder.classList.remove('fab-transition-enter-active', 'fab-transition-enter-to');
        }, 300);
    } else if ( action.toLowerCase() == "hide" ) {
        pmbHolder.classList.add('fab-transition-leave', 'fab-transition-leave-active');
        pmbHolder.classList.remove('fab-transition-leave');
        pmbHolder.classList.add('fab-transition-leave-to');
        setTimeout(function() {
            pmbHolder.classList.remove('fab-transition-leave-active', 'fab-transition-leave-to');
            pmbHolder.remove();
        }, 300);
    }

}


function animateRtt(action) {   /* Return to top */

    /*btnToTop   = document.querySelector("button[aria-label='Return to top']");   // Not working with localization because aria-label is language specific */
    btnToTop = document.querySelector("i.mdi-arrow-up");

    if ( btnToTop ) {  /* Retun to top button customization */
        btnToTop = btnToTop.closest("button");
        if ( action.toLowerCase() == "show" ) {
            setTimeout(function() {
                btnToTop.classList.remove('fab-transition-leave-active', 'fab-transition-leave-to');
                btnToTop.classList.add( 'fab-transition-enter', 'fab-transition-enter-active');
                setTimeout(function() {
                    btnToTop.classList.remove('fab-transition-enter');
                    btnToTop.classList.add('fab-transition-enter-to');
                    btnToTop.classList.remove('fab-transition-enter-active', 'fab-transition-enter-to');
                }, 300);
            }, 300);
        } else if ( action.toLowerCase() == "hide" ) {
            moStop();
            btnToTop.classList.add('fab-transition-leave', 'fab-transition-leave-active');
            btnToTop.classList.remove('fab-transition-leave');
            btnToTop.classList.add('fab-transition-leave-to');
            setTimeout( function() { moStart(); }, 100);
        }
    }

}


function handleMouseMove(event) {
/* https://stackoverflow.com/questions/7790725/javascript-track-mouse-position */

    var eventDoc, doc, body;

    event = event || window.event; /* IE-ism */

    /* If pageX/Y aren't available and clientX/Y are, calculate pageX/Y - logic taken from jQuery. (This is to support old IE) */
    if ( event.pageX == null && event.clientX != null ) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;
        event.pageX = event.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
        event.pageY = event.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    var edge = leftEdge || 2;
    if ( navigation ) {
        if ( event.pageX < edge && !pinMenu && mouseLeftEdgeOpensMenu && !menuClosing && !menuOpening && !menuOpened ) { menuOpen(); }
        if ( menuFirstHover ) { menuFirstHover = false; isMouseOverNav = isDescendant(navigation, document.elementFromPoint(event.pageX, event.pageY)); }
        /*if ( isDescendant(navigation, document.elementFromPoint(event.pageX, event.pageY)) ) { isMouseOverNav } */
    }
}


var getNextSibling = function (elem, selector) {

    /* Get the next sibling element */
    var sibling = elem.nextElementSibling;

    /* If there's no selector, return the first sibling */
    if ( !selector ) return sibling;

    /* If the sibling matches our selector, use it. If not, jump to the next sibling and continue the loop */
    while ( sibling ) {
        if ( sibling.matches(selector) ) return sibling;
        sibling = sibling.nextElementSibling
    }

};


var getPreviousSibling = function (elem, selector) {

    /* Get the next sibling element */
    var sibling = elem.previousElementSibling;

    /* If there's no selector, return the first sibling */
    if ( !selector ) return sibling;

    /* If the sibling matches our selector, use it. If not, jump to the previous sibling and continue the loop */
    while ( sibling ) {
        if ( sibling.matches(selector) ) return sibling;
        sibling = sibling.previousElementSibling;
    }

};



var setupVideoElements = function() {

    document.querySelectorAll("div.mad-wjsc-video").forEach(container => {
        var video = container.querySelector("video");
        if ( video.addEventListener ) { video.addEventListener('contextmenu', function(e) { e.preventDefault(); }, false); } else { video.attachEvent('oncontextmenu', function() { window.event.returnValue = false; }); }
        if ( video.addEventListener ) { video.addEventListener('selectstart', function(e) { e.preventDefault(); }, false); } else { video.attachEvent('onselectstart', function() { window.event.returnValue = false; }); }
        if ( video.addEventListener ) { video.addEventListener('dragstart',   function(e) { e.preventDefault(); }, false); } else { video.attachEvent('ondragstart',   function() { window.event.returnValue = false; }); }
        video.controlsList = "nodownload noremoteplayback";
        video.controls = true;           
    });

}



var disableGlobalContextMenu = function() {
    document.getElementById("root").addEventListener( "contextmenu", function(e) { e.preventDefault(); } );
}



var faccordion = function () {

    if ( !Element.prototype.matches ) { Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector; }

    /* Plain JS slideToggle https://github.com/ericbutler555/plain-js-slidetoggle */
    function slideToggle(t,e,o){0===t.clientHeight?j(t,e,o,!0):j(t,e,o)}; function slideUp(t,e,o){j(t,e,o)}; function slideDown(t,e,o){j(t,e,o,!0)}; function j(t,e,o,i){void 0===e&&(e=400),void 0===i&&(i=!1),t.style.overflow="hidden",i&&(t.style.display="block");var p,l=window.getComputedStyle(t),n=parseFloat(l.getPropertyValue("height")),a=parseFloat(l.getPropertyValue("padding-top")),s=parseFloat(l.getPropertyValue("padding-bottom")),r=parseFloat(l.getPropertyValue("margin-top")),d=parseFloat(l.getPropertyValue("margin-bottom")),g=n/e,y=a/e,m=s/e,u=r/e,h=d/e;window.requestAnimationFrame(function l(x){void 0===p&&(p=x);var f=x-p;i?(t.style.height=g*f+"px",t.style.paddingTop=y*f+"px",t.style.paddingBottom=m*f+"px",t.style.marginTop=u*f+"px",t.style.marginBottom=h*f+"px"):(t.style.height=n-g*f+"px",t.style.paddingTop=a-y*f+"px",t.style.paddingBottom=s-m*f+"px",t.style.marginTop=r-u*f+"px",t.style.marginBottom=d-h*f+"px"),f>=e?(t.style.height="",t.style.paddingTop="",t.style.paddingBottom="",t.style.marginTop="",t.style.marginBottom="",t.style.overflow="",i||(t.style.display="none"),"function"==typeof o&&o()):window.requestAnimationFrame(l)})}

    /* jQuery Alternatives */
    var is = function (elem, selector){ if ( selector.nodeType ) { return elem === selector; } var qa = ( typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector ), length = qa.length, returnArr = []; while ( length-- ) { if ( qa[length] === elem ) { return true; } } return false; }
    var siblings = function ( el, selector ) { if ( !Element.prototype.matches ) { Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector; } var siblings = []; for ( let sibling of el.parentNode.children ) { if ( sibling !== el && sibling.matches(selector) ) { siblings.push(sibling); } } return siblings; }
    var nextUntil = function (el, selector, filter) { var siblings = []; el = el.nextElementSibling; while ( el ) { if ( el.matches(selector) ) { break }; if ( filter && !el.matches(filter) ) { el = el.nextElementSibling; continue; } siblings.push(el); el = el.nextElementSibling; } return siblings; };
    var nextAll = function (el, selector) { var next = []; let siblings = el.parentElement.children; let found = false; for ( let i=0; i<siblings.length; i++ ) { if ( !found && el === siblings[i] ) { found = true; continue; } else if ( found && siblings[i].matches( selector ) ) { next.push(siblings[i]); } } return next; };


    /* FUNCTIONS */
    var toggleElementVisibility = function ( el ) { if ( el && el.classList ) { el.classList.toggle('show'); slideToggle(el, 350); }}
    var hideElement             = function ( el ) { if ( el && el.classList ) { el.classList.remove('show'); slideUp(el, 350);     }}
    var toggleExpandIcon        = function ( el ) { if ( el && el.classList ) { el.classList.toggle('collapsed'); el.classList.toggle('expanded'); }}

    document.querySelectorAll("div.faccordion").forEach( pel => {
        /* Wrap header nodes text content inside separate <div> element */
        pel.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach( el => {
            var target = document.createElement("div");
            target.classList.add('inner');
            nextUntil( el, 'ul' ).forEach( next => { next.parentNode.insertBefore(target, next); /*next.parentNode.removeChild(next);*/ target.appendChild(next); });
        });
        /* Main Initialization */
        pel.querySelectorAll("ul h1,h2,h3,h4,h5,h6").forEach( el => { el.classList.remove('toc-header'); });
        if ( pel.querySelector("ul") ) pel.querySelector("ul").classList.add('faccordion');
        pel.querySelectorAll("ul ul").forEach( el => { el.classList.add('inner'); });
        pel.querySelectorAll("ul h1,h2,h3,h4,h5,h6").forEach( el => { el.classList.add('toggle', 'show'); });
        pel.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach( header => { Array.prototype.slice.call(header.parentNode.children).forEach( child => { if ( child.parentNode.querySelectorAll("div .inner").length ) { header.classList.add('collapsed'); } else { header.classList.add('single'); } }); });
    });

    /* Main */
    document.querySelectorAll('.toggle').forEach( toggle => { toggle.onclick = function(e) {

        e.preventDefault();

        if ( is( toggle.nextElementSibling, 'div.inner' ) ) {
            toggleExpandIcon( toggle );
                
            let allNext = nextAll( toggle, ':not(div)' );
            if ( allNext[0] && allNext[0].classList.contains('show') ) {
                hideElement( allNext[0] );
                /*allNext.forEach( next => { hideElement(next); } ); */
                toggle.parentNode.querySelectorAll('.toggle.show.expanded').forEach( childToggle => { let childAllNext = nextAll( childToggle, ':not(div)' ); toggleExpandIcon( childToggle ); toggleElementVisibility( childToggle.nextElementSibling ); toggleElementVisibility( childAllNext[0] ); } );
                toggleElementVisibility( toggle.nextElementSibling );
            } else {
                siblings(toggle.closest('li'), 'li').forEach( sibling => {
                    sibling.querySelectorAll('.inner').forEach( inner => { hideElement(inner); } );
                    sibling.querySelectorAll('.toggle').forEach( inToggle => { if ( inToggle.classList.contains('expanded') ) { toggleExpandIcon( inToggle ); } } );
                } );
                toggleElementVisibility( toggle.nextElementSibling );
                toggleElementVisibility( allNext[0] );
            }
        } else {
            if ( toggle.nextElementSibling.classList.contains('show') ) {
                hideElement( toggle.nextElementSibling );
            } else {
                toggleElementVisibility( toggle.nextElementSibling );
            }
        }

    }});

}




function jsSleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function sleep(wait) { await jsSleep(wait); }


function isDescendant(parent, child) { var node = child.parentNode; while (node != null) { if (node == parent) { return true; } node = node.parentNode; } return false; }