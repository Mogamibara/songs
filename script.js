document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Select2
    $('#languageSelect').select2({
        placeholder: '选择语言',
        width: '100%',
        closeOnSelect: false,
        dropdownCssClass: 'custom-dropdown'
    });
    $('#singerSelect').select2({
        placeholder: '选择歌手',
        width: '100%',
        closeOnSelect: false,
        dropdownCssClass: 'custom-dropdown'
    });
    
    $('#genreSelect').select2({
        placeholder: '选择曲风',
        width: '100%',
        closeOnSelect: false,
        dropdownCssClass: 'custom-dropdown'
    });
    

    // 创建并显示弹窗
    const popup = document.createElement('div');
    popup.id = 'popupNotification';
    popup.innerText = '点击表格可以直接复制点歌文本哦 ♥~';
    document.body.appendChild(popup);

    // 设置弹窗样式
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '10px 20px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.color = 'white';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '1000';
    popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
    popup.style.fontSize = '16px';
    popup.style.textAlign = 'center';

    // 6秒后自动关闭弹窗
    setTimeout(() => {
        popup.style.display = 'none';
    }, 6000);

    const searchInput = document.getElementById('searchInput');
    const languageSelect = $('#languageSelect');
    const genreSelect = $('#genreSelect');
    const singerSelect = $('#singerSelect');
    //const paymentSelect = document.getElementById('paymentSelect');
    //const onlyShowSingable = document.getElementById('onlyShowSingable'); // 新增的勾选框
    const table = document.getElementById('musicTable');
    const rows = table.getElementsByTagName('tr');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');

    function filterTable() {
        const searchFilter = searchInput.value.toLowerCase();
        const selectedLanguages = languageSelect.val();
        const selectedGenres = genreSelect.val();
        const selectedSinger= singerSelect.val();
        //const selectedPayment = paymentSelect.value;
        //const showSingableOnly = onlyShowSingable.checked; // 勾选框状态

        for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
            const cells = rows[i].getElementsByTagName('td');
            const songName = cells[0].textContent.toLowerCase();
            const singable = cells[1].textContent.toLowerCase(); // 点唱列
            const artistName = cells[2].textContent.toLowerCase();
            const language = cells[3].textContent;
            const genres = cells[4].textContent.split('/');
            const payment = cells[5].textContent;
            const cut = cells[6].textContent;

            const matchesSearch = songName.includes(searchFilter) || artistName.includes(searchFilter);
            const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(language);
            const matchesGenre = selectedGenres.length === 0 || selectedGenres.some(genre => genres.includes(genre));
            const matchesSinger =  selectedSinger.length === 0 || selectedSinger.some(singer => artistName.includes(singer.toLowerCase()));
            let matchesPayment = true;
            //let matchesSingable = !showSingableOnly || singable.trim() !== ''; // 仅显示可点唱歌曲
            const matchesSingable = true

            /*
            switch (selectedPayment) {
                case 'free':
                    matchesPayment = payment === '';
                    break;
                case 'paid':
                    matchesPayment = payment !== '';
                    break;
                case 'cut':
                    matchesPayment = cut !== '';
                    break;
            }
            */

            if (matchesSearch && matchesLanguage && matchesGenre && matchesSinger && matchesPayment && matchesSingable) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }

    function showNotification(songName, payment) {
        if (payment) {
            notificationMessage.textContent = `歌曲《${songName}》复制成功，此歌曲需要${payment}点歌哟~`;
        } else {
            notificationMessage.textContent = `歌曲《${songName}》复制成功，赶快去直播间点歌吧~`;
        }
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    function getPaymentContent(cell) {
        let content = '';
        cell.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                content += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IMG') {
                content += node.alt;
            }
        });
        return content;
    }

    searchInput.addEventListener('input', filterTable);
    languageSelect.on('change', filterTable);
    genreSelect.on('change', filterTable);
    singerSelect.on('change', filterTable);
    //paymentSelect.addEventListener('change', filterTable);
    //onlyShowSingable.addEventListener('change', filterTable); // 添加勾选框事件监听

    // 页面加载时初始化过滤逻辑
    filterTable();

    for (let i = 1; i < rows.length; i++) {
        rows[i].addEventListener('click', function() {
            const songName = this.getElementsByTagName('td')[0].textContent;
            const paymentCell = this.getElementsByTagName('td')[5];
            const payment = getPaymentContent(paymentCell);

            copyToClipboard(`点歌 ${songName}`);
            showNotification(songName, payment);
        });
    }
});
