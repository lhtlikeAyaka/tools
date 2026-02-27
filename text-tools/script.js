const langData = {
    en: { back: "Home", input_label: "Input Text", placeholder: "Type or paste here...", btn_upper: "UPPERCASE", btn_lower: "lowercase", btn_clear: "Clear", btn_copy: "Copy", stat_chars: "Chars", stat_words: "Words", stat_lines: "Lines" },
    zh: { back: "返回首页", input_label: "输入文本内容", placeholder: "在此处输入或粘贴...", btn_upper: "全部大写", btn_lower: "全部小写", btn_clear: "清空内容", btn_copy: "复制内容", stat_chars: "字符数", stat_words: "单词数", stat_lines: "行数" },
    "zh-tw": { back: "返回首頁", input_label: "輸入文本內容", placeholder: "在此處輸入或貼上...", btn_upper: "全部大寫", btn_lower: "全部小寫", btn_clear: "清空內容", btn_copy: "複製內容", stat_chars: "字符數", stat_words: "單詞數", stat_lines: "行數" },
    ja: { back: "ホーム", input_label: "テキスト入力", placeholder: "ここに貼り付けてください...", btn_upper: "大文字", btn_lower: "小文字", btn_clear: "クリア", btn_copy: "コピー", stat_chars: "文字数", stat_words: "単語数", stat_lines: "行数" }
};

const textarea = document.getElementById('textContent');

// 监听输入，实时统计
textarea.addEventListener('input', () => {
    const text = textarea.value;
    document.getElementById('countChars').innerText = text.length;
    document.getElementById('countWords').innerText = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('countLines').innerText = text.trim() ? text.split('\n').length : 0;
});

function handleText(type) {
    if (type === 'upper') textarea.value = textarea.value.toUpperCase();
    if (type === 'lower') textarea.value = textarea.value.toLowerCase();
    if (type === 'clear') {
        textarea.value = '';
        textarea.dispatchEvent(new Event('input'));
    }
}

function copyText() {
    navigator.clipboard.writeText(textarea.value);
    alert("Copied!");
}

// i18n 逻辑
function updateUI(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = langData[lang][el.getAttribute('data-i18n')];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = langData[lang][el.getAttribute('data-i18n-placeholder')];
    });
    document.getElementById('langSelect').value = lang;
    document.getElementById('body').style.opacity = 1;
}

function changeLang(lang) {
    localStorage.setItem('lht_lang', lang);
    updateUI(lang);
}

const currentLang = localStorage.getItem('lht_lang') || (navigator.language.includes('zh') ? (navigator.language.includes('tw') ? 'zh-tw' : 'zh') : (navigator.language.includes('ja') ? 'ja' : 'en'));
updateUI(currentLang);
