let selectedAnimal = 'dog';
let selectedGender = 'male'; 
let selectedLetter = null;
let toastTimeoutId = null;

const nicknameResult = document.getElementById('nicknameResult');
const messageBox = document.getElementById('messageBox');

const RUSSIAN_LETTERS = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ю', 'Я'];

function showToast(message, isError = true, duration = 3000) {
    if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
    }
    messageBox.textContent = message;
    messageBox.className = 'hidden fixed top-10 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-sm px-3 py-2 rounded-full text-center font-regular small shadow-xl transition-all duration-300 opacity-0 pointer-events-none';
    if (isError) {
        messageBox.classList.add('bg-red-500', 'text-xs', 'text-white');
        duration = 5000; 
    } else {
        messageBox.classList.add('bg-neutral-950', 'text-xs', 'text-white');
    }
    messageBox.classList.remove('hidden', 'opacity-0');
    messageBox.classList.add('opacity-100');
    toastTimeoutId = setTimeout(() => {
        messageBox.classList.remove('opacity-100');
        messageBox.classList.add('opacity-0');
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 300); 
    }, duration);
}

function applySelectionStyles(element, isActive) {
    const activeClasses = [ 'bg-white', 'inset-shadow-sm', 'ring-1', 'ring-gray-100'];
    const inactiveClasses = ['bg-transparent', 'hover:bg-white'];

    if (isActive) {
        element.classList.remove(...inactiveClasses);
        element.classList.add(...activeClasses);
    } else {
        element.classList.remove(...activeClasses);
        element.classList.add(...inactiveClasses);
    }
}


function selectAnimal(type) {
    selectedAnimal = type;
    const cards = [
        document.getElementById('card-dog'),
        document.getElementById('card-cat'),
        document.getElementById('card-parrot'),
        document.getElementById('card-mouse')
    ];
    
    cards.forEach(card => {
        applySelectionStyles(card, card.dataset.animal === type);
    });
}


function selectGender(gender) {
    selectedGender = gender;
    const maleCard = document.getElementById('card-male');
    const femaleCard = document.getElementById('card-female');
    
    applySelectionStyles(maleCard, gender === 'male');
    applySelectionStyles(femaleCard, gender === 'female');
}

function selectLetter(letter) {
    selectedLetter = letter;
    const grid = document.getElementById('letterGrid');
    
    Array.from(grid.children).forEach(button => {
        applyLetterStyles(button, button.dataset.letter === letter);
    });
}

function applyLetterStyles(element, isActive) {
    const activeClasses = ['bg-white', 'shadow-md', 'ring-1', 'ring-blue-100', 'text-blue-600'];
    const inactiveClasses = ['bg-gray-100','bg-opacity-70', 'text-gray-600', 'hover:bg-opacity-100',];

    if (isActive) {
        element.classList.remove(...inactiveClasses);
        element.classList.add(...activeClasses);
    } else {
        element.classList.remove(...activeClasses);
        element.classList.add(...inactiveClasses);
    }
}


// Генерация клички
function generateNickname() {
    if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
        messageBox.classList.add('hidden', 'opacity-0');
    }

    const animalType = selectedAnimal; 
    const gender = selectedGender;
    const startingLetter = selectedLetter; 

    if (!startingLetter) {
        showToast("Пожалуйста, выберите первую букву клички.");
        return;
    }

    // 2. Поиск списка кличек
    const namesByLetter = NICKNAMES[animalType]?.[gender]?.[startingLetter];

    if (!namesByLetter || namesByLetter.length === 0) {
        let animalName;
        if (animalType === 'dog') {
            animalName = 'собаки';
        } else if (animalType === 'cat') {
            animalName = 'кошки';
        } else {
            animalName = 'попугая';
        }
        
        showToast(`К сожалению, в базе нет популярных кличек на букву "${startingLetter}" для ${gender === 'male' ? 'мальчика' : 'девочки'} ${animalName}. Попробуйте другую!`, false);
        nicknameResult.innerHTML = '<p class="text-gray-500 italic">Нет совпадений. Попробуйте другую букву.</p>';
        return;
    }

    // Выбираем рандомную кличку
    const randomIndex = Math.floor(Math.random() * namesByLetter.length);
    const selectedName = namesByLetter[randomIndex];

    let animalName;
    if (animalType === 'dog') {
        animalName = 'собака';
    } else if (animalType === 'cat') {
        animalName = 'кошка';
    } else if (animalType === 'parrot') {
        animalName = 'попугай';
    } else if (animalType === 'mouse') {
        animalName = 'грызун';
    }
     else {
        animalName = 'животное';
    }
    
    const genderName = gender === 'male' ? 'мальчик' : 'девочка';
    
    nicknameResult.innerHTML = `
        <div class="w-full space-y-5">
            <div class="font-medium accent-font text-gray-800 text-5xl sm:text-6xl transition duration-150 ease-in-out hover:text-blue-600 cursor-pointer "
                 onclick="copyToClipboard('${selectedName}')">
                ${selectedName}
            </div>
            <p class="text-sm text-gray-500 mt-2">
                Нажмите чтобы скопировать, или сгенерируйте еще раз.
            </p>
        </div>
    `;
}


// Копирование клички 
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast(`Cкопировано в буфер обмена!`, false, 3000); 
        } else {
            showToast('Не удалось скопировать текст. Попробуйте вручную.');
        }
    } catch (err) {
        showToast('Не удалось скопировать текст. Попробуйте вручную.');
    } finally {
        document.body.removeChild(textarea);
    }
}


// Копирование ссылки для соц. сетей:
function copyLink() {
    try {
        const tempInput = document.createElement('input');
        tempInput.value = window.location.href; 
        
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        
        const successful=document.execCommand('copy');
        if (successful) {
            showToast(`Cкопировано в буфер обмена!`, false, 3000); 
            document.body.removeChild(tempInput);
        } else {
            showToast('Не удалось скопировать текст. Попробуйте вручную.');
        }
    } catch (err) {
        showToast('Не удалось скопировать текст. Попробуйте вручную.');
    } finally {
        document.body.removeChild(tempInput);
    }
}

// Инициализация:
window.onload = function() {
    selectAnimal('dog'); 
    selectGender('male');
    
    const letterGrid = document.getElementById('letterGrid');
    RUSSIAN_LETTERS.forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.dataset.letter = letter;
        button.className = 'py-2 text-xl font-semibold aspect-square rounded-lg transition duration-150 ease-in-out border border-transparent';
        button.onclick = () => selectLetter(letter);
        
        applyLetterStyles(button, false);

        letterGrid.appendChild(button);
    });

    updateShareLinks();
}; 

function updateShareLinks() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Попробуй этот генератор имен!");

    const whatsappLink = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    document.getElementById('whatsapp-share').href = whatsappLink;

    const telegramLink = `https://t.me/share/url?url=${url}&text=${text}`;
    document.getElementById('telegram-share').href = telegramLink;

    const vkLink = `https://vk.com/share.php?url=${url}&title=Генератор Кличек&description=Создавай уникальные имена для своих персонажей или проектов!`;
    document.getElementById('vk-share').href = vkLink;
}
