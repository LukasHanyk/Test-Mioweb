const form = document.getElementById('objednavkaForm');
        const jmenoInput = document.getElementById('jmeno');
        const emailInput = document.getElementById('email');
        const produktInput = document.getElementById('produkt');
        const cenaInput = document.getElementById('cena');
        const pocetInput = document.getElementById('pocet');

        const jmenoError = document.getElementById('jmenoError');
        const emailError = document.getElementById('emailError');
        const produktError = document.getElementById('produktError');
        const cenaError = document.getElementById('cenaError');
        const pocetError = document.getElementById('pocetError');

        const rekapitulaceDiv = document.getElementById('rekapitulace');
        const rekapitulaceJmenoSpan = document.getElementById('rekapitulaceJmeno');
        const rekapitulaceEmailSpan = document.getElementById('rekapitulaceEmail');
        const rekapitulaceProduktSpan = document.getElementById('rekapitulaceProdukt');
        const rekapitulaceCenaSpan = document.getElementById('rekapitulaceCena');
        const rekapitulacePocetSpan = document.getElementById('rekapitulacePocet');
        const rekapitulaceCenaBezDphSpan = document.getElementById('rekapitulaceCenaBezDph');
        const rekapitulaceDphSpan = document.getElementById('rekapitulaceDph');
        const rekapitulaceCenaSDphSpan = document.getElementById('rekapitulaceCenaSDph');
        const rekapitulaceCenaMenaSpan = document.getElementById('rekapitulaceCenaMena');
        const rekapitulaceMenaSpan = document.getElementById('rekapitulaceMena');

        const kurzovniListekDiv = document.getElementById('kurzovni-listek');
        const kurzyUl = document.getElementById('kurzy');
        const vybranaMenaSelect = document.getElementById('vybranaMena');

        let kurzovniData = {};

        // Funkce pro validaci jména
        function validujJmeno() {
            if (jmenoInput.value.trim() === "") {
                jmenoError.textContent = "Prosím vyplňte jméno a příjmení.";
                return false;
            }
            jmenoError.textContent = "";
            return true;
        }

        // Funkce pro validaci e-mailu
        function validujEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailError.textContent = "Prosím zadejte platnou e-mailovou adresu.";
                return false;
            }
            emailError.textContent = "";
            return true;
        }

        // Funkce pro validaci produktu
        function validujProdukt() {
            if (produktInput.value.trim() === "") {
                produktError.textContent = "Prosím zadejte název produktu.";
                return false;
            }
            produktError.textContent = "";
            return true;
        }

        // Funkce pro validaci ceny
        function validujCenu() {
            if (isNaN(parseFloat(cenaInput.value)) || parseFloat(cenaInput.value) <= 0) {
                cenaError.textContent = "Prosím zadejte platnou cenu.";
                return false;
            }
            cenaError.textContent = "";
            return true;
        }

        // Funkce pro validaci počtu kusů
        function validujPocet() {
            if (isNaN(parseInt(pocetInput.value)) || parseInt(pocetInput.value) < 1) {
                pocetError.textContent = "Prosím zadejte platný počet kusů.";
                return false;
            }
            pocetError.textContent = "";
            return true;
        }

        // Funkce pro výpočet celkové ceny
        function vypocitejCenu() {
            const cenaZaKus = parseFloat(cenaInput.value);
            const pocetKusu = parseInt(pocetInput.value);
            if (!isNaN(cenaZaKus) && !isNaN(pocetKusu)) {
                return cenaZaKus * pocetKusu;
            }
            return 0;
        }

        // Funkce pro zobrazení rekapitulace
        function zobrazRekapitulaci(event) {
            event.preventDefault();

            const jeFormularValidni = validujJmeno() && validujEmail() && validujProdukt() && validujCenu() && validujPocet();

            if (jeFormularValidni) {
                const cenaBezDph = vypocitejCenu();
                const dph = cenaBezDph * 0.21;
                const cenaSDph = cenaBezDph + dph;

                rekapitulaceJmenoSpan.textContent = jmenoInput.value;
                rekapitulaceEmailSpan.textContent = emailInput.value;
                rekapitulaceProduktSpan.textContent = produktInput.value;
                rekapitulaceCenaSpan.textContent = parseFloat(cenaInput.value).toFixed(2);
                rekapitulacePocetSpan.textContent = pocetInput.value;
                rekapitulaceCenaBezDphSpan.textContent = cenaBezDph.toFixed(2);
                rekapitulaceDphSpan.textContent = dph.toFixed(2);
                rekapitulaceCenaSDphSpan.textContent = cenaSDph.toFixed(2);

                const vybranaMena = vybranaMenaSelect.value;
                if (kurzovniData[vybranaMena]) {
                    const kurz = kurzovniData[vybranaMena];
                    const cenaVMene = (cenaSDph / kurz).toFixed(2);
                    rekapitulaceCenaMenaSpan.textContent = cenaVMene;
                    rekapitulaceMenaSpan.textContent = vybranaMena;
                } else {
                    rekapitulaceCenaMenaSpan.textContent = "---";
                    rekapitulaceMenaSpan.textContent = vybranaMena || "---";
                }

                rekapitulaceDiv.style.display = 'block';
            }
        }

        // Event listenery pro validaci při změně vstupu
        jmenoInput.addEventListener('blur', validujJmeno);
        emailInput.addEventListener('blur', validujEmail);
        produktInput.addEventListener('blur', validujProdukt);
        cenaInput.addEventListener('blur', validujCenu);
        pocetInput.addEventListener('change', () => {
            validujPocet();
        });
        cenaInput.addEventListener('change', vypocitejCenu);
        pocetInput.addEventListener('change', vypocitejCenu);

        // Event listener pro odeslání formuláře
        form.addEventListener('submit', zobrazRekapitulaci);

        // Načtení kurzovního lístku ČNB

        fetch('https://api.allorigins.win/raw?url=https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt')
        .then(response => response.text())
        .then(data => {
            console.log(data);
        const radky = data.split('\n').slice(2); // Odstraní první dva řádky (hlavička)
        kurzyUl.innerHTML = ''; // Vyčistí seznam kurzů

        radky.forEach(radek => {
            if (radek.trim() !== '') {
                const polozky = radek.split('|');
                if (polozky.length === 5) {
                    const mena = polozky[3]; // Měna
                    const kurz = parseFloat(polozky[4].replace(',', '.')) / parseInt(polozky[2]); // Kurz
                    kurzovniData[mena] = kurz;
                    
                    const option = document.createElement('option');
                    option.value = mena;
                    option.textContent = mena;
                    vybranaMenaSelect.appendChild(option);
                    
                    const li = document.createElement('li');
                    li.textContent = `${mena}: ${kurz.toFixed(4)}`;
                    kurzyUl.appendChild(li);
                }
            }
        });
    })
    .catch(error => {
        console.error('Chyba při načítání kurzovního lístku:', error);
        kurzyUl.innerHTML = '<li>Nepodařilo se načíst kurzovní lístek.</li>';
    });

    
        // Aktualizace přepočtené ceny při změně vybrané měny
        vybranaMenaSelect.addEventListener('change', () => {
            if (rekapitulaceDiv.style.display === 'block') {
                const cenaSDph = parseFloat(rekapitulaceCenaSDphSpan.textContent);
                const vybranaMena = vybranaMenaSelect.value;
                if (kurzovniData[vybranaMena]) {
                    const kurz = kurzovniData[vybranaMena];
                    const cenaVMene = (cenaSDph / kurz).toFixed(2);
                    rekapitulaceCenaMenaSpan.textContent = cenaVMene;
                    rekapitulaceMenaSpan.textContent = vybranaMena;
                } else {
                    rekapitulaceCenaMenaSpan.textContent = "---";
                    rekapitulaceMenaSpan.textContent = vybranaMena || "---";
                }
            }
        });

        // Aktualizace celkové ceny při změně počtu kusů
        pocetInput.addEventListener('input', () => {
            const cenaZaKus = parseFloat(cenaInput.value);
            const pocetKusu = parseInt(pocetInput.value);
            if (!isNaN(cenaZaKus) && !isNaN(pocetKusu)) {
                const cenaBezDph = cenaZaKus * pocetKusu;
                const dph = cenaBezDph * 0.21;
                const cenaSDph = cenaBezDph + dph;

                if (rekapitulaceDiv.style.display === 'block') {
                    rekapitulacePocetSpan.textContent = pocetKusu.toFixed();
                    rekapitulaceCenaBezDphSpan.textContent = cenaBezDph.toFixed(2);
                    rekapitulaceDphSpan.textContent = dph.toFixed(2);
                    rekapitulaceCenaSDphSpan.textContent = cenaSDph.toFixed(2);

                    const vybranaMena = vybranaMenaSelect.value;
                    if (kurzovniData[vybranaMena]) {
                        const kurz = kurzovniData[vybranaMena];
                        const cenaVMene = (cenaSDph / kurz).toFixed(2);
                        rekapitulaceCenaMenaSpan.textContent = cenaVMene;
                    }
                }
            }
        });

        // Aktualizace celkové ceny při změně ceny za kus
        cenaInput.addEventListener('input', () => {
            const cenaZaKus = parseFloat(cenaInput.value);
            const pocetKusu = parseInt(pocetInput.value);
            if (!isNaN(cenaZaKus) && !isNaN(pocetKusu)) {
                const cenaBezDph = cenaZaKus * pocetKusu;
                const dph = cenaBezDph * 0.21;
                const cenaSDph = cenaBezDph + dph;

                if (rekapitulaceDiv.style.display === 'block') {
                    rekapitulaceCenaBezDphSpan.textContent = cenaBezDph.toFixed(2);
                    rekapitulaceDphSpan.textContent = dph.toFixed(2);
                    rekapitulaceCenaSDphSpan.textContent = cenaSDph.toFixed(2);

                    const vybranaMena = vybranaMenaSelect.value;
                    if (kurzovniData[vybranaMena]) {
                        const kurz = kurzovniData[vybranaMena];
                        const cenaVMene = (cenaSDph / kurz).toFixed(2);
                        rekapitulaceCenaMenaSpan.textContent = cenaVMene;
                    }
                }
            }
        });