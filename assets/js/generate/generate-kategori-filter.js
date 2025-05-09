document.addEventListener('DOMContentLoaded', function () {
    const butikkContainer = document.getElementById('butikk-container');
    const categoryList = document.getElementById('categoryList');
    const resultCount = document.createElement('p');
    resultCount.classList.add('text-muted');
    resultCount.style.marginTop = '10px';
    resultCount.id = 'resultCount';
    categoryList.parentElement.appendChild(resultCount);

    // Kategorier og subkategorier
    const categories = [
        { name: "Elektronikk", icon: "💡", subcategories: ["TV", "Mobil", "PC"] },
        { name: "Klær og mote", icon: "👗", subcategories: ["Herreklær", "Dameklær", "Sko"] },
        { name: "Helse og skjønnhet", icon: "💄", subcategories: ["Parfyme", "Hudpleie", "Hårprodukter"] },
        { name: "Sport og fritid", icon: "⚽", subcategories: ["Treningsutstyr", "Friluftsliv"] },
        { name: "Barn og baby", icon: "🍼", subcategories: ["Leker", "Barnevogner"] }
    ];

    // Genererer kategorilisten dynamisk
    categories.forEach(category => {
        const mainCategory = document.createElement('div');
        mainCategory.classList.add('form-check', 'mb-2');
        mainCategory.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${category.name}" id="${category.name}">
            <label class="form-check-label" for="${category.name}">${category.icon} ${category.name}</label>
        `;
        categoryList.appendChild(mainCategory);

        category.subcategories.forEach(subcat => {
            const subCategory = document.createElement('div');
            subCategory.classList.add('form-check', 'ms-3');
            subCategory.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${subcat}" id="${subcat}">
                <label class="form-check-label" for="${subcat}">${subcat}</label>
            `;
            categoryList.appendChild(subCategory);
        });
    });

    // Oppdaterer antall treff
    function updateResultCount(count) {
        resultCount.textContent = `Antall treff: ${count}`;
    }

    // Henter og viser butikker
    async function fetchButikker(categories) {
        const response = await fetch('assets/data/butikker.json');
        const butikker = await response.json();
        butikkContainer.innerHTML = '';

        const filtered = butikker.filter(butikk =>
            categories.some(category => butikk.category.includes(category))
        );

        updateResultCount(filtered.length);

        if (filtered.length > 0) {
            filtered.forEach(butikk => {
                const card = document.createElement('div');
                card.classList.add('col-md-4');
                card.innerHTML = `
                    <div class="card shadow-sm">
                        <img src="${butikk.image}" class="card-img-top" alt="${butikk.alt}">
                        <div class="card-body">
                            <h5 class="card-title">${butikk.name}</h5>
                            <p class="card-text">${butikk.description}</p>
                            <a href="${butikk.url}" class="btn btn-primary" target="_blank">Besøk butikk</a>
                        </div>
                    </div>
                `;
                butikkContainer.appendChild(card);
            });
        } else {
            butikkContainer.innerHTML = '<p class="text-muted">Ingen treff i denne kategorien.</p>';
        }
    }

    // Oppdaterer dynamisk ved valg
    function updateSelection() {
        const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cat => cat.value);
        fetchButikker(selectedCategories);
    }

    // Lytter på endring av checkbokser
    categoryList.addEventListener('change', updateSelection);

    // Dynamisk filtrering fra søkefelt
    document.getElementById('searchCategories').addEventListener('input', (e) => {
        const searchValue = e.target.value.toLowerCase();
        document.querySelectorAll('#categoryList .form-check').forEach(el => {
            const label = el.querySelector('label').textContent.toLowerCase();
            el.style.display = label.includes(searchValue) ? '' : 'none';
        });
        updateSelection();
    });
});
