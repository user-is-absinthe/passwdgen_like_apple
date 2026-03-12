(function () {
// Базовые наборы
const UPPER_ALL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER_ALL = "abcdefghijklmnopqrstuvwxyz";
const DIGITS_ALL = "0123456789";
// Наборы без двусмысленных
const UPPER_NO_AMB = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER_NO_AMB = "abcdefghjkmnpqrstuvwxyz";
const DIGITS_NO_AMB = "23456789";
// Спецсимволы
const SPECIALS = "!@#$%^&*()_+[]{}<>?~.,;:|\/";
const PLACEHOLDER = "— — —";

function shuffleArray(arr) {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
        const j = randIndex(i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function generateRawWithRequirements(length, pool, opts) {
    const upper = opts.excludeAmbiguous ? UPPER_NO_AMB : UPPER_ALL;
    const digits = opts.excludeAmbiguous ? DIGITS_NO_AMB : DIGITS_ALL;
    const requiredChars = [];

    if (opts.requireUppercase && upper.length > 0) {
        requiredChars.push(upper[randIndex(upper.length)]);
    }
    if (opts.requireDigit && digits.length > 0) {
        requiredChars.push(digits[randIndex(digits.length)]);
    }

    if (requiredChars.length > 0) {
        const remainingLength = length - requiredChars.length;
        let result = [...requiredChars];
        
        if (remainingLength > 0) {
            for (let i = 0; i < remainingLength; i++) {
                result.push(randChar(pool));
            }
        }
        
        return shuffleArray(result).join('');
    }

    return generateRaw(length, pool);
}

function $(id) { return document.getElementById(id); }

function readInt(el, def, min, max) {
    let v = parseInt(el.value, 10);
    if (!Number.isFinite(v)) v = def;
    if (min != null) v = Math.max(min, v);
    if (max != null) v = Math.min(max, v);
    return v;
}

function buildCharset(opts) {
    const upper = opts.excludeAmbiguous ? UPPER_NO_AMB : UPPER_ALL;
    const lower = opts.excludeAmbiguous ? LOWER_NO_AMB : LOWER_ALL;
    const digits = opts.excludeAmbiguous ? DIGITS_NO_AMB : DIGITS_ALL;
    const specials = opts.includeSpecials ? SPECIALS : "";
    return upper + lower + digits + specials;
}

function randIndex(max) {
    const cryptoObj = (typeof crypto !== "undefined" && crypto.getRandomValues) ? crypto : null;
    if (!cryptoObj) return Math.floor(Math.random() * max);
    const arr = new Uint32Array(1);
    const limit = Math.floor(0xFFFFFFFF / max) * max;
    let r;
    do {
        cryptoObj.getRandomValues(arr);
        r = arr[0];
    } while (r >= limit);
    return r % max;
}

function randChar(pool) {
    return pool[randIndex(pool.length)];
}

function generateRaw(length, pool) {
    let s = "";
    for (let i = 0; i < length; i++) s += randChar(pool);
    return s;
}

function splitEvenly(total, groups) {
    groups = Math.max(1, Math.min(groups, total));
    const base = Math.floor(total / groups);
    const rem = total % groups;
    return Array.from({ length: groups }, (_, i) => base + (i < rem ? 1 : 0));
}

function chunkBySizes(s, sizes) {
    const out = [];
    let idx = 0;
    for (const size of sizes) {
        out.push(s.slice(idx, idx + size));
        idx += size;
    }
    return out;
}

function generatePassword(length, groups, opts) {
    if (!Number.isFinite(length) || length < 1) length = 12;
    if (!Number.isFinite(groups) || groups < 1) groups = 3;
    if (groups > length) groups = length;
    const pool = buildCharset(opts);
    if (!pool || pool.length === 0) {
        return "Набор символов пуст";
    }

    const raw = generateRawWithRequirements(length, pool, opts);
    const sizes = splitEvenly(length, groups);
    const parts = chunkBySizes(raw, sizes);
    return parts.join("-");
}

async function copyToClipboard(text) {
    if (!text) return false;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (_) { }
    try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
    } catch (_) {
        return false;
    }
}

function setBtnState(btn, text, ms = 900) {
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = text;
    setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
    }, ms);
}

function updateOnce(optsFromUI = true) {
    const length = readInt($("length"), 12, 1, 128);
    const groups = readInt($("groups"), 3, 1, 64);
    const opts = {
        excludeAmbiguous: $("excludeAmbiguous").checked,
        includeSpecials: $("includeSpecials").checked,
        requireUppercase: $("requireUppercase").checked,
        requireDigit: $("requireDigit").checked
    };
    const pwd = generatePassword(length, groups, opts);
    $("passwordOutput").textContent = pwd;
    return pwd;
}

async function handleGenerateAndCopy() {
    const pwd = updateOnce(true);
    const ok = await copyToClipboard(pwd);
    if (ok) setBtnState($("generateBtn"), "Скопировано ✓");
}

async function handleCopyCurrent() {
    const txt = $("passwordOutput").textContent.trim();
    if (!txt || txt === PLACEHOLDER) {
        return handleGenerateAndCopy();
    }
    const ok = await copyToClipboard(txt);
    if (ok) setBtnState($("copyBtn"), "Готово ✓");
}

function wireEvents() {
    $("generateBtn").addEventListener("click", handleGenerateAndCopy);
    $("copyBtn").addEventListener("click", handleCopyCurrent);
    $("excludeAmbiguous").addEventListener("change", updateOnce);
    $("includeSpecials").addEventListener("change", updateOnce);
    $("length").addEventListener("change", updateOnce);
    $("groups").addEventListener("change", updateOnce);
    $("requireUppercase").addEventListener("change", updateOnce);
    $("requireDigit").addEventListener("change", updateOnce);
}

document.addEventListener("DOMContentLoaded", () => {
    wireEvents();
    updateOnce(true);
});
})();
