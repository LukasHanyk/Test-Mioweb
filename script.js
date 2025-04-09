        const priceInput = document.getElementById('price');
        const quantityInput = document.getElementById('quantity');
        const recapTotalPrice = document.getElementById('recapTotalPrice');
        const recapDphAmount = document.getElementById('recapDphAmount');
        const recapPriceWithDph = document.getElementById('recapPriceWithDph');
        const recapConvertedPrice = document.getElementById('recapConvertedPrice'); // Přidáme pro zobrazení přepočtené ceny
        const recapCurrency = document.getElementById('currency');

        const dphRate = 0.21; // DPH 21%

        // Funkce pro formátování čísla s mezerami pro tisíce a čárkou pro desetinná místa
        function formatNumber(number) {
            // Ověříme, zda je hodnota číslo
            if (isNaN(number)) {
                return 'Neplatné číslo'; // Pokud není číslem, vrátíme zprávu
            }

            // Převedeme číslo na správný formát s dvěma desetinnými místy a čárkou
            const formattedNumber = number
                .toFixed(2)  // Zaručíme, že máme dvě desetinná místa
                .replace('.', ',')  // Změníme tečku na čárku
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');  // Regulární výraz pro vložení mezer mezi tisíce

            return formattedNumber;
        }

        function updateTotalPrice() {
            const price = parseFloat(priceInput.value) || 0;
            const quantity = parseInt(quantityInput.value) || 1;

            // Přepočítání ceny a DPH
            const totalPrice = price * quantity;
            const dphAmount = totalPrice * dphRate;
            const priceWithDph = totalPrice + dphAmount;

            // Aktualizace rekapitulace pro celkovou cenu, DPH a cenu s DPH
            recapTotalPrice.textContent = formatNumber(totalPrice); // Používáme funkci pro formátování
            recapDphAmount.textContent = formatNumber(dphAmount); // Používáme funkci pro formátování
            recapPriceWithDph.textContent = formatNumber(priceWithDph); // Používáme funkci pro formátování

            // Pokud je vybraná měna, přepočítat i cenu do měny
            const selectedCurrency = recapCurrency.value;
            if (selectedCurrency) {
                const exchangeRates = <?php echo json_encode($exchangeRates); ?>; // Předání kurzů z PHP
                const conversionRate = exchangeRates[selectedCurrency];  // Získání aktuálního kurzu

                if (conversionRate) {
                    const convertedPrice = priceWithDph / conversionRate;

                    // Aktualizujeme rekapitulaci s přepočtenou cenou
                    recapConvertedPrice.textContent = formatNumber(convertedPrice); // Zde formátujeme číslo
                    recapConvertedCurrency.textContent = selectedCurrency; // Měna za částkou
                    recapConvertedCurrencyText.textContent = selectedCurrency; // Měna v textu

                    // Aktualizujeme kurz měny
                    recapConvertedCurrencyRate.textContent = `kurz ${formatNumber(conversionRate)}`; // Zobrazení kurzu
                } else {
                    recapConvertedPrice.textContent = 'Kurzy nejsou k dispozici';
                    recapConvertedCurrency.textContent = ''; // Pokud není kurz, neukazujeme měnu
                    recapConvertedCurrencyText.textContent = ''; // Pokud není kurz, neukazujeme měnu v textu
                    recapConvertedCurrencyRate.textContent = ''; // Pokud není kurz, neukazujeme kurz
                }
            } else {
                recapConvertedPrice.textContent = 'Vyberte měnu pro přepočet';
                recapConvertedCurrency.textContent = '';  // Pokud není vybraná měna, neukazujeme měnu
                recapConvertedCurrencyText.textContent = ''; // Pokud není vybraná měna, neukazujeme text
                recapConvertedCurrencyRate.textContent = ''; // Pokud není vybraná měna, neukazujeme kurz
            }
        }

        // Přidání event listenerů pro cenu, počet kusů a měnu
        if (priceInput && quantityInput && recapCurrency) {
            priceInput.addEventListener('input', updateTotalPrice);
            quantityInput.addEventListener('input', updateTotalPrice);
            recapCurrency.addEventListener('change', updateTotalPrice);
        }