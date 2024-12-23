const { webContents, ipcRenderer } = require('electron');
 
async function injectScript(scriptName) {
    try {
        console.log(`AntiCMSP Browser: Injetando "${scriptName}"...`);
        const scriptResponse = await fetch(`./scripts/${scriptName}.js`);
        const script = await scriptResponse.text();

        if (scriptResponse.status === 200) {
            const webview = document.querySelector('webview');

            webview.executeJavaScript(script).then(() => {
                console.log(`AntiCMSP Browser: "${scriptName}" foi injetado.`)
            });
        }
    } catch {
        console.log(`AntiCMSP Browser: Erro ao injetar "${scriptName}."`)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const backPage = document.querySelector('#backPage');
    const forwardPage = document.querySelector('#forwardPage');
    const reloadPage = document.querySelector('#reloadPage');
    const tamperTurkey = document.querySelector('#tamperTurkeyInject');
    const hamburgerButton = document.querySelector('#hamburger');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const hamburgerClose = document.querySelector('#hamburger-menu-close');
    const urlBar = document.querySelector('#searchBar');
    const page = document.querySelector('webview');
    const themeSwitchOption = document.querySelector('[data-content="themeswitch"]');

    function applyTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');

            tamperTurkey.querySelector('img').style.filter = 'invert()';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');

            tamperTurkey.querySelector('img').style.filter = 'none';
        }
    }

    setInterval(applyTheme, 500);

    let lastUrl = '';
    setInterval(() => {
        try {
            if (page.getURL() !== lastUrl) {
                if (page.getURL().includes(location.origin)) {
                    lastUrl = page.getURL();
                    urlBar.value = 'https://anticmsp-browser.net/';
                } else {
                    lastUrl = page.getURL();
                    urlBar.value = page.getURL();
                }
            }
        } catch {
            console.log('AntiCMSP Browser: Erro ao tentar pegar a URL do site.');
        }
    }, 500);

    function searchText(text) {   
        let searchUrl = '';
        let searchEngine = localStorage.getItem('engine') || 'Google';
    
        switch (searchEngine) {
            case 'Google':
                searchUrl = 'https://google.com/search?q=';
                break;
            case 'Yahoo!':
                searchUrl = 'http://search.yahoo.com/search?p=';
                break;
            case 'Bing':
                searchUrl = 'https://www.bing.com/search?q=';
                break;
            case 'DuckDuckGo':
                searchUrl = 'https://duckduckgo.com/?q=';
                break;
            default:
                searchUrl = 'https://google.com/search?q=';
                break;
        }
    
        page.src = searchUrl + encodeURIComponent(text);
    };

    urlBar.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            const inputText = urlBar.value.trim();

            function isValidURL(text) {
                try {
                    new URL(text);
                    return true;
                } catch {
                    return false;
                }
            }

            if (isValidURL(inputText)) {
                try {
                    const response = await fetch(inputText);
                    if (response.ok) {
                        page.src = inputText;
                    } else {
                        page.src = './main.html';
                    }
                } catch {
                    page.src = './main.html';
                }
            } else {
                searchText(inputText);
            }

            document.activeElement.blur();
        }
    });

    backPage.addEventListener('click', () => {
        page.executeJavaScript('history.back();');
    });

    forwardPage.addEventListener('click', () => {
        page.executeJavaScript('history.forward();');
    });

    reloadPage.addEventListener('click', () => {
        page.executeJavaScript('location.reload();');
        const icon = reloadPage.querySelector('i');
        if (icon) {
            icon.classList.add('spin');

            setTimeout(() => {
                icon.classList.remove('spin');
            }, 1000);
        }
    });

    tamperTurkey.addEventListener('click', async () => {
        const tamperTurkeyScriptResponse = await fetch('https://raw.githubusercontent.com/JuniorSchueller/TamperTurkey/refs/heads/main/tamperturkey.js');
        const tamperTurkeyScript = await tamperTurkeyScriptResponse.text();

        page.executeJavaScript(tamperTurkeyScript);
    });

    hamburgerButton.addEventListener('click', () => {
        const isMenuVisible = hamburgerMenu.style.display === 'block';
        hamburgerMenu.style.display = isMenuVisible ? 'none' : 'block';
    });

    hamburgerClose.addEventListener('click', () => {
        hamburgerMenu.style.display = 'none';
    });

    document.addEventListener('click', (event) => {
        const isClickInsideMenu = hamburgerMenu.contains(event.target);
        const isClickOnButton = hamburgerButton.contains(event.target);

        if (!isClickInsideMenu && !isClickOnButton) {
            hamburgerMenu.style.display = 'none';
        }
    });

    function hideMenu() {
        hamburgerMenu.style.display = 'none';
    }

    const hamburgerItems = document.querySelectorAll('.hamburger-menu > #hamburger-menu-item');
    hamburgerItems.forEach(hamburgerItem => {
        const itemType = hamburgerItem.getAttribute('data-type');
        const itemContent = hamburgerItem.getAttribute('data-content');
        if (itemType === 'script') {
            hamburgerItem.addEventListener('click', () => {
                injectScript(itemContent);
                hideMenu();
            });
        } else if (itemType === 'option') {
            if (itemContent === 'devmode') {
                hamburgerItem.addEventListener('click', () => {
                    page.ipcRenderer.send('devtools')
                    hideMenu();
                });
            } else if (itemContent === 'themeswitch') {
                hamburgerItem.addEventListener('click', () => {
                    toggleTheme();
                    hideMenu();
                });
            }
        } else if (itemType === 'shortcut') {
            hamburgerItem.addEventListener('click', () => {
                ipcRenderer.send('shortcut', [itemContent]);
                hideMenu();
            });
        } else if (itemType === 'redir') {
            hamburgerItem.addEventListener('click', () => {
                page.src = itemContent;
                hideMenu();
            });
        }
    });

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            tamperTurkey.querySelector('img').style.filter = 'invert()';
        } else {
            tamperTurkey.querySelector('img').style.filter = 'none';
        }
    }

    hamburgerMenu.style.overflowY = 'auto';
    hamburgerMenu.style.position = 'fixed';
});