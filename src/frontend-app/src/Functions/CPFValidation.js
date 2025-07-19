function ValidationCPF(cpf){
    // Remove non-numeric characters
    cpf = cpf.replace(/[^\d]+/g, '');
    
    // Check if the CPF has 11 digits
    if (cpf.length !== 11) {
        return false;
    }
    
    // Check if all digits are the same (e.g., "11111111111")
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Validate the first digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let firstDigit = (sum * 10) % 11;
    if (firstDigit === 10) firstDigit = 0;
    
    if (parseInt(cpf[9]) !== firstDigit) {
        return false;
    }
    
    // Validate the second digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;
    
    return parseInt(cpf[10]) === secondDigit;
}
export default ValidationCPF;