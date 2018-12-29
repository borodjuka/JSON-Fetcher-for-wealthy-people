// Skripta za pristup stvarima na stranici, ali nema pristup odredjenim Chrome API-ima
// i zbog tog salje poruku koju prima fajl eventPage.js koji ima pristup Chrome APi-ima
chrome.runtime.sendMessage({ todo: 'showPageAction' });
