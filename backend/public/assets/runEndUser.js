isQrveyScript = (node) => {
    return node.tagName === 'SCRIPT' && (node.src.includes('qrvey') || node.src.includes('panel'));
}

checkNodes = (nodes, pb, default_mode) => {
    nodes.forEach(node => {
        endUser = !pb ? document.querySelector('qeu-end-user') : document.querySelector('qpb-root');
        if (endUser && endUser.shadowRoot && !inserted) {

            if (pb) {

                if (default_mode) {
                    customEUStyle += `
                .qpb-bottom-bar-action.qpb-pages-bottom-bar-menu-trigger, .qpb-bottom-bar-action.qpb-add-more-tabs, .qpb-barmenu-selector:nth-child(1),
                .qpb-navigation-link:nth-child(2), .qpb-navigation-link:nth-child(3),
                .qpb-publish-container > *,
                qpb-editable-tab qui-dropdownv2 > *, 
                .qpb-pages-selector-drop.qpb-insert-menu-container .qpb-insert-selector-option:nth-child(2),
                .qpb-pages-selector-drop.qpb-insert-menu-container .qpb-insert-selector-option:nth-child(3),
                .qpb-pages-selector-drop.qpb-insert-menu-container .qpb-insert-selector-option:nth-child(7),
                .qpb-pages-selector-drop.qpb-insert-menu-container .qpb-insert-selector-option:nth-child(8),
                .qpb-pages-selector-drop.qpb-insert-menu-container .qpb-insert-selector-option:nth-child(9),
                .qpb-item-topbar-container-center qui-dropdownv2:nth-child(1),
                .qpb-item-topbar-container-center qui-dropdownv2:nth-child(11),
                .qpb-item-topbar-container-center qui-dropdownv2:nth-child(12),
                .qpb-item-topbar-container-center qpb-topbar-menu-icon:nth-child(7),qpb-bottombar, 
                qpb-blue-topbar, .qpb-pages-bar .qpb-item-topbar-container-right{
                    display: none !important;
                    visibility: hidden !important;
                }
                .qpb-page-builder-container .qpb-page-builder-editor-container .horizontal-container{
                    height: calc(100% - 40px) !important;
                }
                .qpb-page-builder-container .qpb-page-builder-editor-container{
                    height: 100% !important;
                    z-index: 1 !important;
                }
                `;
                }


                if (document.querySelector('qpb-root') && document.querySelector('qrvey-loader')) {
                    let loader = document.querySelector('qrvey-loader');
                    loader.querySelector('.qpb-qrvey-loading-container').style.cssText = 'background-color:#FFF';
                    loader.classList.add("temp-loader");
                    document.querySelector('qrvey-builders').appendChild(loader);
                }
            }
            // Styles for EndUser Shell
            let already_there = false;
            let allStyles = endUser.shadowRoot.querySelectorAll('style');
            for (let index = 0; index < allStyles.length; index++) {
                const style_el = allStyles[index];
                if (style_el.qid && style_el.qid == 'baseEU_custom') {
                    already_there = true;
                    break;
                }
            }

            if (!already_there) {
                let style = document.createElement('style');
                style.innerHTML = customEUStyle;
                style.qid = "baseEU_custom";
                endUser.shadowRoot.appendChild(style);
            }

            loadCSS(endUser, widgetCSSurl, 0).then(() => {

                // AN Panel
                window.customElements.whenDefined('an-panel').then(function () {
                    if (!endUser || !endUser.shadowRoot) return;
                    let panels = endUser.shadowRoot.querySelectorAll('an-panel');
                    if (panels.length > 0) {
                        document.querySelector('qrvey-end-user') && document.querySelector('qrvey-end-user').classList.remove("loading-qv-end-user");

                        // Styles to panels
                        for (let index = 0; index < panels.length; index++) {
                            const element = panels[index];

                            // Custom CSS Rules
                            let already_there = false;
                            let allStyles = element.shadowRoot.querySelectorAll('style');
                            for (let index = 0; index < allStyles.length; index++) {
                                const style_el = allStyles[index];
                                if (style_el.qid && style_el.qid == 'anpanels_custom') {
                                    already_there = true;
                                    break;
                                }
                            }

                            if (!already_there) {
                                let anStyles = document.createElement('style');
                                anStyles.innerHTML = customEUStyle;
                                anStyles['qid'] = "anpanels_custom";
                                element.shadowRoot.appendChild(anStyles);
                            }

                            // StyleSheet
                            for (let index2 = 0; index2 < widgetCSSurl.length; index2++) {
                                const url = widgetCSSurl[index2];
                                let stylesheet = document.createElement('link');
                                stylesheet.href = url;
                                stylesheet.rel = "stylesheet";
                                stylesheet.type = "text/css";
                                element.shadowRoot.appendChild(stylesheet);
                            }

                        }

                        let anFilterModal;
                        window.customElements.whenDefined('an-filter-builder-modal').then(function () {
                            anFilterModal = endUser.shadowRoot.querySelectorAll('an-filter-builder-modal');
                            if (anFilterModal.length > 0) {

                                // Styles to anFilterModal
                                for (let index = 0; index < anFilterModal.length; index++) {
                                    const element = anFilterModal[index];

                                    // Custom CSS Rules
                                    let already_there = false;
                                    let allStyles = element.shadowRoot.querySelectorAll('style');
                                    for (let index = 0; index < allStyles.length; index++) {
                                        const style_el = allStyles[index];
                                        if (style_el.qid && style_el.qid == 'anfilterbuilder_custom') {
                                            already_there = true;
                                            break;
                                        }
                                    }

                                    if (!already_there) {
                                        let anStyles = document.createElement('style');
                                        anStyles.innerHTML = customEUStyle;
                                        anStyles['qid'] = "anfilterbuilder_custom";
                                        element.shadowRoot.appendChild(anStyles);
                                    }


                                    // StyleSheet
                                    for (let index2 = 0; index2 < widgetCSSurl.length; index2++) {
                                        const url = widgetCSSurl[index2];
                                        let stylesheet = document.createElement('link');
                                        stylesheet.href = url;
                                        stylesheet.rel = "stylesheet";
                                        stylesheet.type = "text/css";
                                        element.shadowRoot.appendChild(stylesheet);
                                    }
                                }



                            }
                        });

                        window.customElements.whenDefined('an-chart-builder-embed').then(function () {
                            let cb = document.querySelector('an-chart-builder-embed');
                            if (cb) {

                                // Custom CSS Rules
                                let already_there = false;
                                let allStyles = cb.shadowRoot.querySelectorAll('style');
                                for (let index = 0; index < allStyles.length; index++) {
                                    const style_el = allStyles[index];
                                    if (style_el.qid && style_el.qid == 'anchartbuilder_custom') {
                                        already_there = true;
                                        break;
                                    }
                                }

                                if (!already_there) {
                                    let anStyles = document.createElement('style');
                                    anStyles.innerHTML = customEUStyle;
                                    anStyles['qid'] = "anchartbuilder_custom";
                                    cb.shadowRoot.appendChild(anStyles);
                                }

                            }
                        })


                        // filterBuilder
                        // window.customElements.whenDefined('an-filter-builder').then(function () {

                        // });

                        // datePicker
                        window.customElements.whenDefined('qui-datepicker').then(function () {

                            let pickers = endUser.shadowRoot.querySelectorAll('qui-datepicker');
                            if (pickers.length > 0) {

                                // Styles to datePickers
                                for (let index = 0; index < pickers.length; index++) {
                                    const element = pickers[index];

                                    // Custom CSS Rules
                                    let already_there = false;
                                    let allStyles = element.shadowRoot.querySelectorAll('style');
                                    for (let index = 0; index < allStyles.length; index++) {
                                        const style_el = allStyles[index];
                                        if (style_el.qid && style_el.qid == 'datepicker_custom') {
                                            already_there = true;
                                            break;
                                        }
                                    }

                                    if (!already_there) {
                                        let anStyles = document.createElement('style');
                                        anStyles.innerHTML = customEUStyle;
                                        anStyles['qid'] = "datepicker_custom";
                                        element.shadowRoot.appendChild(anStyles);
                                    }

                                    // StyleSheet
                                    for (let index2 = 0; index2 < widgetCSSurl.length; index2++) {
                                        const url = widgetCSSurl[index2];
                                        let stylesheet = document.createElement('link');
                                        stylesheet.href = url;
                                        stylesheet.rel = "stylesheet";
                                        stylesheet.type = "text/css";
                                        element.shadowRoot.appendChild(stylesheet);
                                    }
                                }


                                // mutation.disconnect();
                                // inserted = true;
                            }
                        });


                    }



                });

                window.customElements.whenDefined('qui-drawer-menu').then(function () {
                    drawerMenu = endUser.shadowRoot.querySelector('qui-drawer-menu');
                    if (drawerMenu) {

                        // Custom CSS Rules
                        let already_there = false;
                        let allStyles = drawerMenu.shadowRoot.querySelectorAll('style');
                        for (let index = 0; index < allStyles.length; index++) {
                            const style_el = allStyles[index];
                            if (style_el.qid && style_el.qid == 'drawerMenu_custom') {
                                already_there = true;
                                break;
                            }
                        }

                        if (!already_there) {
                            let anStyles = document.createElement('style');
                            anStyles.innerHTML = customEUStyle;
                            anStyles['qid'] = "drawerMenu_custom";
                            drawerMenu.shadowRoot.appendChild(anStyles);
                        }
                    }
                });

                window.customElements.whenDefined('qui-action-menu').then(function () {
                    if (!endUser || !endUser.shadowRoot) return;
                    actionMenu = endUser.shadowRoot.querySelector('qui-action-menu');
                    if (actionMenu) {

                        // Custom CSS Rules
                        let already_there = false;
                        let allStyles = actionMenu.shadowRoot.querySelectorAll('style');
                        for (let index = 0; index < allStyles.length; index++) {
                            const style_el = allStyles[index];
                            if (style_el.qid && style_el.qid == 'actionMenu_custom') {
                                already_there = true;
                                break;
                            }
                        }

                        if (!already_there) {
                            let anStyles = document.createElement('style');
                            anStyles.innerHTML = customEUStyle;
                            anStyles['qid'] = "actionMenu_custom";
                            actionMenu.shadowRoot.appendChild(anStyles);
                        }
                    }
                });

                window.customElements.whenDefined('qui-rich-editorv2').then(function () {
                    if (!endUser || !endUser.shadowRoot) return;
                    let editor = endUser.shadowRoot.querySelectorAll('qui-rich-editorv2');
                    if (editor.length > 0) {
                        for (let index = 0; index < editor.length; index++) {
                            const element = editor[index];

                            // Custom CSS Rules
                            let anStyles = document.createElement('style');
                            anStyles.innerHTML = customEUStyle;
                            anStyles['qid'] = "richeditor_custom";
                            let iframe = element.shadowRoot.querySelectorAll('iframe');
                            if (iframe && iframe[0]) {

                                let already_there = false;
                                let allStyles = iframe[0].contentDocument.body.querySelectorAll('style');
                                for (let index = 0; index < allStyles.length; index++) {
                                    const style_el = allStyles[index];
                                    if (style_el.qid && style_el.qid == 'richeditor_custom') {
                                        already_there = true;
                                        break;
                                    }
                                }

                                if (!already_there) {
                                    iframe[0].contentDocument.body.appendChild(anStyles);
                                }

                            }

                            // StyleSheet
                            for (let index2 = 0; index2 < widgetCSSurl.length; index2++) {
                                const url = widgetCSSurl[index2];
                                let stylesheet = document.createElement('link');
                                stylesheet.href = url;
                                stylesheet.rel = "stylesheet";
                                stylesheet.type = "text/css";
                                element.shadowRoot.querySelectorAll('iframe')[0].contentDocument.body.appendChild(stylesheet);
                            }
                        }
                    }
                });


            })
        }

        var CSS_FONTS = document.querySelectorAll('link');
        for (let index = 0; index < CSS_FONTS.length; index++) {
            const element = CSS_FONTS[index];
            if (element.href.includes('qrvey-end-user/styles.css')) {
                element.remove();
            }
        }

        if (pb) {
            document.querySelector('qrvey-loader.temp-loader') && document.querySelector('qrvey-loader.temp-loader').remove();
        }
    })
}

checkPBNodes = (nodes) => {
    nodes.forEach(node => {
        const pageBuilderRoot = document.querySelector('qpb-root');
        const pageBuilder = document.querySelector('qrvey-builders');

        if (pageBuilderRoot && document.querySelector('qrvey-loader')) {
            let loader = document.querySelector('qrvey-loader');
            loader.querySelector('.qpb-qrvey-loading-container').style.cssText = 'background-color:#FFF';
            loader.classList.add("temp-loader");
            pageBuilder.appendChild(loader);
        }

        if (pageBuilderRoot.shadowRoot) {

            let att = pageBuilder.getAttribute('settings') || 'EUsetting';

            let css_text = `
            .qpb-bottom-bar-action.qpb-pages-bottom-bar-menu-trigger, .qpb-bottom-bar-action.qpb-add-more-tabs, .qpb-barmenu-selector:nth-child(1),
            .qpb-navigation-link:nth-child(2), .qpb-navigation-link:nth-child(3),
            .qpb-publish-container > *,
            qpb-editable-tab qui-dropdownv2 > *, 
            .qpb-pages-selector-drop.qpb-insert-menu-container .qpb-insert-selector-option:nth-child(2),
            .qpb-pages-selector-drop.qpb-insert-menu-container .qpb-insert-selector-option:nth-child(3),
            .qpb-pages-selector-drop.qpb-insert-menu-container .qpb-insert-selector-option:nth-child(7),
            .qpb-pages-selector-drop.qpb-insert-menu-container .qpb-insert-selector-option:nth-child(8),
            .qpb-pages-selector-drop.qpb-insert-menu-container .qpb-insert-selector-option:nth-child(9),
            .qpb-item-topbar-container-center qui-dropdownv2:nth-child(1),
            .qpb-item-topbar-container-center qui-dropdownv2:nth-child(11),
            .qpb-item-topbar-container-center qui-dropdownv2:nth-child(12),
            .qpb-item-topbar-container-center qpb-topbar-menu-icon:nth-child(7),qpb-bottombar, 
            qpb-blue-topbar, .qpb-pages-bar .qpb-item-topbar-container-right{
                display: none !important;
                visibility: hidden !important;
            }
            .qpb-page-builder-container .qpb-page-builder-editor-container .horizontal-container{
                height: calc(100% - 40px) !important;
            }
            .qpb-page-builder-container .qpb-page-builder-editor-container{
                height: 100% !important;
                z-index: 1 !important;
            }
            `;
            let style = document.createElement('style');
            style.innerHTML = css_text;
            pageBuilderRoot.shadowRoot.appendChild(style);
            document.querySelector('qrvey-loader.temp-loader') && document.querySelector('qrvey-loader.temp-loader').remove();

        }
    })
}

function runEndUser(pb, default_mode = true) {
    inserted = false;
    var globalStyle = `.loading-qv-end-user {
        display: none;
    }`;
    let globalRule = document.createElement('style');
    globalRule.innerHTML = globalStyle;
    document.body.appendChild(globalRule);

    const endUser = !pb ? document.querySelector('qrvey-end-user') : document.querySelector('qrvey-builders');

    if (endUser) {

        if (typeof customEUStyle === 'undefined') {
            customEUStyle = '';
            var att = endUser.getAttribute('settings') || 'EUsetting';
            if (window[att].customCSSRules) {
                customEUStyle = window[att].customCSSRules;
            }
        }

        try {
            var att = endUser.getAttribute('settings') || 'EUsetting';
            widgetCSSurl = window[att].styleUrls ? window[att].styleUrls : [];
        } catch (error) {
            widgetCSSurl = [];
        }

        mutation = new MutationObserver(mutationList => {
            mutationList.forEach((mutation) => checkNodes(mutation.addedNodes, pb, default_mode));
        });

        window.customElements.whenDefined('qrvey-end-user').then(function () {
            mutation.observe(document.body, {
                childList: true,
            });
        })
    }


    loadPanels();
}

function runPageBuilder() {
    const pageBuilder = document.querySelector('qrvey-builders');
    var att = pageBuilder.getAttribute('settings') || 'EUsetting';

    if (pageBuilder) {

        mutation2 = new MutationObserver(mutationList => {
            mutationList.forEach((mutation) => checkPBNodes(mutation.addedNodes));
        });

        window.customElements.whenDefined('qrvey-builders').then(function () {
            mutation2.observe(document.body, {
                childList: true,
            });
        })
    }
}

function loadPanels() {
    const panelsAN = document.querySelectorAll('an-panel');
    if (panelsAN.length > 0) {
        if (!panelsAN[0].shadowRoot) {
            setTimeout(() => {
                loadPanels();
            }, 1000);
        } else {


            // Styles to panels
            for (let index = 0; index < panelsAN.length; index++) {
                const element = panelsAN[index];

                // Custom CSS Rules
                let anStyles = document.createElement('style');
                anStyles.innerHTML = customEUStyle;
                element.shadowRoot.appendChild(anStyles);
                let panelCSs = window[element.getAttribute("config")].styleUrls;
                // StyleSheet
                if (panelCSs && panelCSs.length > 0) {
                    for (let index2 = 0; index2 < panelCSs.length; index2++) {
                        const url = panelCSs[index2];
                        let stylesheet = document.createElement('link');
                        stylesheet.href = url;
                        stylesheet.rel = "stylesheet";
                        stylesheet.type = "text/css";
                        element.shadowRoot.appendChild(stylesheet);
                    }
                }

                element.classList.remove("loading-qv-end-user");

            }
            inserted = true;
        }

    }
}

function loadCSS(endUser, urls, i) {
    return new Promise(resolve => {
        if (!urls || urls.length == 0) return resolve();
        var url = urls[i];
        var link = document.createElement('link');
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.onload = function () {
            if (urls.length < i) {
                resolve(loadCSS(urls, i++))
            }
            return resolve();
        }
        link.setAttribute("href", url);
        endUser.shadowRoot.appendChild(link);
    })
}

window.addEventListener('openFilterBuilder', function (event) {
    setTimeout(() => {

        let cb = document.querySelector('an-chart-builder-embed');
        if (cb) {
            window.customElements.whenDefined('an-filter-builder-modal').then(function () {
                anFilterModal = cb.shadowRoot.querySelectorAll('an-filter-builder-modal');
                // Styles to anFilterModal
                for (let index = 0; index < anFilterModal.length; index++) {
                    const element = anFilterModal[index];

                    // Custom CSS Rules
                    let already_there = false;
                    let allStyles = element.shadowRoot.querySelectorAll('style');
                    for (let index = 0; index < allStyles.length; index++) {
                        const style_el = allStyles[index];
                        if (style_el.qid && style_el.qid == 'openfilterbuilder_custom') {
                            already_there = true;
                            break;
                        }
                    }

                    if (!already_there) {
                        let anStyles = document.createElement('style');
                        anStyles.innerHTML = customEUStyle;
                        anStyles['qid'] = "openfilterbuilder_custom";
                        element.shadowRoot.appendChild(anStyles);
                    }

                    // StyleSheet
                    for (let index2 = 0; index2 < widgetCSSurl.length; index2++) {
                        const url = widgetCSSurl[index2];
                        let stylesheet = document.createElement('link');
                        stylesheet.href = url;
                        stylesheet.rel = "stylesheet";
                        stylesheet.type = "text/css";
                        element.shadowRoot.appendChild(stylesheet);
                    }
                }
            })
        }

    }, 200);


}, false);


document.addEventListener('DOMNodeInserted', e => {
    if (e.target.nodeName === 'AN-QV-POPUP-MENU') {
        e.target.shadowRoot.append(Object.assign(
            document.createElement('style'),
            { innerHTML: customEUStyle }
        ));
    }
});