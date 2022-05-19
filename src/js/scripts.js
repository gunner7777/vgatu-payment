let inputArray;
let formButton;

document.addEventListener("DOMContentLoaded", function () {
  const serviceList = getAllServiceListItem();
  const paymentFormOuter = document.querySelector(".payment-form__outer");
  const serviceListOuter = document.querySelector(".service-list__outer");
  initForm();

  serviceListOuter.addEventListener('click', function (event) {
    if (event.target.classList.contains("service-list__item")) {
      if (!event.target.classList.contains("service-list__item_active")) {
        setActiveCurrentServiceListItem(serviceList, event.target.dataset.idForm);
        ajaxLoadForm(event.target.dataset.idForm, paymentFormOuter);
      }
    }
  });

  paymentFormOuter.addEventListener('focusout', function (event) {
    if (event.target.classList.contains('payment-form__input')) {
      event.target.classList.add('touched');
      errorHandler(event.target);
      disableButton(checkValidForm(inputArray), formButton);
    }
  });

  paymentFormOuter.addEventListener('input', function (event) {
    if (event.target.classList.contains('payment-form__input')) {
      event.target.classList.add('touched');
      errorHandler(event.target);
      disableButton(checkValidForm(inputArray), formButton);
    }
  });

  paymentFormOuter.addEventListener('click', function (event) {
    if (event.target.classList.contains("payment-form__checkbox")) {
      const namePayer = document.querySelector('.payment-form__input[name="namePayer"]');
      const nameEdu = document.querySelector('.payment-form__input[name="nameEdu"]');
      if (namePayer && nameEdu && namePayer.value.length > 0) {
        if (event.target.checked) {
          nameEdu.value = namePayer.value;
          nameEdu.classList.add('touched');
          clearErrorMessage(nameEdu);
        } else {
          nameEdu.value = "";
        }
      }
    }
  });
});

/**
 * cast nodeList of menu item to Array
 * @returns {*[]} - array of menu item
 */
function getAllServiceListItem() {
  let sList = [];
  document.querySelectorAll('.service-list__item').forEach((element) => {
    sList = [...sList, element];
  });
  return sList;
}

/**
 * remove active class in menu items
 * @param itemsArray - array of service items
 * @param chosenIdForm - id chosen service item
 */
function setActiveCurrentServiceListItem(itemsArray, chosenIdForm) {
  itemsArray.map(item => {
    return (item.dataset.idForm !== chosenIdForm)
      ? item.classList.remove("service-list__item_active")
      : item.classList.add("service-list__item_active")
  });
}

function errorHandler(element) {
  const groupWithElement = element.parentNode.parentNode;
  let errorMessage = "";
  const errorElement = groupWithElement.querySelector(".payment-form__error");
  if (element.value.trim() === "") {
    element.classList.add('invalid');
    errorMessage = 'Обязательное значение';
    if (!errorElement) {
      setErrorMessageText(createErrorMessage(element), errorMessage);
    } else {
      setErrorMessageText(errorElement, errorMessage);
    }
  } else if (element.name === "payment") {
    if (!(/^[1-9][0-9]*(\.[0-9]{2})?$/.test(element.value))) {
      element.classList.add('invalid');
      errorMessage = 'Некорретное значение. Верный формат XXXX.XX';
      if (!errorElement) {
        setErrorMessageText(createErrorMessage(element), errorMessage);
      } else {
        setErrorMessageText(errorElement, errorMessage);
      }
    } else {
      clearErrorMessage(element);
    }
  } else {
    clearErrorMessage(element);
  }
}

/**
 * Create html paragraph element with error message and append after input. Template (label>input)+p.error
 * @param element - html input element
 * @returns {HTMLParagraphElement} - html element with error message
 */
function createErrorMessage(element) {
  const error = document.createElement('p');
  error.className = 'payment-form__error';
  error.innerHTML = 'Некорретное значение';
  element.parentNode.after(error);
  return error;
}

/**
 * Set or update error message
 * @param errorElement
 * @param message
 */
function setErrorMessageText(errorElement, message) {
  errorElement.innerHTML = message;
}

/**
 * Clear error state of input element and remove html paragraph element from DOM. Template (label>input)+p.error
 * @param element
 */
function clearErrorMessage(element) {
  if (element.parentNode.nextSibling) {
    element.classList.remove('invalid');
    element.parentNode.nextSibling.remove();
  }
}

/**
 * Check all input on valid
 * @param inputArray - array of NodeList html input elements
 * @returns {boolean} return && all input elements state
 */
function checkValidForm(inputArray) {
  let isValid = true;
  inputArray.forEach(input => {
    isValid = isValid && (input.classList.contains('touched') && !input.classList.contains('invalid'));
  });
  return isValid;
}

/**
 * Toggle disabled form submit button
 * @param isValid - result 'checkValidForm' function
 * @param button - form submit button
 */
function disableButton(isValid, button) {
  button.disabled = !isValid;
  if (isValid) {
    button.classList.remove('bfa-button-disabled');
    button.setAttribute('aria-disabled', false);
  } else {
    button.classList.add('bfa-button-disabled');
    button.setAttribute('aria-disabled', true);
  }
}

/**
 * async load form by id
 * @param idForm - id set in hidden input
 * @param formOuter - form wrapper
 */
function ajaxLoadForm(idForm, formOuter) {
  fetch(`./html/${idForm}.html?${Math.floor(Math.random() * 100)}`)
    .then(response => response.text())
    .then(html => {
      formOuter.innerHTML = html;
      initForm();
    });
}

/**
 * get new load form html input elements and button for disable form if it is not valid
 */
function initForm() {
  inputArray = document.querySelectorAll(".payment-form__input");
  formButton = document.querySelector(".payment-form__button");
}
