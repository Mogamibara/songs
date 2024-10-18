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
    popup.style.display = 'none'

    // 6秒后自动关闭弹窗
    setTimeout(() => {
        popup.style.display = 'block';
    }, 6000);

    // 6秒后自动关闭弹窗
    setTimeout(() => {
        popup.style.display = 'none';
    }, 11000);

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
    let notificationTimeout;

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
        // 清除现有的计时器
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        // 设置新的计时器
        notificationTimeout = setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }

    function showNotification2(songName, payment) {
        if (payment) {
            notificationMessage.textContent = `为你随机到了歌曲《${songName}》，复制成功，此歌曲需要${payment}点歌哟~`;
        } else {
            notificationMessage.textContent = `为你随机到了歌曲《${songName}》，复制成功，赶快去直播间点歌吧~`;
        }
        notification.style.display = 'block';
        // 清除现有的计时器
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        // 设置新的计时器
        notificationTimeout = setTimeout(() => {
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

    // 滚动监听事件
    window.addEventListener('scroll', function() {
        const buttonContainer = document.querySelector('.button-container');
        const floatBtn1 = document.getElementById('floatBtn1');
        const floatBtn2 = document.getElementById('floatBtn2');
        const rect = buttonContainer.getBoundingClientRect();

        if (rect.bottom < 0) {
            floatBtn1.style.display = 'block';
            floatBtn2.style.display = 'block';
        } else {
            floatBtn1.style.display = 'none';
            floatBtn2.style.display = 'none';
        }
    });


    // 创建并添加群号弹窗
    const groupPopup = document.createElement('div');
    groupPopup.id = 'groupPopup';
    groupPopup.innerHTML = `
        <p>如果没办法正常跳转，可以手动添加哦~ 群号：223544307</p>
        <button id="copyBtn">复制</button>
        <button id="closeBtn">确定</button>
    `;
    document.body.appendChild(groupPopup);

    // 复制功能
    document.getElementById('copyBtn').addEventListener('click', () => {
        navigator.clipboard.writeText('223544307').then(() => {
            alert('群号已复制到剪贴板');
        }).catch(err => {
            alert('复制失败');
        });
    });

    // 关闭弹窗
    document.getElementById('closeBtn').addEventListener('click', () => {
        groupPopup.style.display = 'none';
    });

    // 第三个按钮点击处理
    function handleThirdButtonClick() {
        window.open('http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=dP_H5MXQ__6Cxkg4iqaAzJTPpif_61hb&authKey=ZYqN3mcEjJDZPlDCNfd7b0JhRUzjfP2dpY0pLsA%2BdcN%2FUqdvLa6q%2F2kumJVIWHor&noverify=0&group_code=223544307', '_blank'); // 替换为实际链接
        groupPopup.style.display = 'block';
    }

    // 给第三个悬浮按钮添加点击事件
    document.getElementById('floatBtn3').addEventListener('click', handleThirdButtonClick);

    // 为随机点歌按钮添加事件监听
    const randomSongBtn = document.getElementById('randomSongBtn');
    randomSongBtn.addEventListener('click', function() {
        // 获取所有可见的歌曲行
        const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none' && row.querySelector('td')); 

        if (visibleRows.length > 0) {
            // 随机选择一个可见的行
            const randomIndex = Math.floor(Math.random() * visibleRows.length);
            const selectedRow = visibleRows[randomIndex];
            const songName = selectedRow.getElementsByTagName('td')[0].textContent;
            const paymentCell = selectedRow.getElementsByTagName('td')[5];
            const payment = getPaymentContent(paymentCell);

            // 复制点歌文本到剪贴板并显示通知
            copyToClipboard(`点歌 ${songName}`);
            showNotification2(songName, payment);
        } else {
            alert('当前没有可选歌曲');
        }
    });

});


// Create canvas for rain effect
const canvasRain = document.createElement('canvas');
document.getElementById('matrixRain').appendChild(canvasRain);
canvasRain.width = window.innerWidth;
canvasRain.height = window.innerHeight;
const ctxRain = canvasRain.getContext('2d');

// Create canvas for text and cursor effect
const canvasText = document.createElement('canvas');
document.getElementById('matrixText').appendChild(canvasText);
canvasText.width = window.innerWidth;
canvasText.height = window.innerHeight;
const ctxText = canvasText.getContext('2d');

// Rain effect variables
const fontSize = 14;
const columns = canvasRain.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);
const sequences = Array(Math.floor(columns)).fill('');

const words = ['カンバラハル', 'モガミバラ', '最上原'];

function generateSequence() {
  const sequence = [];
  for (let i = 0; i < canvasRain.height / fontSize; i++) {
    if (Math.random() > 0.99) {
      const word = words[Math.floor(Math.random() * words.length)];
      for (let char of word) {
        sequence.push({ text: char, bold: true });
      }
      i += word.length - 1; // 跳过词汇的长度
    } else {
      sequence.push({ text: String.fromCharCode(Math.floor(Math.random() * 128)), bold: false });
    }
  }
  return sequence;
}

function drawRain() {
  ctxRain.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctxRain.fillRect(0, 0, canvasRain.width, canvasRain.height);

  ctxRain.fillStyle = '#FF69B4'; // 粉色
  ctxRain.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const sequence = sequences[i];
    const charData = sequence[drops[i]];

    if (drops[i] < sequence.length) {
      if (charData.bold) {
        ctxRain.font = `bold ${fontSize}px monospace`;
      } else {
        ctxRain.font = `${fontSize}px monospace`;
      }

      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctxRain.fillText(charData.text, x, y);
    }

    if (drops[i] * fontSize > canvasRain.height && Math.random() > 0.975) {
      drops[i] = 0;
      sequences[i] = generateSequence();
    }

    drops[i]++;
  }
}

for (let i = 0; i < sequences.length; i++) {
  sequences[i] = generateSequence();
}

setInterval(drawRain, 33);

// Text typing and cursor effect variables
const message = "WEL2MyW0r1d";
const messageParts = ["WEL", "2", "My", "W0r1d!!"];
let messageIndex = 0;
let messagePartIndex = 0;


// 动态调整字体大小
function calculateFontSize() {
    let tempFontSize = 80;
    ctxText.font = `${tempFontSize}px monospace`;
    let totalWidth = messageParts.reduce((acc, part) => acc + ctxText.measureText(part).width, 0) + (messageParts.length - 1) * 10;

    while (totalWidth > canvasText.width - 100 && tempFontSize > 10) {
        tempFontSize -= 1;
        ctxText.font = `${tempFontSize}px monospace`;
        totalWidth = messageParts.reduce((acc, part) => acc + ctxText.measureText(part).width, 0) + (messageParts.length - 1) * 10;
    }

    return tempFontSize;
}

const typingFontSize = calculateFontSize();
// 计算字符串 "Welcome2MyWorld" 的总宽度并居中
ctxText.font = `${typingFontSize}px monospace`;
const totalMessageWidth = ctxText.measureText(message).width;
let messageX = (canvasText.width - totalMessageWidth) / 2;

let messageY = canvasText.height / 2;
const typedCharacters = []; // 存储已经打出来的字符
ctxText.fillStyle = "#FF69B4"; // 粉色

let cursorX = messageX; // 光标位置
let cursorVisible = true;
let blinkCursorTimeout; // 光标闪烁计时器


function drawTypedCharacters() {
  ctxText.clearRect(0, 0, canvasText.width, canvasText.height);
  ctxText.font = `${typingFontSize}px monospace`;
  ctxText.fillStyle = "#FF69B4";
  typedCharacters.forEach(({ char, x, y }) => {
    ctxText.fillText(char, x, y);
  });
  // 根据 cursorVisible 绘制光标
  if (cursorVisible) {
    ctxText.fillText('_', cursorX, messageY);
  }
}

function blinkCursor() {
  cursorVisible = !cursorVisible;
  blinkCursorTimeout = setTimeout(blinkCursor, 500);
}

function resetBlinkCursor() {
  clearTimeout(blinkCursorTimeout);
  blinkCursor();
  cursorVisible = true; // 确保光标在打字时可见
}

function typeMessage() {
  if (messageIndex < messageParts.length) {
    const part = messageParts[messageIndex];
    if (messagePartIndex < part.length) {
      const char = part[messagePartIndex];
      ctxText.font = `${typingFontSize}px monospace`; // 确保字体大小在这里被设置
      typedCharacters.push({ char: char, x: messageX, y: messageY });
      ctxText.fillText(char, messageX, messageY);
      messageX += ctxText.measureText(char).width;
      cursorX = messageX; // 更新光标位置
      messagePartIndex++;

      // 每当字符增加时，重置光标闪烁计时器
      resetBlinkCursor();

      const delay = Math.random() * 100 + 50;
      setTimeout(typeMessage, delay);
    } else {
      messageIndex++;
      messagePartIndex = 0;
      const part = messageParts[messageIndex - 1];
      const pauseDelay = part === "WEL" || part === "2" || part === "My" ? 500 : 100;
      setTimeout(typeMessage, pauseDelay);
      messageX += 0; // 在分隔符处增加一点间隔
      cursorX = messageX; // 更新光标位置
    }
  }
}

// 启动打字效果和光标闪烁
setTimeout(typeMessage, 2000);
blinkCursor();

// 在每次画布刷新时绘制已经打出来的字符
function animate() {
  drawTypedCharacters();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);


// 五秒后逐渐隐藏Canvas并显示实际内容
setTimeout(() => {
    const canvasContainer = document.getElementById('canvasContainer');
    canvasContainer.style.opacity = 0;
    setTimeout(() => {
      canvasContainer.style.display = 'none';
    }, 2000); // 匹配CSS中的transition时间
    setTimeout(() => {
        document.getElementById('mainContent').style.display = 'block';
    }, 1000); // 匹配CSS中的transition时间
}, 5000);
  

