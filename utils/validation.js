const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  return usernameRegex.test(username);
};
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isStrongPassword = (password) => {
  const strongPassRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return strongPassRegex.test(password);
};

function isValidUrl(url) {
  const pattern = new RegExp(
    "^https?:\\/\\/" +
      "([\\w-]+\\.)+[\\w-]+" +
      "(\\:[0-9]{1,5})?" +
      "(\\/[^\\s]*)?$",
    "i"
  );
  return pattern.test(url);
}

module.exports = {
  isValidUsername,
  isValidEmail,
  isStrongPassword,
  isValidUrl,
};
