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
const displayMovements = function (movements, sort = false) {
  // html içindeki değerleri temizliyoruz
  containerMovements.innerHTML = '';

  // ascending sıralama için sort metodunu kullanıyoruz
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // foreach döngüsü ile hareketlerini listeliyoruz
  movs.forEach(function (mov, i) {
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
  // Hesaba gelen miktarları hesaplıyoruz
  const incomes = acc.movements
    // önce sıfırdan büyük olan miktarları filtreliyoruz
    .filter(mov => mov > 0)
    // filtrelenen miktarların toplamını buluyoruz
    .reduce((acc, mov) => acc + mov, 0);
  // toplam miktarı ilgili label alanına yazdırıyoruz
  labelSumIn.textContent = ` ${incomes}€ `;

  // Hesaptan çıkan miktarı hesaplıyoruz
  const outgoing = acc.movements
    /// sıfırdan küçük olan miktarları filtreliyoruz
    .filter(mov => mov < 0)
    // filtrelenen miktarları toplamını buluyoruz.
    .reduce((acc, mov) => acc + mov, 0);
  // bulunan miktarı ilgili label alanına yazdırıyoruz
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
  // array ile gelen hesap bilgilerini foreach ile dönüyoruz
  accs.forEach(function (acc) {
    acc.username = acc.owner
      // owner verisini tüm harfleri küçültme işlemi
      .toLowerCase()
      // boşluklardan ayırıyoruz
      .split(' ')
      // map ile ayrılan objelerin birinci elementlerini seçiyoruz
      .map(name => name[0])
      // join ile seçilen elemenleri birleştiriyoruz
      .join('');
  });
};
// fonksiyona ilgili array dizisini gönderiyoruz
createUsernames(accounts);

// hesap arayüzünü günceleyen fonksiyon
const updateUI = function (acc) {
  // Hesap hareketleri fonksiyonuna giriş yapan hesabın array dizisini gönderiyoruz
  displayMovements(acc.movements);

  // Hesap toplam miktarı gösteren fonksiyona giriş yapan hesap bilgisini gönderiyoruz
  calcDisplayBalance(acc);

  // Hesap özetleri fonksiyonuna giriş yapan hesap bilgisini gönderiyoruz
  calcDisplaySummary(acc);
};

// Giriş yapan hesap değişkeni
let currenAccount;

// Hesap giriş eventi
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // giriş yapan username ve pin kodunu kontrol ediyoruz
  currenAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currenAccount?.pin === Number(inputLoginPin.value)) {
    // sonuç true wellcome mesajı ve hesabın adı yazdırılıyor
    labelWelcome.textContent = `Wellcome back, ${
      currenAccount.owner.split(' ')[0]
    }`;
    // Arayüz opasitesi değiştirilerek görünür oluyor
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // update ui fonksiyonunu giriş yapan hesap bilgisi gönderiliyor
    updateUI(currenAccount);
  } else {
    // şifre veya kullanıcı adı hatalı ise
    alert('Wrong Password or Username');
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

// kredi talebi alanı için eventi tanımlıyoruz
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // talep edilen miktar için değişkenimizi tanımlıyoruz.
  const amount = Number(inputLoanAmount.value);
  // İlgili koşulları tanımlıyoruz.
  // some metoduyla talep edilen miktar, mevcut hesaptaki en büyük miktarın maksimum 10 katı kadar olabilir
  if (amount > 0 && currenAccount.movements.some(mov => mov >= amount / 10)) {
    // Add movement
    currenAccount.movements.push(amount);
    // update UI
    updateUI(currenAccount);
  } else {
    alert(
      'bu miktar için hesabınız müsait değil. lütfen daha küçük bir miktar deneyin'
    );
  }
  inputLoanAmount.value = '';
});

// Hesabı silme eventi
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // input alanınan girilen verileri mevcut değerler ile karşılaştırıyoruz
  if (
    inputCloseUsername.value === currenAccount.username &&
    Number(inputClosePin.value) === currenAccount.pin
  ) {
    //input alanına girilen bilgileri findindex metoduyla kullanıcı hesabı ile eşleştiriyoruz
    const index = accounts.findIndex(
      acc => acc.username === currenAccount.username
    );

    // Splice methoduyla hesabı siliyoruz
    accounts.splice(index, 1);

    // İşlem sonrasında arayüzü gizliyoruz.
    containerApp.style.opacity = 0;
  }
  // işlem sonrası input alanlarındaki yazıları temizliyoruz
  inputCloseUsername.value = inputClosePin.value = '';
  // İşlem sonrası wellcome mesajını güncelliyoruz
  labelWelcome.textContent = 'Log in to get started';
});

// Hesap hareketlerini sıralama değişkeni
let sorted = false;

// Hesap hareketlerini sıralama eventi
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  // Sort butonu tıklandığında true olarak parametre gönderiyoruz
  displayMovements(currenAccount.movements, !sorted);
  // Butona tekrar tıklandığında tekrar false değeri almasını sağlıyoruz
  sorted = !sorted;
});

///////////////// ARRAY LECTURE

//// 1.
// Tüm hesapların toplamını veren değişkeni tanımlıyoruz
const bankDepositSum = accounts
  // flat map ile map ve flat methodlarını bir arada kullanabiliyoruz
  .flatMap(acc => acc.movements)
  // filter metodu ile sadece sıfırdan büyük rakamları getiriyoruz
  .filter(mov => mov > 0)
  // reduce metodu ile rakamları birbirleri ile toplamını buluyoruz
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

//// 2.
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
console.log(numDeposits1000);

//// 3.
const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);

/// object destructuring yaparsak
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

//// 4.
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
