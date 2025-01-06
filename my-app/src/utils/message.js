const showMessage = (shown, title, text, titleText, messageText) => {
    console.log(shown, title, text, titleText, messageText);
    shown.set(true);
    title.set(titleText);
    text.set(messageText);
    document.getElementById('header').scrollIntoView({ behavior: 'smooth' });
};

export { showMessage };