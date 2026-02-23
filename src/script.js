const CONFIG = {
    russianLetters: ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ю', 'Я'],
    styles: {
        active: ['bg-white', 'shadow-sm', 'ring-1', 'ring-gray-100', 'text-gray-800', 'opacity-100'],
        inactive: ['bg-white/0', 'hover:bg-white', 'opacity-70'],
        letterActive: ['bg-white', 'ring-1', 'ring-gray-100', 'text-gray-800', 'shadow-sm'],
        letterInactive: ['bg-white/50', 'text-gray-500', 'hover:bg-white/100', 'shadow-xs']
    },
    animalNames: {
        genitive: { 
            dog: 'собаки', cat: 'кошки', parrot: 'попугая', mouse: 'грызуна'
        },
        nominative: { 
            dog: 'собака', cat: 'кошка', parrot: 'попугай', mouse: 'грызун'
        }
    }
};


const state = {
    animal: 'dog',
    gender: 'male',
    letter: 'А',
    toastTimer: null
};


const UI = {
    nicknameResult: document.getElementById('nicknameResult'),
    messageBox: document.getElementById('messageBox'),
    letterGrid: document.getElementById('letterGrid'),
    cards: document.querySelectorAll('[data-animal]'), 
    genderCards: document.querySelectorAll('[data-gender]') 
};

function toggleClasses(element, isActive, isLetter = false) {
    const activeSet = isLetter ? CONFIG.styles.letterActive : CONFIG.styles.active;
    const inactiveSet = isLetter ? CONFIG.styles.letterInactive : CONFIG.styles.inactive;

    if (isActive) {
        element.classList.remove(...inactiveSet);
        element.classList.add(...activeSet);
    } else {
        element.classList.remove(...activeSet);
        element.classList.add(...inactiveSet);
    }
}

function showToast(message, isError = true) {
    if (state.toastTimer) clearTimeout(state.toastTimer);

    const { messageBox } = UI;
    messageBox.textContent = message;
    messageBox.className = 'fixed sm:bottom-10 bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-sm px-3 py-2 rounded-full text-center font-regular small shadow-xl transition-all duration-300 pointer-events-none opacity-0 translate-y-2';
    messageBox.classList.add(isError ? 'bg-red-500' : 'bg-neutral-950', 'text-white', 'text-xs');

    requestAnimationFrame(() => {
        messageBox.classList.remove('opacity-0', 'translate-y-2');
        messageBox.classList.add('opacity-100', 'translate-y-0');
    });

    state.toastTimer = setTimeout(() => {
        messageBox.classList.remove('opacity-100', 'translate-y-0');
        messageBox.classList.add('opacity-0', 'translate-y-2');
    }, isError ? 5000 : 3000);
}


function updateSelectionUI() {
    UI.cards.forEach(card => {
        toggleClasses(card, card.dataset.animal === state.animal);
    });

    UI.genderCards.forEach(card => {
        toggleClasses(card, card.dataset.gender === state.gender);
    });

    Array.from(UI.letterGrid.children).forEach(btn => {
        toggleClasses(btn, btn.dataset.letter === state.letter, true);
    });
}

function selectAnimal(type) {
    state.animal = type;
    updateSelectionUI();
}

function selectGender(gender) {
    state.gender = gender;
    updateSelectionUI();
}


function generateNickname() {
    if (!state.letter) {
        return showToast("Пожалуйста, выберите первую букву клички.");
    }

    const namesList = NICKNAMES?.[state.animal]?.[state.gender]?.[state.letter];

    if (!namesList?.length) {
        const animalName = CONFIG.animalNames.genitive[state.animal] || 'животного';
        const genderText = state.gender === 'male' ? 'мальчика' : 'девочки';
        
        showToast(`Нет кличек на букву "${state.letter}" для ${genderText} ${animalName}.`, false);
        UI.nicknameResult.innerHTML = '<p class="text-gray-500 italic">Нет совпадений.</p>';
        return;
    }

    const selectedName = namesList[Math.floor(Math.random() * namesList.length)];
    
    UI.nicknameResult.innerHTML = `
        <div class="w-full space-y-2 sm:space-y-5">
            <div class="font-medium accent-font text-gray-800 text-5xl sm:text-6xl cursor-pointer hover:scale-105 transition-transform"
                 id="resultName">
                ${selectedName}
            </div>
            <p class="text-sm text-gray-800 mt-2">Нажмите на имя, чтобы скопировать.</p>
        </div>
    `;

    document.getElementById('resultName').onclick = () => copyToClipboard(selectedName);
}


async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            showToast('Скопировано в буфер обмена!', false);
        } else {
            throw new Error('Clipboard API unavailable');
        }
    } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('Скопировано в буфер обмена!', false);
        } catch (e) {
            showToast('Не удалось скопировать. Попробуйте вручную.');
        } finally {
            document.body.removeChild(textarea);
        }
    }
}


window.addEventListener('DOMContentLoaded', () => { 
    
    UI.letterGrid.innerHTML = ''; 
    const fragment = document.createDocumentFragment(); 
    
    CONFIG.russianLetters.forEach(letter => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.className = 'text-lg sm:text-xl font-semibold sm:aspect-square rounded-xl sm:rounded-full transition duration-150 border border-transparent sm:min-w-[2.5rem] min-h-[3rem] flex items-center justify-center';
        toggleClasses(btn, false, true); 
        fragment.appendChild(btn);
    });
    UI.letterGrid.appendChild(fragment);

    UI.letterGrid.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            state.letter = e.target.dataset.letter;
            updateSelectionUI();
        }
    });

    updateSelectionUI();
    updateShareLinks();
});

function updateShareLinks() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Попробуй этот генератор кличек для питомцев!");
    
    const setLink = (id, link) => {
        const el = document.getElementById(id);
        if(el) el.href = link;
    };

    setLink('whatsapp-share', `https://api.whatsapp.com/send?text=${text}%20${url}`);
    setLink('telegram-share', `https://t.me/share/url?url=${url}&text=${text}`);
    setLink('vk-share', `https://vk.com/share.php?url=${url}&title=Генератор Кличек`);
}