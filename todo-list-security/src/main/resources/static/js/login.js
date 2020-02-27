function passwordCheck() {
    const passwordConfirm = document.getElementById('registerPassword2');

    if (passwordConfirm.value != document.getElementById('registerPassword').value) {
        passwordConfirm.setCustomValidity('Passwords Must Match');
    } else {
        passwordConfirm.setCustomValidity('');
    }
}