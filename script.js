'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////

// Hesap hareketlerini listelediğimiz fonksiyon
const displayMovements = function (movements) {
  // html içindeki değerleri temizliyoruz
  containerMovements.innerHTML = '';
  // foreach döngüsü ile hareketlerini listeliyoruz
  movements.forEach(function (mov, i) {
    // hareketin türüne göre text yazdırıyoruz
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // döngüde her satıra eklenecek html değerleri tanımlıyoruz
    const html = `
<div class="movements__row">
<div class="movements__type movements__type--${type}"> ${i + 1} ${type} </div>
<div class="movements__value"> ${mov}€</div>
</div>`;
    // html değerleri ilgili query alınan gönderiyoruz
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Hesapta bulunan miktarı listelemek için fonksiyonu kullanıyoruz
const calcDisplayBalance = function (acc) {
  // balance hesaplamasını yapıyoruz
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // balance değerini tanımlandığımız label alanına yazdırıyoruz
  labelBalance.textContent = `${acc.balance} €`;
};

// Hesap özetlerini listeleyen fonksiyon
const calcDisplaySummary = function (acc) {
  // Hesaba gelen miktarı hesaplıyoruz
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = ` ${incomes}€ `;

  // Hesaptan çıkan miktarı hesaplıyoruz
  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = ` ${Math.abs(outgoing)}€ `;

  // Hesaba tanımlanan faizi hesaplıyoruz.
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = ` ${interest}€ `;
};

// Kullanıcı adı oluşturan fonksiyon
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// hesap arayüzünü günceleyen fonksiyon
const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

let currenAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currenAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currenAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and wellcome message
    labelWelcome.textContent = `Wellcome back, ${
      currenAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currenAccount);
  }
});

/// Para transferi için event fonksiyonu tanımlıyoruz
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // Girilen değer için değişken tanımlıyoruz
  const amount = Number(inputTransferAmount.value);

  // Alıcı hesap için değişken tanımlıyoruz
  const receiverAcc = accounts.find(
    // alıcının kullanıcı adını kontrol ediyoruz
    acc => acc.username === inputTransferTo.value
  );

  // işlem sonrası input alanlarındaki yazıları temizliyoruz
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    // miktar sıfırdan büyük olmalı
    amount > 0 &&
    // kullanıcı adı gerçek olmalı
    receiverAcc &&
    // mevcut hesap bakiyesi yeterli olmalı
    currenAccount.balance >= amount &&
    // alıcı hesap adı gönderen hesaptan farklı olmalı
    receiverAcc.username !== currenAccount.username
  ) {
    // gönderen hesaptan girilen miktar düşüyoruz
    currenAccount.movements.push(-amount);

    // alıcı hesaba girilen miktarı push ediyoruz
    receiverAcc.movements.push(amount);

    // İşlemin arayüzde görünür olmasını sağlayan fonksiyonu çalıştırıyoruz.
    updateUI(currenAccount);
  }
});
