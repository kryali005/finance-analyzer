// src/csvWorker.js
self.onmessage = function(e) {
    const csvText = e.data;
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const transactions = lines.slice(1).map(line => {
        const values = [];
        let current = '', inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        const transaction = {};
        headers.forEach((header, index) => {
            transaction[header] = values[index] || '';
        });
        transaction.Amount = parseFloat(transaction.Amount) || 0;
        transaction.Date = new Date(transaction.Date);
        // No categorization here, handled in main thread
        return transaction;
    }).filter(t => t.Amount !== 0);
    self.postMessage(transactions);
};
