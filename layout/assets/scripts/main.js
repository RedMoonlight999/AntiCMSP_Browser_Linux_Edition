const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('#search');
const imFeelingLuckyButton = document.querySelector('#im-feeling-lucky');
const themeToggle = document.querySelector('#theme-toggle');
const engineName = document.querySelector('#engine-name');
const engineModal = document.querySelector('#engine-modal');
const engineSelect = document.querySelector('#engine-select');
const cancelButton = document.querySelector('#cancel-button');
const saveButton = document.querySelector('#save-button');

function searchText(text=null) {
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

    location.href = searchUrl + `${encodeURIComponent(text) || encodeURIComponent(searchBar.value)}`;
};

searchBar.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const inputText = searchBar.value.trim();

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

searchButton.addEventListener('click', () => {
    searchText(searchBar.value);
});

imFeelingLuckyButton.addEventListener('click', () => {
    location.href = `https://duckduckgo.com/?t=h_&q=%21+${searchBar.value}`;
});

function updateTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.style.backgroundColor = theme === 'dark' ? 'var(--bg-dark)' : 'var(--bg-light)';
    document.body.style.color = theme === 'dark' ? 'var(--text-dark)' : 'var(--text-light)';
};

themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateTheme();
});

function updateEngine() {
    const engine = localStorage.getItem('engine') || 'Google';
    engineName.textContent = engine;
    engineSelect.value = engine;
};

function openEngineModal() {
    engineModal.classList.add('active');
};
const closeEngineModal = () => {
    engineModal.classList.remove('active');
};

function saveEngine() {
    const selectedEngine = engineSelect.value;
    localStorage.setItem('engine', selectedEngine);
    updateEngine();
    closeEngineModal();
};

engineName.addEventListener('click', openEngineModal);
cancelButton.addEventListener('click', closeEngineModal);
saveButton.addEventListener('click', saveEngine);

updateTheme();
updateEngine();