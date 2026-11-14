// Server-side validation helpers. Every endpoint returns field level errors
// in the same shape so the client can render them next to the inputs.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateRegister(body) {
  const errors = {};
  const firstName = String(body.firstName ?? '').trim();
  const lastName = String(body.lastName ?? '').trim();
  const email = String(body.email ?? '').trim();
  const password = String(body.password ?? '');

  if (!firstName) errors.firstName = 'First name is required';
  else if (firstName.length > 50) errors.firstName = 'First name is too long';

  if (lastName.length > 50) errors.lastName = 'Last name is too long';

  if (!email) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address';

  if (!password) errors.password = 'Password is required';
  else if (password.length < 8) errors.password = 'Use at least 8 characters';
  else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = 'Use both letters and numbers';
  }

  if (body.storeName !== undefined) {
    const storeName = String(body.storeName ?? '').trim();
    if (!storeName) errors.storeName = 'Store name is required';
    else if (storeName.length < 3) errors.storeName = 'Store name must be at least 3 characters';
    else if (storeName.length > 60) errors.storeName = 'Store name is too long';
  }

  return errors;
}

function validateLogin(body) {
  const errors = {};
  const email = String(body.email ?? '').trim();
  const password = String(body.password ?? '');

  if (!email) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';

  return errors;
}

function validateProduct(body) {
  const errors = {};
  const name = String(body.name ?? '').trim();
  const price = Number(body.price);
  const stock = Number(body.stock);
  const description = String(body.description ?? '').trim();
  const category = String(body.category ?? '').trim();
  const pictureUrl = String(body.pictureUrl ?? '').trim();

  if (!name) errors.name = 'Product name is required';
  else if (name.length < 3) errors.name = 'Product name must be at least 3 characters';
  else if (name.length > 120) errors.name = 'Product name is too long';

  if (!Number.isFinite(price)) errors.price = 'Price is required';
  else if (price <= 0) errors.price = 'Price must be greater than 0';
  else if (price > 100000) errors.price = 'Price looks too high';

  if (!Number.isFinite(stock)) errors.stock = 'Stock is required';
  else if (stock < 0) errors.stock = 'Stock cannot be negative';
  else if (stock > 100000) errors.stock = 'Stock looks too high';

  if (!category) errors.category = 'Choose a category';
  if (description.length > 2000) errors.description = 'Description is too long';
  if (!pictureUrl) errors.pictureUrl = 'Choose a product photo';

  return errors;
}

function validateAddress(address) {
  const errors = {};
  const value = address ?? {};

  if (!String(value.fullName ?? '').trim()) errors.fullName = 'Full name is required';
  const phone = String(value.phone ?? '').trim();
  if (!phone) errors.phone = 'Phone number is required';
  else if (!/^[0-9+\-\s()]{7,20}$/.test(phone)) errors.phone = 'Enter a valid phone number';
  if (!String(value.city ?? '').trim()) errors.city = 'City is required';
  if (!String(value.street ?? '').trim()) errors.street = 'Street address is required';

  return errors;
}

function validateOrder(body) {
  const errors = {};

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.items = 'An order needs at least one item';
  } else {
    body.items.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors[`items.${index}`] = 'Invalid item';
        return;
      }
      if (!Number.isFinite(Number(item.productId))) errors[`items.${index}`] = 'Invalid product';
      if (!Number.isFinite(Number(item.quantity)) || Number(item.quantity) < 1) {
        errors[`items.${index}`] = 'Quantity must be at least 1';
      }
    });
  }

  if (!Number.isFinite(Number(body.total)) || Number(body.total) <= 0) {
    errors.total = 'Order total is invalid';
  }

  Object.assign(errors, validateAddress(body.address));

  return errors;
}

module.exports = { validateRegister, validateLogin, validateProduct, validateOrder, validateAddress };
